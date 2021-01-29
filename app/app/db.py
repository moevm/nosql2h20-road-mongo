from flask_pymongo import PyMongo

mongo = PyMongo()


def db_import_from_json(jsn):
	temp = db_export_into_json()

	for collection_name in mongo.db.list_collection_names():
		mongo.db[collection_name].drop()

	for collection in jsn['collections']:
		mongo.db[collection.keys()[0]] = collection.values()[0]

def db_export_into_json():
	jsn = { 'collections': [] }

	for collection_name in mongo.db.list_collection_names():
		jsn['collections'].append({
			collection_name: list(mongo.db[collection_name].find())
		})

	return jsn

