function WS(host, port, uri, connect_form) {
    var ws = new WebSocket("ws://" + host + ":" + port + uri);
    ws.onmessage = function (evt) {
        log("message received: " + evt.data)
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
    return ws;
}
