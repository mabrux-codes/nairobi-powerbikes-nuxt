/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)",
    "deleteRule": "@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "help": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": true,
        "collectionId": "_pb_users_auth_",
        "help": "",
        "hidden": false,
        "id": "relation87cd71c67b",
        "maxSelect": 0,
        "minSelect": 0,
        "name": "user",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_1020517649",
        "help": "",
        "hidden": false,
        "id": "relation30c4827000",
        "maxSelect": 0,
        "minSelect": 0,
        "name": "motorcycle",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      }
    ],
    "id": "pbc_2151843437",
    "indexes": [],
    "listRule": "@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)",
    "name": "favorites",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)",
    "viewRule": ""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2151843437");

  return app.delete(collection);
})
