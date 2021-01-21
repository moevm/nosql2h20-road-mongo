from app.db import mongo

plans = []


class PlanDAO(object):

    def insert(self, plan_id):
        global plans
        plans += [plan_id]
        return True

    def exists(self, plan_id):
        return plan_id in plans

    def replace(self, plan_id, plan_id_new):
        global plans
        plans.remove(plan_id)
        plans.append(plan_id_new)


plan_dao = PlanDAO()
