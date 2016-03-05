import tornado.web
from tornado import gen
# import json
import bson.json_util


class BaseHandler(tornado.web.RequestHandler):
    def initialize(self, **kwargs):
        super(BaseHandler, self).initialize(**kwargs)
        self.db = self.settings['db']
        self.current_user = None

    def render_json(self, data):
        self.set_header("Content-Type", "application/json")
        self.write(bson.json_util.dumps(data))

    @property
    def json(self):
        try:
            return bson.json_util.loads(self.request.body.decode('utf-8'))
        except ValueError:
            return {"errors": "data mast be in JSON Format"}

    @gen.coroutine
    def get_current_user(self):
        from users.models import UserModel
        email = self.current_user
        if email:
            # TODO cache
            user = yield UserModel.find_one(self.db, {"email": email})
        else:
            user = None
        self.current_user = user
        raise gen.Return(user)

    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "http://localhost:63342")
        self.set_header("Access-Control-Allow-Credentials", "true")
        self.set_header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
        self.set_header("Access-Control-Allow-Headers",
                        "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, X-Requested-By,"
                        " If-Modified-Since, X-File-Name, Cache-Control")
