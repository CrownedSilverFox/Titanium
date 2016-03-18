from base.handlers import BaseHandler
import json
from static.data.settings import teams, red_answer_choice


class RegisterHandler(BaseHandler):
    def post(self, *args, **kwargs):
        self.set_default_headers()
        with open('local/current_game_set.json') as f:
            game = json.load(f)
        if game['teams_num'] == 4:
            self.write('GAME_FULL')
            return
        self.write(teams[game['teams_num']])
        game['teams_num'] += 1
        if game['teams_num'] == 4:
            game['current_game_state'] = red_answer_choice
        with open('local/current_game_set.json', 'w') as f:
            f.write(json.dumps(game))
