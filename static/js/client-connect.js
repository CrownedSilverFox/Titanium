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
        ws = new WS(self.$host.val(), self.$port.val(), self.uri, self);
        var user = new NewUser();
        //console.log("!!!!");
        ws.handleEvents(user.oncreate, "newuser");
        //ws.onmessage = function (evt) {
        //    log("message received: " + evt.data)
        //};
        //
        //ws.onclose = function (evt) {
        //    log("***Connection Closed***");
        //    self.$port.css("background", "#ff0000");
        //    self.$host.css("background", "#ff0000");
        //    self.show();
        //};
        //
        //ws.onopen = function (evt) {
        //    log("***Connection Open***");
        //    $("input[name='host']").css("background", "#00ff00");
        //    $("input[name='port']").css("background", "#00ff00");
        //    self.hide();
        //};
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
        $form.hide();
    };

    this.show = function(){
        $form.show();
    };
}

function NewUser(){
    var self = this;
    this.oncreate = function(data){
        console.log("Create new User, data = ", data)
    }
}

function questChoice(data) {
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

$(function () {
    log = function (data) {
        $("div#terminal").prepend("</br>" + data);
        console.log(data);
    };
    var send = $("#btn_send");
    var connect_form = new Form("form.form-connect");
    desk = new Desk('#board');

});

