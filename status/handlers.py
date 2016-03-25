from base.handlers import BaseHandler
import json


class StatusHandler(BaseHandler):
    def post(self, *args, **kwargs):
        with open('local/current_game_set.json') as f:
            game = json.load(f)
        answer = {'status': str(game['current_game_state']), 'players_waiting': str(4-game['teams_num'])}
        self.write(json.dumps(answer))
