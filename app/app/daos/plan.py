from app.db import mongo

plans = {}


class PlanDAO(object):

    def insert(self, name, plan={}):
        global plans
        plans[name] = plan

        return True

    def exists(self, name):
        return name in plans.keys()

    def replace(self, name, new_name):
        global plans
        plans[new_name] = plans.pop(name)
        return True

    def delete(self, name):
        global plans
        plans.pop(name)
        return True

    def get(self, name):
        global plans
        return plans[name]

    def get_plan_names(self):
        global plans
        return list(plans.keys())

    def update(self, name, plan):
        global plans
        plans[name] = plan


plan_dao = PlanDAO()