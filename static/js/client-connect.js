var log;
var uri = "/websocket";
var points = 0;
var yellow_src = 'http://www.komus.ru/photo/_full/331966_1.jpg';
var red_src = 'http://static.ofisshop.ru/iblock/089/089ba49b21a547fd17f77bca070517c6.png';
var team;
var questData;
var state = 0;
var desk;
var quests;
var ws;

function Form(selector){
    var self = this;
    var $form = $(selector);
    self.$host = $("input[name='host']");
    self.$port = $("input[name='port']");
    self.uri = uri;

    $("#btn_connect").click(function (evt) {
        evt.preventDefault();
        ws.connect(self.$host.val(), self.$port.val(), self.uri, self);
    });

    this.hide = function(){
        $form.hide();
    };

    this.show = function(){
        $form.show();
    };
}

function Desk(selector) {
    var self = this;
    self.inf = {};
    var table = $(selector);
    var onclick1 = "desk.onClick(id)";
    for (var i = 0; i < 10; i++) {
        var tr = $(document.createElement('tr'));
        for (var j = 0; j < 10; j++) {
            var td = $(document.createElement('td'));
            td.attr('id', ('' + i) + ('_' + j));
            td.attr('onclick', onclick1);
            if ((i <= 4) && (j <= 4)) {
                var img = $('<img />', {src: yellow_src});
            }
            if ((i <= 4) && (j > 4)) {
                var img = $('<img />', {src: red_src});
            }
            if ((i > 4) && (j <= 4)) {
                var img = $('<img />', {src: yellow_src});
            }
            if ((i > 4) && (j > 4)) {
                var img = $('<img />', {src: red_src});
            }
            td.append(img);
            tr.append(td);
        }
        table.append(tr)
    }

    this.onClick = function (id) {
        var td = $('#' + id);
        var img = $('<img />', {src: yellow_src});
        td.empty();
        td.append(img);
    };

    this.hide = function(){
        table.hide();
    };

    this.show = function(){
        table.show();
    };
}

function QuestChoice(selector) {
    var self = this;
    var $table = $(selector);
    var onclick = "quests.onClick(id)";
    this.init = function(data) {
        console.log("questions init");
        console.log("data = ", data);
        $table.empty();
        var questions = data.questions;
        for (var key in questions) {
            var tr = $(document.createElement('tr'));
            for (var i = 0; i < questions[key].length; i++) {
                var td = $(document.createElement('td'));
                var button = $('<button />', {text: key + ': ' + questions[key][i].cost});
                button.attr('id', "" + questions[key][i].id);
                td.append(button);
                tr.append(td);
                button.attr('onclick', onclick)
            }
            $table.append(tr)
        }
        // Блокирует кнопки выбора вопроса
        $table.find("button").attr("disabled", "disabled");
    };
    this.onClick = function(id) {
        var data = {'key': 'quest_sel', 'id': id};
        ws.send(data);
        $table.hide();
    };
    this.unblock = function(){
        // Разблокирует кнопки выбора вопроса
        $table.find("button").prop( "disabled", false );
    };

    this.show = function(){
        $table.show();
    };
}

function AnswerChoice(selector) {
    var self = this;
    var $obj = $(selector);
    this.init = function(data) {
        var text = data.question.text;
        $obj.html('<b>'+text+'</b>');
    };
    this.send_answer = function(){
        ws.send("");
    }
}

$(function () {
    log = function (data) {
        $("div#terminal").prepend("</br>" + data);
        console.log(data);
    };
    var send = $("#btn_send");
    var connect_form = new Form("form.form-connect");
    desk = new Desk('#board');
    desk.hide();
    quests = new QuestChoice('#questions');
    ws = new WS();
    ws.handleEvents(quests.init, 'questions');
    ws.handleEvents(quests.unblock, 'quest_sel');

    var register_led = new RegisterLED('.RegisterLED');
    ws.handleEvents(register_led.on_change, 'register');

    var answer_choice = new AnswerChoice("#answer_choice");
    ws.handleEvents(answer_choice.init, "question");
});

