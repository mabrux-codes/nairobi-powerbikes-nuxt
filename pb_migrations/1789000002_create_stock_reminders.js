/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user) || (email != '' && email ~ '%@%')",
    "deleteRule": "@request.auth.role = 'admin' || @request.auth.id = user",
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
        "collectionId": "pbc_1020517649",
        "help": "The motorcycle the customer is waiting for.",
        "hidden": false,
        "id": "relation2649583324",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "motorcycle",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": true,
        "collectionId": "_pb_users_auth_",
        "help": "Set for logged-in customers. Guests are tracked by email only.",
        "hidden": false,
        "id": "relation3894407741",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "user",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "",
        "help": "Guest email, lowercased.",
        "hidden": false,
        "id": "text3651473421",
        "max": 200,
        "min": 0,
        "name": "email",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "help": "",
        "hidden": false,
        "id": "select4179401638",
        "maxSelect": 1,
        "name": "status",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "active",
          "notified",
          "cancelled"
        ]
      },
      {
        "help": "Set when the arrival notification was delivered.",
        "hidden": false,
        "id": "date4232189491",
        "max": "",
        "min": "",
        "name": "notified_at",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "autodate4372818527",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "autodate8747864736",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_9811322045",
    "indexes": [
      "CREATE UNIQUE INDEX `idx_reminder_user` ON `stock_reminders` (`motorcycle`, `user`)",
      "CREATE UNIQUE INDEX `idx_reminder_email` ON `stock_reminders` (`motorcycle`, `email`)"
    ],
    "listRule": "@request.auth.role = 'admin' || (@request.auth.id = user && user != null)",
    "name": "stock_reminders",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.role = 'admin' || @request.auth.id = user",
    "viewRule": "@request.auth.role = 'admin' || (@request.auth.id = user && user != null)"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_9811322045");
  return app.delete(collection);
})