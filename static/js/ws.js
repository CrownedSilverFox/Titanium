function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function WS() {
    var self = this;
    var websock;
    this.handlers = {};

    this.send = function(obj){
        websock.send(JSON.stringify(obj));
    };

    this.connect = function (host, port, uri, connect_form) {
        websock = new WebSocket("ws://" + host + ":" + port + uri);
        websock.onmessage = function (evt) {
            //TODO: перехватывать и обрабатывать полученные не JSON данные
            var data = JSON.parse(evt.data);
            //log("message received: " + JSON.stringify(data));
            if ((data["key"]) && (isFunction(self.handlers[data["key"]]))) {
                self.handlers[data["key"]](data);
            }

        };

        websock.onclose = function (evt) {
            log("***Connection Closed***");
            connect_form.$port.css("background", "#ff0000");
            connect_form.$host.css("background", "#ff0000");
            connect_form.show();
        };

        websock.onopen = function (evt) {
            log("***Connection Open***");
            connect_form.hide();
        };
    };

    this.handleEvents = function (cb, event_type) {
        self.handlers[event_type] = cb;
    };

    return ws;
}
