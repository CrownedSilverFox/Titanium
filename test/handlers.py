from base.handlers import BaseHandler


class TestHandler(BaseHandler):
    def get(self):
        print(self.get_arguments("name"))
        self.write("I hear you")

    def post(self, *args, **kwargs):
        print(self.json)
        self.write("POSt complete")

