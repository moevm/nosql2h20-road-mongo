from app import create_app

if __name__ == '__main__':
    config = "config.Development"
    application = create_app(config)
    application.run()
