from base.handlers import BaseHandler


class AnswerHandler(BaseHandler):
    def post(self, *args, **kwargs):
        print(self.json)
        self.write("POSt complete")