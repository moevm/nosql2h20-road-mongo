plans = []


class PlanDAO(object):

    def insert(self, plan_id):
        global plans
        plans += [plan_id]
        return True

    def exists(self, plan_id):
        return plan_id in plans

    def replace(self, plan_id, plan_id_new):
        plans.remove(plan_id)
        plans.append(plan_id_new)
         # plan_id in plans = plan_id_new
        # //Нужно присвоить новое имя, но я не знаю как


plan_dao = PlanDAO()
