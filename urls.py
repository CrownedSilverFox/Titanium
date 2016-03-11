from tornado.web import url

# from users.handlers import RegisterHandler
from test.handlers import TestHandler
from answer.handlers import AnswerHandler


url_patterns = [
    # test
    url(r"/test", TestHandler),
    # url(r"/users/", RegisterHandler),
    url(r"/answer", AnswerHandler)
]
