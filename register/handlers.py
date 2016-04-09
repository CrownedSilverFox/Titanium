from base.handlers import BaseHandler
import json
from static.data.settings import *


class RegisterHandler(BaseHandler):
    def post(self, *args, **kwargs):
        # print(kwargs)
        self.set_default_headers()
        with open('local/current_game_set.json') as f:
            game = json.load(f)
        if game['teams_num'] == 4:
            self.write('GAME_FULL')
            return
        self.write(teams[game['teams_num']])
        game['teams_num'] += 1
        if game['teams_num'] == 4:
            game['current_game_state'] = states['question'][teams[0]]
        with open('local/current_game_set.json', 'w') as f:
            f.write(json.dumps(game))
