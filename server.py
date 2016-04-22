import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web
import socket

TEAM_COLORS = ["RED", "GREEN", "BLUE", "YELLOW"]
REGISTER = 0
SELECT_QUESTION = 1
SELECT_ANSWER = 2

questions = {
    "q1": ["v1", "v2", "v3"],
    "q2": ["v1", "v2", "v3"],
    "q3": ["v1", "v2", "v3"],
}


class Game:
    def __init__(self):
        self.state = REGISTER  # статус хода
        self.turn = 0  # индекс команды, чей сейчас ход
        self.teams = []  # список команд

    def next_turn(self):
        self.turn += 1
        if self.turn == len(TEAM_COLORS):
            self.turn = 0
            self.state += 1

    def connect(self, handler):
        """

        :param handler:
        :return:
        """
        if len(self.teams) == len(TEAM_COLORS):
            self.state += 1
        for team in self.teams:
            team.write_message(str(handler))

    def send_json(self):
        json = {}
        if self.state == REGISTER:
            json[""]


class Team:
    team_colors = TEAM_COLORS[:]

    def __init__(self):
        if not self.team_colors:
            raise ValueError("Game Full")
        self.color = self.team_colors.pop(0)

    def on_delete(self):
        self.team_colors.insert(0, self.color)

    def __repr__(self):
        return "Team {}".format(self.color)


class Application(tornado.web.Application):
    def __init__(self):
        self.game = Game()
        # settings = {
        # 'static_url_prefix': '/static/',
        # }
        # connection = pymongo.Connection('127.0.0.1', 27017)
        # self.db = connection.chat
        handlers = [
            # (r'/', WSHandler),
            (r'/websocket', WSHandler),
        ]

        tornado.web.Application.__init__(self, handlers)


    # def connect_team(self, team):
    #     self.teams.append(team)


class WSHandler(tornado.websocket.WebSocketHandler, Team):
    def open(self):
        if self.application.game.state != REGISTER:
            # TODO: тут надо восстанавливать подключение игрока
            pass
        self.application.game.teams.append(self)
        self.application.game.connect(self)
        print("client connect", self.color)
        # self.write_message("Hello")

    def on_message(self, message):
        print("WSHandler Received message: {}".format(message))
        # for key, value in enumerate(self.application.webSocketsPool):
        #     if value != self:
        #         value.ws_connection.write_message(message)
        #     else:
        #         self.ws_connection.write_message("ping")

    def on_close(self):
        print("close connection", self)
        self.application.game.teams.remove(self)
        self.on_delete()

    def check_origin(self, origin):
        return True


application = Application()

if __name__ == "__main__":
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(8888)
    myIP = socket.gethostbyname(socket.gethostname())
    print('*** Websocket Server Started at %s***' % myIP)
    tornado.ioloop.IOLoop.instance().start()
