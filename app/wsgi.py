import os
from app import create_app

if __name__ == '__main__':
    config = "config.Development"
    application = create_app(config)
    port = int(os.environ.get('PORT', 5000))
    application.run(host="0.0.0.0", port=port)
