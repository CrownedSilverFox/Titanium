function RegisterLED(selector) {
    // Индикатор ожидания регистрации
    var self = this;
    var $obj = $(selector);

    this.on_change = function (data) {
        //console.log("on_change");
        if (data.register_closed){
            $obj.hide();
            return
        }
        $obj.find("li").each(function () {
            $(this).show();
        });
        for (var i = 0; i < data.connected_teams.length; i++) {
            //console.log($obj.find("." + data.connected_teams[i]));
            $obj.find("." + data.connected_teams[i]).hide();
        }


    }
}