from flask import Blueprint, jsonify, request
from app.services import plan_service, PlanServiceResponse
import time
import json

plan_bp = Blueprint('plan_bp', __name__, url_prefix='/api')


@plan_bp.route('/create-plan', methods=['POST'])
def create_plan():
    time.sleep(1)
    plan_name = request.data.decode('utf-8')
    result = plan_service.create_plan(plan_name)

    if result is PlanServiceResponse.success:
        return jsonify({'status': 'success', 'action': 'create plan'}), 200

    text = result.name.replace('_', ' ')

    return jsonify({'status': 'error', 'action': 'create plan', 'text': text}), 200


@plan_bp.route('/rename-plan', methods=['PUT'])
def rename_plan():
    time.sleep(1)
    data = json.loads(request.data.decode('utf-8'))
    old_plan_name = data['oldPlanName']
    new_plan_name = data['newPlanName']
    result = plan_service.rename_plan(old_plan_name, new_plan_name)

    if result is PlanServiceResponse.success:
        return jsonify({'status': 'success', 'action': 'rename plan'}), 200

    text = result.name.replace('_', ' ')

    return jsonify({'status': 'error', 'action': 'rename plan', 'text': text}), 200
