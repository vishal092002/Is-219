import os

import pandas as pd
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_smorest import Api

from app import authentication
from database.app import db
from database.app import User
from flask_cors import CORS
from app.config import Config

def create_app():
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__)
    if Config.ENV == "production":
        app.config.from_object("app.config.ProductionConfig")
    elif Config.ENV== "development":
        app.config.from_object("app.config.DevelopmentConfig")
    elif Config.ENV == "testing":
        app.config.from_object("app.config.TestingConfig")
    # initializes the database connection for the app
    db.init_app(app)
    with app.app_context():
        jwt = JWTManager(app)

        api = Api(app)
        api.spec.components.security_scheme("bearerAuth", {"type": "http", "scheme": "bearer", "bearerFormat": "JWT"})
        api.register_blueprint(authentication)
        load_app_data()
        api_v1_cors_config = {
            "methods": ["OPTIONS", "GET", "POST", "PUT", "DELETE", "PATCH"],
        }
        CORS(app, resources={"/*": api_v1_cors_config})
        @jwt.user_identity_loader
        def user_identity_lookup(user):
            return user

        @jwt.user_lookup_loader
        def user_lookup_callback(_jwt_header, jwt_data):
            identity = jwt_data["sub"]
            return User.query.filter_by(username=identity).one_or_none()

    return app

def load_app_data():
    db.create_all()
    path = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(path, '..', 'data', 'worldcities.csv')
    # makes data frame to hold the world cities data
    df = pd.read_csv(data_path)
    
    db.session.commit()
