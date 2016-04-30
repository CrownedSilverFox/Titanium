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
  "quest-group-1": [
    {"cost": "2", "answers": ["ответ1", "ответ2", "ответ3", "ответ4"], "text": "текст вопроса", "id": 1},
    {"cost": "4", "answers": ["ответ1", "ответ2", "ответ3", "ответ4"], "text": "текст вопроса2", "id": 2},
    {"cost": "6", "answers": ["ответ1", "ответ2", "ответ3", "ответ4"], "text": "текст вопроса", "id": 3},
    {"cost": "8", "answers": ["ответ1", "ответ2", "ответ3", "ответ4"], "text": "текст вопроса", "id": 4}
  ],
  "quest-group-2": [
    {"cost": "2", "answers": ["ответ1", "ответ2", "ответ3", "ответ4"], "text": "текст вопроса", "id": 5},
    {"cost": "4", "answers": ["ответ1", "ответ2", "ответ3", "ответ4"], "text": "текст вопроса", "id": 6},
    {"cost": "6", "answers": ["ответ1", "ответ2", "ответ3", "ответ4"], "text": "текст вопроса", "id": 7},
    {"cost": "8", "answers": ["ответ1", "ответ2", "ответ3", "ответ4"], "text": "текст вопроса", "id": 8}
  ],
  "quest-group-3": [
    {"cost": "2", "answers": ["ответ1", "ответ2", "ответ3", "ответ4"], "text": "текст вопроса", "id": 9},
    {"cost": "4", "answers": ["ответ1", "ответ2", "ответ3", "ответ4"], "text": "текст вопроса", "id": 10},
    {"cost": "6", "answers": ["ответ1", "ответ2", "ответ3", "ответ4"], "text": "текст вопроса", "id": 11},
    {"cost": "8", "answers": ["ответ1", "ответ2", "ответ3", "ответ4"], "text": "текст вопроса", "id": 12}
  ],
  "quest-group-4": [
    {"cost": "2", "answers": ["ответ1", "ответ2", "ответ3", "ответ4"], "text": "текст вопроса", "id": 13},
    {"cost": "4", "answers": ["ответ1", "ответ2", "ответ3", "ответ4"], "text": "текст вопроса", "id": 14},
    {"cost": "6", "answers": ["ответ1", "ответ2", "ответ3", "ответ4"], "text": "текст вопроса", "id": 15},
    {"cost": "8", "answers": ["ответ1", "ответ2", "ответ3", "ответ4"], "text": "текст вопроса", "id": 16}
  ]
}
right_answers = [
  {"id": 1, "right_answer_num": 1},
  {"id": 2, "right_answer_num": 2},
  {"id": 3, "right_answer_num": 3},
  {"id": 4, "right_answer_num": 4},
  {"id": 5, "right_answer_num": 1},
  {"id": 6, "right_answer_num": 2},
  {"id": 7, "right_answer_num": 3},
  {"id": 8, "right_answer_num": 4},
  {"id": 9, "right_answer_num": 1},
  {"id": 10, "right_answer_num": 2},
  {"id": 11, "right_answer_num": 3},
  {"id": 12, "right_answer_num": 4},
  {"id": 13, "right_answer_num": 1},
  {"id": 14, "right_answer_num": 2},
  {"id": 15, "right_answer_num": 3},
  {"id": 16, "right_answer_num": 4}
]


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
            self.teams[self.turn].write_message("")
        for team in self.teams:
            team.write_message({"team": handler.color})
            team.write_message({'key': 'questions', 'questions': questions})

    def send_json(self):
        json = {}
        if self.state == REGISTER:
            json[""]
        elif self.state == SELECT_QUESTION:
            self.teams[self.turn].write_message({'key': 'quest_sel'})


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
        print(type(message))
        print("WSHandler Received message: {}".format(message))

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
