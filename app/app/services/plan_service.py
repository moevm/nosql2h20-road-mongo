from app.daos import plan_dao
from enum import Enum

PlanServiceResponse = Enum('PlanServiceResponse',
                           'plan_name_exists '
                           'plan_name_not_exists '
                           'invalid_plan_name '
                           'invalid_rename_plan_name '
                           'rename_plan_name_exists '
                           'success'
                           )


class PlanService(object):

    @staticmethod
    def is_valid_plan_name(name):
        return True if name else False

    @staticmethod
    def __check_plan_name(method):
        def wrapper(self, *args, **kwargs):
            name = args[0]
            if self.is_valid_plan_name(name):
                if plan_dao.exists(name):
                    return method(self, *args, **kwargs)
                return PlanServiceResponse.plan_name_not_exists
            return PlanServiceResponse.invalid_plan_name
        return wrapper

    @__check_plan_name
    def create_plan(self, name):
        plan_dao.insert(name)
        return PlanServiceResponse.success

    @__check_plan_name
    def rename_plan(self, name, new_name):
        if self.is_valid_plan_name(new_name):
            if not plan_dao.exists(new_name):
                plan_dao.replace(name, new_name)
                return PlanServiceResponse.success
            return PlanServiceResponse.rename_plan_name_exists
        return PlanServiceResponse.invalid_rename_plan_name

    @__check_plan_name
    def delete_plan(self, name):
        pass
        return PlanServiceResponse.success

    @__check_plan_name
    def estimate_plan(self, name):
        # some 'super' logic
        return PlanServiceResponse.success


plan_service = PlanService()
