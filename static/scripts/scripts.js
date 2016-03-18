var red_num = 0;
var yellow_num = 0;
var blue_num = 0;
var green_num = 0;
var yellow_src = 'http://www.komus.ru/photo/_full/331966_1.jpg';
var red_src = 'http://static.ofisshop.ru/iblock/089/089ba49b21a547fd17f77bca070517c6.png';
var team;
var questData;
var status;

$(document).ready(function () {
    $.post('http://localhost:8000/register', function (data) {
        console.log(data);
        if (data != 'GAME_FULL') {
            team = data;
        } else {
            status = data
        }
        console.log(team)
    });
    load_desk();
    $.getJSON("data/questions.json", onDataLoad);
    setTimeout(change_status(), 1000)
});

function load_desk() {
    var table = $('#board1');
    var onclick1 = "on_table_click(id)";
    for (var i = 0; i < 10; i++) {
        var tr = $(document.createElement('tr'));
        for (var j = 0; j < 10; j++) {
            var td = $(document.createElement('td'));
            td.attr('id', ('' + i) + ('_' + j));
            td.attr('onclick', onclick1);
            if ((i <= 4) && (j <= 4)) {
                var img = $('<img />', {src: yellow_src});
                yellow_num++
            }
            if ((i <= 4) && (j > 4)) {
                var img = $('<img />', {src: red_src});
                red_num++
            }
            if ((i > 4) && (j <= 4)) {
                var img = $('<img />', {src: yellow_src});
                yellow_num++
            }
            if ((i > 4) && (j > 4)) {
                var img = $('<img />', {src: red_src});
                red_num++
            }
            td.append(img);
            tr.append(td);
        }
        table.append(tr)
    }
}

function onDataLoad(data){
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

function on_question_click(id) {
    var answBlock = $("#answer_choice");
    var questBlock = $("#Question");
    answBlock.empty();
    questBlock.empty();
    for (var key in questData) {
        for (var i = 0; i < questData[key].length; i++) {
            if (id == questData[key][i].id) {
                var question = '<label>' + questData[key][i].text + '</label>';
                questBlock.append(question);
                for (var j = 0; j < (questData[key][i]["answers"]).length; j++) {
                    var line = '<input type="radio" id="'+ (j+1) + '' + questData[key][i].id
                        + '" onclick=on_answer_click(id)' + ' name="answChoice"' + '><label>'
                        + questData[key][i]["answers"][j] +'</label><br>';
                    answBlock.append(line);
                }
            }
        }
    }
}

function on_answer_click(id) {
    var out = {};
    var answLog = $('#answerLog');
    answLog.empty();
    out.id = id.slice(1);
    out.answer = id[0];
    $.post('http://localhost:8000/answer', JSON.stringify(out), function(data) {
        console.log(data)
    })
}

function on_table_click(id) {
    var td = $('#' + id);
    var img = $('<img />', {src: yellow_src});
    td.empty();
    td.append(img);
}

function change_status() {
    setInterval(function () {
        if (status != 'GAME_FULL') {
            $.post('http://localhost:8000/status', function (data) {
                status = data
            });
        }
        if (status.indexOf(team) > -1) {
                $('.block').show();
            } else {
                $('.block').hide();
            }
            var status_block = $('#status');
            status_block.empty();
            status_block.append("<label>" + status + "</label>");
    }, 500)
}