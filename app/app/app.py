
from flask import Flask
from .routes import plan_bp, index_bp
from app.db import mongo


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)
    mongo.init_app(app)

    app.register_blueprint(plan_bp)
    app.register_blueprint(index_bp)

    return app
