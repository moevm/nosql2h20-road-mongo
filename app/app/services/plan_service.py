from app.daos import plan_dao


class PlanService(object):

    def estimate_plan(self, plan_id):
        plan = plan_dao.get(plan_id)
        # some 'super' logic

    def create_plan(self, name):
        if name:
            if not plan_dao.exists(name):
                plan_dao.insert(name)
                return {'status': 'success'}
            return {'status': 'error', 'text': 'plan name exists'}
        return {'status': 'error', 'text': 'empty plan name'}

    # //Тут вроде нормально
    def rename_plan(self, name, name_new):
        if name and name_new:
            if not plan_dao.exists(name_new) and plan_dao.exists(name):
                plan_dao.replace(name_new)
                return {'status': 'success'}
            return {'status': 'error', 'text': 'plan name exists'}
        return {'status': 'error', 'text': 'empty plan name'}


plan_service = PlanService()
