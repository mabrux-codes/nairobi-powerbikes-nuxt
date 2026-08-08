/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2627482601")

  // update field
  collection.fields.addAt(6, new Field({
    "help": "",
    "hidden": false,
    "id": "selectb6430529c1",
    "maxSelect": 0,
    "name": "status",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "pending",
      "awaiting_verification",
      "confirmed",
      "rescheduled",
      "ready",
      "checked_in",
      "in_progress",
      "quality_check",
      "completed",
      "cancelled",
      "rejected",
      "no_show",
      "diagnosed",
      "awaiting_approval",
      "approved"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2627482601")

  // update field
  collection.fields.addAt(6, new Field({
    "help": "",
    "hidden": false,
    "id": "selectb6430529c1",
    "maxSelect": 0,
    "name": "status",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "pending",
      "diagnosed",
      "in_progress",
      "completed",
      "cancelled"
    ]
  }))

  return app.save(collection)
})
