class Config(object):
    DEBUG = False
    MONGO_URI = "mongodb://mongo:27017/db"
    MONGO_DBNAME = 'db'


class Release(Config):
    DEBUG = False


class Development(Config):
    DEBUG = True

