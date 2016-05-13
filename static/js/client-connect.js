var log;
var uri = "/websocket";
var team;
var desk;
var quests;
var ws;
var timer;

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
    var $obj = $(selector);
    this.init = function(data) {
        var onclick1 = "desk.onClick(id)";
        for (var i = 0; i < 10; i++) {
            var tr = $(document.createElement('tr'));
            for (var j = 0; j < 10; j++) {
                var td = $(document.createElement('td'));
                td.attr('id', ('' + i) + ('_' + j));
                td.attr('onclick', onclick1);
                var img = $('<img />', {src: data.matrix[i][j]});
                td.append(img);
                tr.append(td);
            }
            $obj.append(tr)
        }
        $obj.show();
    };
    this.onClick = function (id) {
        ws.send({'key': 'mark', 'i': id[0], 'j': id[2]})
    };

    this.hide = function(){
        $obj.hide();
    };

    this.show = function(){
        $obj.show();
    };

    this.change = function(data) {
        var $mark = $('#'+data.i+'_'+data.j);
        $mark.empty();
        var img = $('<img />', {src: data.image});
        $mark.append(img);
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
    this.hide = function() {
        $table.hide();
    }
}

function AnswerChoice(selector) {
    var self = this;
    var $obj = $(selector);
    this.init = function(data) {
        $obj.empty();
        var text = '<label>'+data.question.text+'</label><br>';
        $obj.append(text);
        for (var i = 0; i < 4; i++) {
            var line = '<input type="radio" name="answChoice"><label>' + data.question.answers[i] +
                '</label><br>';
            $obj.append(line);
        }
        quests.hide();
        self.show();
    };
    this.send_answer = function(){
        var answRadios = document.getElementsByName('answChoice');
        var answer = {'checkedAnswer': -1, 'key': 'answer_checked'};
        for (var i = 0; i < 4; i++) {
            if (answRadios[i].checked) {
                answer.checkedAnswer = i+1;
            }
        }
        ws.send(answer);
        self.hide();
        timer.hide();
    };
    this.hide = function () {
        $obj.hide();
    };
    this.show = function () {
        $obj.show();
    }
}

function Timer(selector) {
    var self = this;
    var $obj = $(selector);
    this.changeTime = function(data) {
        $obj.empty();
        $obj.append('<label>Времени осталось: '+data.time+'</label>');
        self.show();
    };
    this.hide = function () {
        $obj.hide()
    };
    this.show = function () {
        $obj.show()  
    }
}

function Points(selector) {
    var self = this;
    var $obj = $(selector);
    this.pointsChanged = function(data) {
        $obj.empty();
        $obj.append('<label>Ваши очки: '+data.points+'</label>');
        self.show();
    };
    this.hide = function () {
        $obj.hide()
    };
    this.show = function () {
        $obj.show()
    };
}

$(function () {
    log = function (data) {
        $("div#terminal").prepend("</br>" + data);
        console.log(data);
    };
    var send = $("#btn_send");
    var connect_form = new Form("form.form-connect");
    quests = new QuestChoice('#questions');
    ws = new WS();
    ws.handleEvents(quests.init, 'questions');
    ws.handleEvents(quests.unblock, 'quest_sel');

    var register_led = new RegisterLED('.RegisterLED');
    ws.handleEvents(register_led.on_change, 'register');

    var answer_choice = new AnswerChoice("#answer_choice");
    ws.handleEvents(answer_choice.init, "question");
    ws.handleEvents(answer_choice.send_answer, 'time_up');
    
    timer = new Timer('#timer');
    ws.handleEvents(timer.changeTime, 'time');

    var points = new Points('#points');
    ws.handleEvents(points.pointsChanged, 'points');

    desk = new Desk('#board');
    desk.hide();
    ws.handleEvents(desk.init, 'matrix');
    ws.handleEvents(desk.change, 'mark');

});

