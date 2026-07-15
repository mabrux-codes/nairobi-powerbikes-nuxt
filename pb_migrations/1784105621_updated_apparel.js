/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1534039042")

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "autodate_c_apparel",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "autodate_u_apparel",
    "name": "updated",
    "onCreate": true,
    "onUpdate": true,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1534039042")

  // remove field
  collection.fields.removeById("autodate_c_apparel")

  // remove field
  collection.fields.removeById("autodate_u_apparel")

  return app.save(collection)
})
