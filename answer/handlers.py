from base.handlers import BaseHandler
import json

class AnswerHandler(BaseHandler):
    def post(self, *args, **kwargs):
        answer = self.json
        with open('static/data/right_answers.json') as f:
            right_answers = json.load(f)
        for quest in right_answers:
            if str(quest['id']) == answer['id']:
                if str(quest['right_answer_num']) == answer['answer']:
                    self.write('Right')
                else:
                    self.write('False')
