from base.handlers import BaseHandler
import json


class StatusHandler(BaseHandler):
    def post(self, *args, **kwargs):
        with open('local/current_game_set.json') as f:
            game = json.load(f)
        self.write(str(game['current_game_state']))
