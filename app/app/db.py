from flask_pymongo import PyMongo

mongo = PyMongo()


def db_import_from_json(jsn):
	pass

def db_export_into_json():
	jsn = { 'collections': [] }

	for collection_name in mongo.db.list_collection_names():
		jsn['collections'].append({
			collection_name: list(mongo.db[collection_name].find())
		})

	return jsn

