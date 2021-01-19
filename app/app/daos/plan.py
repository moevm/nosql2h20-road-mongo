plans = []


class PlanDAO(object):

    def insert(self, plan_id):
        global plans
        plans += [plan_id]
        return True

    def exists(self, plan_id):
        return plan_id in plans


plan_dao = PlanDAO()
