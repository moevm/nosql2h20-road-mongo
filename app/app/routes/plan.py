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


@plan_bp.route('/delete-plan/<plan_name>', methods=['DELETE'])
def delete_plan(plan_name):
    time.sleep(1)
    result = plan_service.delete_plan(plan_name)

    if result is PlanServiceResponse.success:
        return jsonify({'status': 'success', 'action': 'delete plan'}), 200

    text = result.name.replace('_', ' ')

    return jsonify({'status': 'error', 'action': 'delete plan', 'text': text}), 200


@plan_bp.route('/open-plan/<plan_name>', methods=['GET'])
def open_plan(plan_name):
    time.sleep(1)
    result = plan_service.open_plan(plan_name)

    if result is PlanServiceResponse.success:
        plan = plan_service.get_resource()
        return jsonify({'status': 'success', 'action': 'delete plan', 'plan': plan}), 200

    text = result.name.replace('_', ' ')

    return jsonify({'status': 'error', 'action': 'open plan', 'text': text}), 200


@plan_bp.route('/get-plan-names/', methods=['GET'])
def get_plan_names():
    time.sleep(1)
    result = plan_service.get_plan_names()

    if result is PlanServiceResponse.success:
        plan_names = plan_service.get_resource()
        return jsonify({'status': 'success', 'action': 'delete plan', 'names': plan_names}), 200

    text = result.name.replace('_', ' ')

    return jsonify({'status': 'error', 'action': 'get plan names', 'text': text}), 200
