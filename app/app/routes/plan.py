from flask import Blueprint, jsonify, request
from app.services import plan_service
import time

plan_bp = Blueprint('plan_bp', __name__, url_prefix='/api')


@plan_bp.route('/create-plan', methods=['POST'])
def create_plan():
    time.sleep(1)
    plan_name = request.data.decode('utf-8')
    result = plan_service.create_plan(plan_name)
    return jsonify(result), 200
