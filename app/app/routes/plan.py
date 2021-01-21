from flask import Blueprint, jsonify, request
from app.services import plan_service
import time
import json

plan_bp = Blueprint('plan_bp', __name__, url_prefix='/api')


@plan_bp.route('/create-plan', methods=['POST'])
def create_plan():
    time.sleep(1)
    plan_name = request.data.decode('utf-8')
    result = plan_service.create_plan(plan_name)
    return jsonify(result), 200


@plan_bp.route('/rename-plan', methods=['PUT'])
def rename_plan():
    time.sleep(1)
    data = json.loads(request.data.decode('utf-8'))
    old_plan_name = data['oldPlanName']
    new_plan_name = data['newPlanName']
    result = plan_service.rename_plan(old_plan_name, new_plan_name)
    return jsonify(result), 200