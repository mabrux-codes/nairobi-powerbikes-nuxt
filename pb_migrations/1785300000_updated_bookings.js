/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("service_bookings")

  let hasIdDoc = false
  let hasLicense = false
  for (let i = 0; i < collection.fields.length; i++) {
    const f = collection.fields[i]
    if (f.name === 'id_document') hasIdDoc = true
    if (f.name === 'drivers_license') hasLicense = true
  }

  if (!hasIdDoc) {
    collection.fields.addAt(collection.fields.length, new Field({
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
    collection.fields.addAt(collection.fields.length, new Field({
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
