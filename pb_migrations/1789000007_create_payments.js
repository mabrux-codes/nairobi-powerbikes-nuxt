/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
  "createRule": "@request.auth.role = 'admin'",
  "deleteRule": "@request.auth.role = 'admin'",
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
      "collectionId": "pbc_612fd4eef2aa",
      "hidden": false,
      "id": "087278bb6fae0b5",
      "maxSelect": 1,
      "minSelect": 0,
      "name": "sale",
      "presentable": false,
      "required": true,
      "system": false,
      "type": "relation"
    },
    {
      "cascadeDelete": false,
      "collectionId": "_pb_users_auth_",
      "hidden": false,
      "id": "cee6e11bfe1bbc8",
      "maxSelect": 1,
      "minSelect": 0,
      "name": "customer",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "relation"
    },
    {
      "help": "",
      "hidden": false,
      "id": "4d9dc346280657d",
      "max": null,
      "min": 1,
      "name": "amount",
      "onlyInt": false,
      "presentable": false,
      "required": true,
      "system": false,
      "type": "number"
    },
    {
      "hidden": false,
      "id": "8abeafc4c87b621",
      "maxSelect": 1,
      "name": "payment_method",
      "presentable": false,
      "required": true,
      "system": false,
      "type": "select",
      "values": [
        "M-Pesa",
        "Bank Transfer",
        "Bank Deposit",
        "Cash",
        "Card",
        "Cheque",
        "Other"
      ]
    },
    {
      "autogeneratePattern": "",
      "help": "",
      "hidden": false,
      "id": "eb88b0efc9534d9",
      "max": 200,
      "min": 0,
      "name": "reference",
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
      "id": "51da30b48524be5",
      "max": "",
      "min": "",
      "name": "payment_date",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "date"
    },
    {
      "cascadeDelete": false,
      "collectionId": "_pb_users_auth_",
      "hidden": false,
      "id": "9eaae32b0e84be3",
      "maxSelect": 1,
      "minSelect": 0,
      "name": "recorded_by",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "relation"
    },
    {
      "autogeneratePattern": "",
      "help": "",
      "hidden": false,
      "id": "7e1ea43e2d7ab38",
      "max": 500,
      "min": 0,
      "name": "notes",
      "pattern": "",
      "presentable": false,
      "primaryKey": false,
      "required": false,
      "system": false,
      "type": "text"
    },
    {
      "hidden": false,
      "id": "ee72c04a3f85b6f",
      "maxSelect": 1,
      "name": "type",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "select",
      "values": [
        "full",
        "deposit",
        "installment",
        "balance"
      ]
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
  "id": "pbc_9e37bc4caa80",
  "indexes": [
    "CREATE INDEX `idx_payments_sale` ON `payments` (`sale`)"
  ],
  "listRule": "@request.auth.role = 'admin' || (@request.auth.id = customer && customer != null)",
  "name": "payments",
  "system": false,
  "type": "base",
  "updateRule": "@request.auth.role = 'admin'",
  "viewRule": "@request.auth.role = 'admin' || (@request.auth.id = customer && customer != null)"
})
  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId('payments')
  return app.deleteCollection(collection)
})
