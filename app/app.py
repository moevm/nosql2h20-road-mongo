from flask import Flask, render_template, request
import time

app = Flask(__name__)

plans = []


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/create-plan', methods=['POST'])
def create_plan():
    global plans
    time.sleep(3)
    plan_name = request.data.decode('utf-8')
    if plan_name not in plans:
        plans += [plan_name]
        print(plans)
        return '', 200
    else:
        print(plans)
        return '', 400


if __name__ == '__main__':
    app.run()
