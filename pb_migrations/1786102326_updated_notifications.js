/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2301922722")

  // update field
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "select86541eeefa",
    "maxSelect": 0,
    "name": "type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "booking",
      "service",
      "test_ride",
      "testimonial",
      "contact",
      "offer",
      "system",
      "message",
      "general",
      "media",
      "user",
      "staff",
      "auth",
      "motorcycle",
      "ecommerce"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2301922722")

  // update field
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "select86541eeefa",
    "maxSelect": 0,
    "name": "type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "booking",
      "service",
      "test_ride",
      "testimonial",
      "contact",
      "offer",
      "system",
      "message",
      "general",
      "media",
      "user",
      "staff",
      "auth",
      "motorcycle"
    ]
  }))

  return app.save(collection)
})
