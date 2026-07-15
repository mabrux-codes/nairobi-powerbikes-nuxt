/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2627482601")

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "autodate_c_service_requests",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "autodate_u_service_requests",
    "name": "updated",
    "onCreate": true,
    "onUpdate": true,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2627482601")

  // remove field
  collection.fields.removeById("autodate_c_service_requests")

  // remove field
  collection.fields.removeById("autodate_u_service_requests")

  return app.save(collection)
})
