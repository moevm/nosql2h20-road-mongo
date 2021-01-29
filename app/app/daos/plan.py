from app.db import mongo


class PlanDAO(object):

    def insert(self, name, plan=None):
        if plan is None:
            plan = {'plan': {'relations': {}}}

        mongo.db.plans.insert_one({ 'name': name, 'relations': plan['plan']['relations'] })

        return True

    def exists(self, name):
        return name in self.get_plan_names()

    def replace(self, name, new_name):
        return True

    def delete(self, name):
        mongo.db.plans.remove({ 'name': name })

        return True

    def get(self, name):
        return { 'plan': mongo.db.plans.find_one({ 'name': name }, { '_id': 0, 'relations': 1 })}

    def get_plan_names(self):
        return list(map(lambda item: item['name'], list(mongo.db.plans.find({}, { '_id': 0, 'name': 1}))))

    def update(self, name, plan):
        mongo.db.plans.update_one({ 'name': name }, { '$set': { 'relations': plan['plan']['relations'] } })


plan_dao = PlanDAO()