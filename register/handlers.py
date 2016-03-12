from base.handlers import BaseHandler
import json
from static.data.settings import teams


class RegisterHandler(BaseHandler):
    def post(self, *args, **kwargs):
        with open('local/current_game_set.json') as f:
            game = json.load(f)
        if game['teams_num'] == 4:
            self.write('GAME_FULL')
        self.write(teams[game['teams_num']])
        game['teams_num'] += 1
        with open('local/current_game_set.json', 'w') as f:
            f.write(json.dumps(game))
