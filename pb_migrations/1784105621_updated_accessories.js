/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3522889012")

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "autodate_c_accessories",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "autodate_u_accessories",
    "name": "updated",
    "onCreate": true,
    "onUpdate": true,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3522889012")

  // remove field
  collection.fields.removeById("autodate_c_accessories")

  // remove field
  collection.fields.removeById("autodate_u_accessories")

  return app.save(collection)
})
