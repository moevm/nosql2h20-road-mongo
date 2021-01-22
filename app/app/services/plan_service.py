from app.daos import plan_dao


class PlanService(object):
    SUCCESS = {'status': 'success'}
    PLAN_EXISTS = {'status': 'error', 'text': 'plan name exists'}
    EMPTY_PLAN = {'status': 'error', 'text': 'empty plan name'}

    @staticmethod
    def is_valid_plan_name(name):
        return True if name else False

    def estimate_plan(self, name):
        # some 'super' logic
        pass

    def create_plan(self, name):
        if self.is_valid_plan_name(name):
            if not plan_dao.exists(name):
                plan_dao.insert(name)
                return self.SUCCESS
            return self.PLAN_EXISTS
        return self.EMPTY_PLAN

    def rename_plan(self, name, new_name):
        if self.is_valid_plan_name(name) and self.is_valid_plan_name(new_name):
            if not plan_dao.exists(new_name) and plan_dao.exists(name):
                plan_dao.replace(name, new_name)
                return self.SUCCESS
            return self.PLAN_EXISTS
        return self.EMPTY_PLAN


plan_service = PlanService()
