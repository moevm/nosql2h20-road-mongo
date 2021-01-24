from app.db import mongo

plans = []


class PlanDAO(object):

    def insert(self, name):
        global plans
        plans += [name]
        return True

    def exists(self, plan_id):
        return plan_id in plans

    def replace(self, name, new_name):
        global plans
        plans.remove(name)
        plans.append(new_name)
        return True

    def delete(self, name):
        global plans
        plans.remove(name)
        return True

    def get(self, name):
        global plans
        return name

    def get_plan_names(self):
        global plans
        return plans


plan_dao = PlanDAO()
