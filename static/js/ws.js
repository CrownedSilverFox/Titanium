function WS(host, port, uri, connect_form) {
    var self = this;
    var ws = new WebSocket("ws://" + host + ":" + port + uri);
    this.handlers = {};
    ws.onmessage = function (evt) {
        //TODO: перехватывать и обрабатывать полученные не JSON данные
        var data = JSON.parse(evt.data);
        log("message received: " + data);
        if ((data["key"])&&(data["key"] == 'newuser')){
            console.log("new user");
            self.handlers[data["key"]](data);
        }

    };

    ws.onclose = function (evt) {
        log("***Connection Closed***");
        connect_form.$port.css("background", "#ff0000");
        connect_form.$host.css("background", "#ff0000");
        connect_form.show();
    };

    ws.onopen = function (evt) {
        log("***Connection Open***");
        connect_form.hide();
    };
    this.handleEvents = function(cb, event_type){
        console.log("cb =");
        self.handlers[event_type] = cb;
    };

    return ws;
}
