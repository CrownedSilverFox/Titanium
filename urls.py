from tornado.web import url

# from users.handlers import RegisterHandler
from answer.handlers import AnswerHandler
from register.handlers import RegisterHandler
from status.handlers import StatusHandler
from questChoice.handlers import QuestChoiceHandler


url_patterns = [
    url(r"/register", RegisterHandler),
    url(r"/answer", AnswerHandler),
    url(r"/status", StatusHandler),
    url(r"/quest", QuestChoiceHandler)
]
