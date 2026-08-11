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
      "id": "708152cea4b9270",
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
      "id": "0912093392f9f7c",
      "maxSelect": 1,
      "minSelect": 0,
      "name": "customer",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "relation"
    },
    {
      "autogeneratePattern": "",
      "help": "",
      "hidden": false,
      "id": "dbe2aa28bb2dba9",
      "max": 200,
      "min": 0,
      "name": "provider",
      "pattern": "",
      "presentable": false,
      "primaryKey": false,
      "required": false,
      "system": false,
      "type": "text"
    },
    {
      "autogeneratePattern": "",
      "help": "",
      "hidden": false,
      "id": "54ffae348012268",
      "max": 200,
      "min": 0,
      "name": "finance_reference",
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
      "id": "a54532dc468f9b6",
      "max": null,
      "min": 0,
      "name": "deposit",
      "onlyInt": false,
      "presentable": false,
      "required": false,
      "system": false,
      "type": "number"
    },
    {
      "help": "",
      "hidden": false,
      "id": "ab099e3a6dba311",
      "max": null,
      "min": 0,
      "name": "amount_financed",
      "onlyInt": false,
      "presentable": false,
      "required": false,
      "system": false,
      "type": "number"
    },
    {
      "help": "",
      "hidden": false,
      "id": "35909f16d82c63f",
      "max": null,
      "min": 0,
      "name": "interest_charges",
      "onlyInt": false,
      "presentable": false,
      "required": false,
      "system": false,
      "type": "number"
    },
    {
      "help": "",
      "hidden": false,
      "id": "b757fd0024e81ce",
      "max": null,
      "min": 0,
      "name": "total_payable",
      "onlyInt": false,
      "presentable": false,
      "required": false,
      "system": false,
      "type": "number"
    },
    {
      "help": "",
      "hidden": false,
      "id": "1a189dbde74fbf0",
      "max": null,
      "min": 0,
      "name": "installment_amount",
      "onlyInt": false,
      "presentable": false,
      "required": false,
      "system": false,
      "type": "number"
    },
    {
      "hidden": false,
      "id": "3ce396d893aacf8",
      "maxSelect": 1,
      "name": "frequency",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "select",
      "values": [
        "monthly",
        "weekly",
        "biweekly",
        "quarterly"
      ]
    },
    {
      "help": "",
      "hidden": false,
      "id": "6ae8fad367b1986",
      "max": null,
      "min": 0,
      "name": "installments",
      "onlyInt": true,
      "presentable": false,
      "required": false,
      "system": false,
      "type": "number"
    },
    {
      "help": "",
      "hidden": false,
      "id": "014ea90dbb1005b",
      "max": "",
      "min": "",
      "name": "start_date",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "date"
    },
    {
      "help": "",
      "hidden": false,
      "id": "8559b594dae52f3",
      "max": "",
      "min": "",
      "name": "expected_completion",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "date"
    },
    {
      "autogeneratePattern": "",
      "help": "",
      "hidden": false,
      "id": "cd417238420a427",
      "max": 2000,
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
      "id": "a6b54b0df20126c",
      "maxSelect": 1,
      "name": "status",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "select",
      "values": [
        "active",
        "completed",
        "defaulted",
        "cancelled"
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
  "id": "pbc_9ecf1f5e7640",
  "indexes": [
    "CREATE UNIQUE INDEX `idx_financing_sale` ON `financing` (`sale`)"
  ],
  "listRule": "@request.auth.role = 'admin' || (@request.auth.id = customer && customer != null)",
  "name": "financing",
  "system": false,
  "type": "base",
  "updateRule": "@request.auth.role = 'admin'",
  "viewRule": "@request.auth.role = 'admin' || (@request.auth.id = customer && customer != null)"
})
  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId('financing')
  return app.deleteCollection(collection)
})
