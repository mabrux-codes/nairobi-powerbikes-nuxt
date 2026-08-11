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
      "cascadeDelete": false,
      "collectionId": "pbc_1020517649",
      "hidden": false,
      "id": "6832b53cab6ffbd",
      "maxSelect": 1,
      "minSelect": 0,
      "name": "motorcycle",
      "presentable": false,
      "required": true,
      "system": false,
      "type": "relation"
    },
    {
      "hidden": false,
      "id": "b8911e1fae361de",
      "maxSelect": 1,
      "name": "type",
      "presentable": false,
      "required": true,
      "system": false,
      "type": "select",
      "values": [
        "received",
        "sold",
        "adjustment",
        "damaged",
        "demo",
        "transfer",
        "correction",
        "other"
      ]
    },
    {
      "help": "",
      "hidden": false,
      "id": "cbd9b3be05fb4f6",
      "max": null,
      "min": null,
      "name": "quantity_before",
      "onlyInt": false,
      "presentable": false,
      "required": true,
      "system": false,
      "type": "number"
    },
    {
      "help": "",
      "hidden": false,
      "id": "76b5c88456c3402",
      "max": null,
      "min": null,
      "name": "quantity_change",
      "onlyInt": false,
      "presentable": false,
      "required": true,
      "system": false,
      "type": "number"
    },
    {
      "help": "",
      "hidden": false,
      "id": "bf7e7f5bee20125",
      "max": null,
      "min": null,
      "name": "quantity_after",
      "onlyInt": false,
      "presentable": false,
      "required": true,
      "system": false,
      "type": "number"
    },
    {
      "autogeneratePattern": "",
      "help": "",
      "hidden": false,
      "id": "7dd6a0bf7c6afc5",
      "max": 1000,
      "min": 0,
      "name": "reason",
      "pattern": "",
      "presentable": false,
      "primaryKey": false,
      "required": false,
      "system": false,
      "type": "text"
    },
    {
      "cascadeDelete": false,
      "collectionId": "pbc_612fd4eef2aa",
      "hidden": false,
      "id": "ad3cea87d0e3399",
      "maxSelect": 1,
      "minSelect": 0,
      "name": "related_sale",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "relation"
    },
    {
      "cascadeDelete": false,
      "collectionId": "_pb_users_auth_",
      "hidden": false,
      "id": "e1be8674c306f89",
      "maxSelect": 1,
      "minSelect": 0,
      "name": "performed_by",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "relation"
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
  "id": "pbc_278f4a99bb0d",
  "indexes": [
    "CREATE INDEX `idx_invtx_motorcycle` ON `inventory_transactions` (`motorcycle`)",
    "CREATE INDEX `idx_invtx_related_sale` ON `inventory_transactions` (`related_sale`)"
  ],
  "listRule": "@request.auth.role = 'admin'",
  "name": "inventory_transactions",
  "system": false,
  "type": "base",
  "updateRule": "@request.auth.role = 'admin'",
  "viewRule": "@request.auth.role = 'admin'"
})
  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId('inventory_transactions')
  return app.deleteCollection(collection)
})
