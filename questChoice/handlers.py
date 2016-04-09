from base.handlers import BaseHandler
import json
from static.data.settings import states


class QuestChoiceHandler(BaseHandler):
    def post(self, *args, **kwargs):
        quest_id = self.json
        with open('local/current_game_set.json') as f:
            game = json.load(f)
        game['current_game_state'] = states['answer_choice']
        game['current_question_id'] = quest_id
        with open('local/current_game_set.json', 'w') as f:
            f.write(json.dumps(game))
