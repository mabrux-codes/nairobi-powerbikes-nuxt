/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("service_bookings")

  const hasIdDoc = collection.fields.some((f: any) => f.name === 'id_document')
  const hasLicense = collection.fields.some((f: any) => f.name === 'drivers_license')

  if (!hasIdDoc) {
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
      "required": false,
      "system": false,
      "thumbs": null,
      "type": "file"
    }))
  }

  if (!hasLicense) {
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
      "required": false,
      "system": false,
      "thumbs": null,
      "type": "file"
    }))
  }

  collection.viewRule = "@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)"

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("service_bookings")

  collection.fields.removeById("file_id_document")
  collection.fields.removeById("file_drivers_license")

  collection.viewRule = ""

  return app.save(collection)
})
