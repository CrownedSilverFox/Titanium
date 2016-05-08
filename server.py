import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web
import socket
from json import JSONEncoder
import os
import json
import time


TEAM_COLORS = ["RED", "GREEN", "BLUE", "YELLOW"]
# Фазы(state) игры
REGISTER = 0
SELECT_QUESTION = 1
SELECT_ANSWER = 2
SET_MARKERS = 3
# TODO: не забывать изменять максимальный статус, при добавленни новых фаз
MAX_STATE = SET_MARKERS  # Всегда равна максимальному статусу


class Game:
    def __init__(self):
        self._state = REGISTER  # статус хода
        self._turn = 0  # индекс команды, чей сейчас ход
        self.teams = []  # список команд
        self.do = {
            REGISTER: lambda: None,
            SELECT_QUESTION: self.select_question,
            SELECT_ANSWER: self.select_answer
        }
        self.questions = None
        self.load_data()
        self.question = None
        self.time_end = 5

    def load_data(self):
        with open(os.path.join("data", "questions.json")) as f:
            self.questions = json.load(f)

    def _send_all(self, json, exclude=None):
        for team in self.teams:
            if team == exclude:
                continue
            team.write_message(json)

    def received_message(self, team, message):
        # TODO: Данный метод реализован неверно, т.к. не соответствует нашей выбранной концепуии смены state и turn...
        if message["key"] == "quest_sel":
            self._send_all(json.dumps({'key': 'question', 'question': self.chosen_quest(int(message['id']))}))
            self.select_answer()

    @property
    def state(self):
        return self._state

    @state.setter
    def state(self, value):
        if value > MAX_STATE:
            self._state = 1
            self.turn += 1
        else:
            self._state = value

        self.do[self.state]()

    @property
    def turn(self):
        return self._turn

    @turn.setter
    def turn(self, value):
        self._turn = value

    def connect(self, team):
        """
        Подключение команды
        """
        # TODO: добавить восстановление подключения команды
        if self.state != REGISTER:
            raise ValueError("Game in progress, registration is closed")

        self.teams.append(team)
        if len(TEAM_COLORS[:2]) == len(self.teams):
            self.state += 1
            self._send_all({"key": "register", "register_closed": True})
            return

        # Сообщения для индикатора подключения команд
        self._send_all({"key": "register", "connected_teams": [team.color for team in self.teams]})

    def disconnect(self, team):
        """
        Отключение команды
        """
        self.teams.remove(team)
        if self._state == REGISTER:
            self._send_all({"key": "register", "connected_teams": [team.color for team in self.teams]})

    def select_question(self):
        print(".select_question()")
        # Всем командам отсылаем вопросы
        self._send_all({"key": "questions", "questions": self.questions})
        # Текущей команде(чей сейчас ход) отсылаем сообщение "Выберите вопрос"
        self.teams[self._turn].write_message({"key": "quest_sel"})

    def select_answer(self):
        for second in range(0, self.time_end):
            message = {'key': 'time', 'time': second}
            self._send_all(json.dumps(message))
            time.sleep(1)
        message = {'key': 'time_up'}
        self._send_all(json.dumps(message))

    def chosen_quest(self, id):
        for group in self.questions.keys():
                for num, quest in enumerate(self.questions[group]):
                    if quest['id'] == id:
                        self.questions[group].pop(num)
                        return quest


class Team:
    team_colors = TEAM_COLORS[:2]

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
        handlers = [
            (r'/websocket', WSHandler),
        ]

        tornado.web.Application.__init__(self, handlers)


class WSHandler(tornado.websocket.WebSocketHandler, Team):
    def open(self):
        self.application.game.connect(self)
        print("client connect", self.color)

    def on_message(self, message):
        message = json.loads(message)
        print("WSHandler Received message: {}".format(message))
        self.application.game.received_message(self, message)

    def on_close(self):
        print("close connection", self)
        self.application.game.disconnect(self)
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
