var log;
var uri = "/websocket";
var desk;
var quests;
var ws;
var timer;
var state;

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
        self.show();
        $obj.empty();
        if ((document.getElementById('points').textContent) && (document.getElementById('points').textContent[11] == '0')){
            self.onClick('0 0');
        }
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
        state.refr('Распределите очки/Ожидайте остальных игроков');
        quests.hide();
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
        self.block();
    };
    this.onClick = function(id) {
        var data = {'key': 'quest_sel', 'id': id};
        ws.send(data);
        $table.hide();
    };
    this.unblock = function(){
        // Разблокирует кнопки выбора вопроса
        $table.find("button").prop( "disabled", false );
        $table.find("button").css({backgroundColor: "#4CAF50"});
        self.show();
        state.refr('Выберите вопрос');
    };

    this.show = function(){
        $table.show();
    };
    this.hide = function() {
        $table.hide();
    };
    this.block = function () {
        // Блокирует кнопки выбора вопроса
        $table.find("button").attr("disabled", "disabled");
        $table.find("button").css({backgroundColor: "#e7e7e7"});
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
        desk.hide();
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
        quests.show();
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
        state.refr('Выберите ответ на вопрос');
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
        $obj.append('<br/>');
        $obj.append('<label>Пожалуйста, распределите их ВСЕ.</label>');
        self.show();
    };
    this.hide = function () {
        $obj.hide()
    };
    this.show = function () {
        $obj.show()
    };
}

function Team(selector) {
    var self = this;
    var $obj = $(selector);
    this.init = function(data) {
        $obj.append($('<label>'+'Ваша команда: '+data.color+'</label>').css({backgroundColor: data.color.toLowerCase()}))
    }
}

function Marks(selector) {
    var self = this;
    var $obj = $(selector);
    $('#markscon').hide();
    this.refr = function(data) {
        $('#markscon').show();
        $obj.empty();
        for (var i = 0; i < 4; i++) {
            var line = '<label>'+data.teams[i]+': '+data.marks[data.teams[i]]+'<label>';
            $obj.append($(line));
            $obj.append('<br/>');
        }
    }
}

function End(selector) {
    var $obj = $(selector);
    var self = this;
    this.init = function(data) {
        $('div').hide();
        $obj.show();
        $obj.append($('<label>ПОБЕДИТЕЛЬ: '+data.winner+'</label>').css({backgroundColor: data.winner.toLowerCase()}));
        $obj.append('<br/>');
        $obj.append('<br/>');
        for (var i = 0; i < 4; i++) {
            var line = $('<label>'+data.teams[i]+': '+data.marks[data.teams[i]]+'<label>');
            line.css({backgroundColor: data.teams[i].toLowerCase()});
            $obj.append(line);
            $obj.append('<br/>');
        }
    };
}

function State(selector) {
    var $obj = $(selector);
    var self = this;
    this.refr = function (text) {
        $obj.empty();
        $obj.append($('<label>'+text+'</label>'));
    }
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

    var team = new Team('#team');
    ws.handleEvents(team.init, 'color');

    var marks = new Marks('#marks');
    ws.handleEvents(marks.refr, 'marks');

    var end = new End('#end');
    ws.handleEvents(end.init, 'end');

    state = new State('#state');
});

