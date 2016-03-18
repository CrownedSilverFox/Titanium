from tornado.web import url

# from users.handlers import RegisterHandler
from test.handlers import TestHandler
from answer.handlers import AnswerHandler
from register.handlers import RegisterHandler
from status.handlers import StatusHandler


url_patterns = [
    # test
    url(r"/test", TestHandler),
    url(r"/register", RegisterHandler),
    url(r"/answer", AnswerHandler),
    url(r"/status", StatusHandler)
]
