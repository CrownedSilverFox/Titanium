from base.handlers import BaseHandler
import json
from static.data.settings import *


def get_q_by_id(id):
    with open('static/data/questions.json') as f:
                quest_data = json.load(f)
                for key in quest_data.keys():
                    for quest in quest_data[key]:
                        if quest['id'] == int(id):
                            q = quest
    return q

class StatusHandler(BaseHandler):
    def post(self, *args, **kwargs):
        cur_question = {}
        with open('local/current_game_set.json') as f:
            game = json.load(f)
        if game['current_game_state'] == answer_choice:
            cur_question = get_q_by_id(game['current_question_id'])
        answer = {'status': game['current_game_state'],
                  'players_waiting': str(4 - game['teams_num']),
                  'quest': cur_question
                  }
        self.write(json.dumps(answer))
