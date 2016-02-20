var red_num = 0;
var yellow_num = 0;
var blue_num = 0;
var green_num = 0;
var yellow_src = 'http://www.komus.ru/photo/_full/331966_1.jpg';
var red_src = 'http://static.ofisshop.ru/iblock/089/089ba49b21a547fd17f77bca070517c6.png'

$(document).ready(function () {
    load_table();
});

function load_table() {
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

function on_click(who) {
    $('#name').html('petya')
}

function on_table_click(id) {
    var td = $('#'+id);
    var img =  $('<img />', {src: yellow_src});
    td.html(img);
    yellow_num++;
    console.log(''+yellow_num+':'+red_num)
}
