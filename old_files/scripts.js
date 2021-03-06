var points = 0;
var yellow_src = 'http://www.komus.ru/photo/_full/331966_1.jpg';
var red_src = 'http://static.ofisshop.ru/iblock/089/089ba49b21a547fd17f77bca070517c6.png';
var team;
var questData;
var state = 0;
var chosenA = true;
var timer;
var time = 1;

$(document).ready(function () {
    $.post('http://localhost/register', function (data) {
        console.log(data);
        if (data != 'GAME_FULL') {
            team = data;
        } else {
            state = data
        }
        console.log(team)
    });

    $.getJSON("data/questions.json", onDataLoad);
    setTimeout(change_status, 1000);
});



function onDataLoad(data) {
    var table = $('#questions');
    var onclick = "on_question_click(id)";
    questData = data;
    for (var key in data) {
        var tr = $(document.createElement('tr'));
        for (var i = 0; i < data[key].length; i++) {
            var td = $(document.createElement('td'));
            var button = $('<button />', {text: key + ': ' + data[key][i].cost});
            button.attr('id', "" + data[key][i].id);
            td.append(button);
            tr.append(td);
            button.attr('onclick', onclick)
        }
        table.append(tr)
    }
}

function on_question_choice(quest) {
    chosenA = false;
    var answBlock = $("#answer_choice");
    var questBlock = $("#Question");
    answBlock.empty();
    questBlock.empty();
    var question = '<label>' + quest.text + '</label>';
    questBlock.append(question);
    for (var i = 0; i < 4; i++) {
        var line = '<input type="radio" name="answChoice"><label>' + quest["answers"][i] + '</label><br>';
        answBlock.append(line);
    }
    console.log("run timer");
    timer = setInterval(answer_timer, 1000)
}



function change_status() {
    setInterval(function () {
        if (state != 'GAME_FULL') {
            $.post('http://localhost/status', function (data) {
                state = JSON.parse(data);
            });
            if (state && ((state['status'].indexOf(team) > -1) || (state['status'] == 'answer_c'))) {
                $('.block').show();
            } else {
                $('.block').hide();
            }
            if ((state.status == 'answer_c') && (chosenA)) {
                on_question_choice(state.quest)
            }
            if (state.status != 'answer_c') {
                chosenA = true
            }
        }
        var status_block = $('#status');
        status_block.empty();
        if (state["players_waiting"] == 0) {
            status_block.append("<label>" + state['status'] + "</label>");
        } else {
            status_block.append("<label>" + state['status'] + " : " + state['players_waiting'] + "</label>");
        }
    }, 500)
}
function on_question_click(id) {
    $.post('http://localhost/quest', JSON.stringify(id), function (data) {
        console.log(data)
    });
}

function answer_timer() {
    time++;
    var timeblock = $('#time');
    timeblock.empty();
    timeblock.append('<label> Времени на ответ осталось: ' + time + '</label>');
    if (time == 5) {
        clearInterval(timer);
        timeblock.empty();
        time = 0;
        var answRadios = document.getElementsByName('answChoice');
        var answer = {'checkedAnswer': 0};
        for (var i = 0; i < 4; i++) {
            if (answRadios[i].checked) {
                console.log('!!!' + i);
                answer.checkedAnswer = i+1;
            }
        }
        $.post('http://localhost/answer', JSON.stringify(answer), function (data) {
            points = JSON.parse(data).points;
            refreshPoints();
        })
    }
}

function refreshPoints() {
    var pointsBlock = $('#points');
    pointsBlock.empty();
    pointsBlock.append('<label> Ваши очки: ' + points + '</label>')
}