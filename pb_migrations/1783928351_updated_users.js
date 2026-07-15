/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.role = 'admin'",
    "listRule": "@request.auth.id = @request.auth.id",
    "updateRule": "@request.auth.id = @request.auth.id || @request.auth.role = 'admin'",
    "viewRule": "@request.auth.id = @request.auth.id"
  }, collection)

  // add field
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1146066909",
    "max": 50,
    "min": 0,
    "name": "phone",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
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

  // add field
  collection.fields.addAt(12, new Field({
    "help": "",
    "hidden": false,
    "id": "select1068999359",
    "maxSelect": 1,
    "name": "availability",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "online",
      "busy",
      "offline"
    ]
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "help": "",
    "hidden": false,
    "id": "bool2453119867",
    "name": "email_notifications",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "help": "",
    "hidden": false,
    "id": "bool3338703483",
    "name": "sms_notifications",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "deleteRule": "id = @request.auth.id",
    "listRule": "id = @request.auth.id",
    "updateRule": "id = @request.auth.id",
    "viewRule": "id = @request.auth.id"
  }, collection)

  // remove field
  collection.fields.removeById("text1146066909")

  // remove field
  collection.fields.removeById("select1466534506")

  // remove field
  collection.fields.removeById("select1068999359")

  // remove field
  collection.fields.removeById("bool2453119867")

  // remove field
  collection.fields.removeById("bool3338703483")

  return app.save(collection)
})
