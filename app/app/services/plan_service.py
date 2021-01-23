from app.daos import plan_dao
from enum import Enum
from functools import wraps

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

    def __check_plan_name(must_exist):
        def deco(method):
            @wraps(method)
            def wrapper(self, *args, **kwargs):
                name = args[0]

                if not self.is_valid_plan_name(name):
                    return PlanServiceResponse.invalid_plan_name

                if must_exist and not plan_dao.exists(name):
                    return PlanServiceResponse.plan_name_not_exists

                if not must_exist and plan_dao.exists(name):
                    return PlanServiceResponse.plan_name_exists

                return method(self, *args, **kwargs)
            return wrapper
        return deco

    @__check_plan_name(False)
    def create_plan(self, name):
        plan_dao.insert(name)
        return PlanServiceResponse.success

    @__check_plan_name(True)
    def rename_plan(self, name, new_name):
        if not self.is_valid_plan_name(new_name):
            return PlanServiceResponse.invalid_rename_plan_name

        if plan_dao.exists(new_name):
            return PlanServiceResponse.rename_plan_name_exists

        plan_dao.replace(name, new_name)
        return PlanServiceResponse.success

    @__check_plan_name(True)
    def delete_plan(self, name):
        plan_dao.delete(name)
        return PlanServiceResponse.success

    @__check_plan_name(True)
    def estimate_plan(self, name):
        # some 'super' logic
        return PlanServiceResponse.success


plan_service = PlanService()
