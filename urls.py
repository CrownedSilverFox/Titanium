from tornado.web import url

from users.handlers import RegisterHandler
from test.handlers import TestHandler


url_patterns = [
    # test
    url(r"/test", TestHandler),
    url(r"/users/", RegisterHandler),
]
