#!/usr/bin/env python
# -*- coding: utf-8 -*-

import tornado.httpserver
import tornado.ioloop
import tornado.web
from tornado.options import options
from settings import settings, MONGO_DB
from urls import url_patterns
from utils.db import connect_mongo
import json


class ACLApp(tornado.web.Application):
    def __init__(self, *args, **kwargs):
        db = connect_mongo(MONGO_DB, **kwargs)
        print('db = ', db)
        super(ACLApp, self).__init__(url_patterns, db=db, *args, **dict(settings, **kwargs))


def main():
    app = ACLApp()
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()


with open('local/current_game_set.json', 'w') as current:
        with open('static/data/default_game_set.json') as default:
            current.write(json.dumps(json.load(default)))


if __name__ == "__main__":
    main()
