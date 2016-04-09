from base.handlers import BaseHandler
import json
from static.data.settings import *


def load_info():
    with open('static/data/right_answers.json') as f:
        right_answers = json.load(f)
    with open('local/current_game_set.json') as f:
        game = json.load(f)
    return right_answers, game


class AnswerHandler(BaseHandler):
    def post(self, *args, **kwargs):
        answer = self.json
        right_answers, game = load_info()
        print(answer)
        for quest in right_answers:
            if quest['id'] == game['current_question_id']:
                if str(quest['right_answer_num']) == answer['checkedAnswer']:
                    self.write(json.dumps({"points": game['quest_points']}))
                else:
                    self.write(json.dumps({"points": 0}))
        game['players_waiting'] -= 1
        if not game['players_waiting']:
            game['current_game_state'] = states['points'][teams[0]]
        with open('local/current_game_set.json', 'w') as f:
            f.write(json.dumps(game))
