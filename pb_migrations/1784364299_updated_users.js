/// <reference path="../pb_data/types.d.ts" />
migrate(function(app) {
  var collection = app.findCollectionByNameOrId("_pb_users_auth_")

  collection.fields.addAt(11, new Field({
    "help": "",
    "hidden": false,
    "id": "select1466534506",
    "maxSelect": 1,
    "name": "role",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "customer",
      "admin",
      "salesperson"
    ]
  }))

  return app.save(collection)
}, function(app) {
  var collection = app.findCollectionByNameOrId("_pb_users_auth_")

  collection.fields.addAt(11, new Field({
    "help": "",
    "hidden": false,
    "id": "select1466534506",
    "maxSelect": 1,
    "name": "role",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "customer",
      "admin"
    ]
  }))

  return app.save(collection)
})
