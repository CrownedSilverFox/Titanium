var red_num = 0;
var yellow_num = 0;
var blue_num = 0;
var green_num = 0;
var yellow_src = 'http://www.komus.ru/photo/_full/331966_1.jpg';
var red_src = 'http://static.ofisshop.ru/iblock/089/089ba49b21a547fd17f77bca070517c6.png';
var TEAM = "red";

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
function load_questions() {
    var table = $('#questions');
    var onclick = "on_question_click(id)";
    var json = $.getJSON("data/questions.json");
    console.log(json);
    for (var i = 0; i < 4; i++) {
        var tr = $(document.createElement('tr'));
        for (var j = 0; j < 4; j++) {
            var td = $(document.createElement('td'));
            var button = $('<button />', {text: 'Вопрос' + (j + 1)});
            button.attr('id', ('2_' + i) + ('_' + j));
            td.append(button);
            tr.append(td);
            button.attr('onclick', onclick)
        }
        table.append(tr)
    }
}

function on_question_click(id) {
    var student = {name: "Vasya"};
    $.post("http://localhost:8000/test", JSON.stringify(student),
        function (data, status) {
            console.log(data);
            console.log(status);
        });
}

function on_table_click(id) {
    var td = $('#' + id);
    var img = $('<img />', {src: yellow_src});
    td.html(img);
    yellow_num++;
    red_num--;
    console.log('' + yellow_num + ':' + red_num)
}
