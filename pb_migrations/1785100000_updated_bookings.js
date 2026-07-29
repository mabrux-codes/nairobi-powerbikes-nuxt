/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_986407980")

  collection.fields.addAt(18, new Field({
    "help": "",
    "hidden": false,
    "id": "file_id_document",
    "maxSelect": 1,
    "maxSize": 5242880,
    "mimeTypes": ["image/jpeg", "image/png", "application/pdf"],
    "name": "id_document",
    "presentable": false,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": null,
    "type": "file"
  }))

  collection.fields.addAt(19, new Field({
    "help": "",
    "hidden": false,
    "id": "file_drivers_license",
    "maxSelect": 1,
    "maxSize": 5242880,
    "mimeTypes": ["image/jpeg", "image/png", "application/pdf"],
    "name": "drivers_license",
    "presentable": false,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": null,
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_986407980")

  collection.fields.removeById("file_id_document")
  collection.fields.removeById("file_drivers_license")

  return app.save(collection)
})
