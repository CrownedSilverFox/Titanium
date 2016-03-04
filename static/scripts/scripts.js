var red_num = 0;
var yellow_num = 0;
var blue_num = 0;
var green_num = 0;
var yellow_src = 'http://www.komus.ru/photo/_full/331966_1.jpg';
var red_src = 'http://static.ofisshop.ru/iblock/089/089ba49b21a547fd17f77bca070517c6.png';
var TEAM = "red";
var questData;

$(document).ready(function () {
    load_desk();
    load_questions();
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

function load_questions() {
    $.getJSON("data/questions.json", onDataLoad)
}

function on_question_click(id) {
    var answBlock = $("#answer_choice");
    answBlock.empty();
    for (var key in questData) {
        for (var i = 0; i < questData[key].length; i++) {
            if (id == questData[key][i].id) {
                for (var j = 0; j < (questData[key][i]["answers"]).length; j++) {
                    var line = '<input type="radio" id="'+ j + '' + questData[key][i].id +'"><label>'
                        + questData[key][i]["answers"][j] +'</label><br>';
                    answBlock.append(line);
                    //var radio = $('<input />', {type: 'radio', id: 'q' + id})

                }
            }
        }
    }
}

function on_table_click(id) {
    var td = $('#' + id);
    var img = $('<img />', {src: yellow_src});
    td.html(img);
    yellow_num++;
    red_num--;
    console.log('' + yellow_num + ':' + red_num)
}
