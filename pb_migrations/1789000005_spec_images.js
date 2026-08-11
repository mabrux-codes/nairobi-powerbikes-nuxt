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
      "collectionId": "pbc_1020517649",
      "hidden": false,
      "id": "e7de81caecbd084",
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
      "id": "421ed5d7cf38b38",
      "maxSelect": 1,
      "maxSize": 5242880,
      "mimeTypes": [
        "image/jpeg",
        "image/png",
        "image/webp"
      ],
      "name": "image",
      "presentable": false,
      "protected": false,
      "required": true,
      "system": false,
      "type": "file"
    },
    {
      "hidden": false,
      "id": "25b9e3ee006a119",
      "maxSelect": 1,
      "name": "category",
      "presentable": false,
      "required": true,
      "system": false,
      "type": "select",
      "values": [
        "Engine",
        "Fuel Tank",
        "Brakes",
        "Lights",
        "Suspension",
        "Wheels & Tyres",
        "Dashboard / Instrument Cluster",
        "Exhaust",
        "Transmission / Drivetrain",
        "Controls / Handlebars",
        "Seat",
        "Frame / Chassis",
        "Storage / Luggage",
        "Electrical",
        "Other"
      ]
    },
    {
      "help": "",
      "hidden": false,
      "id": "ee47a6df7c84857",
      "max": null,
      "min": 0,
      "name": "sort_order",
      "onlyInt": true,
      "presentable": false,
      "required": false,
      "system": false,
      "type": "number"
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
  "id": "pbc_e82c86bb0b95",
  "indexes": [
    "CREATE INDEX `idx_specimg_motorcycle` ON `motorcycle_spec_images` (`motorcycle`, `sort_order`)"
  ],
  "listRule": "@request.auth.role = 'admin' || motorcycle.status != 'draft'",
  "name": "motorcycle_spec_images",
  "system": false,
  "type": "base",
  "updateRule": "@request.auth.role = 'admin'",
  "viewRule": "@request.auth.role = 'admin' || motorcycle.status != 'draft'"
})
  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("motorcycle_spec_images")
  return app.delete(collection)
}) 
