/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3745265112")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "autodate_c_subscribers",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "autodate_u_subscribers",
    "name": "updated",
    "onCreate": true,
    "onUpdate": true,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3745265112")

  // remove field
  collection.fields.removeById("autodate_c_subscribers")

  // remove field
  collection.fields.removeById("autodate_u_subscribers")

  return app.save(collection)
})
