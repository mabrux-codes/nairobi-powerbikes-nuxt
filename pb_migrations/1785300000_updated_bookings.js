/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  let collection
  try {
    collection = app.findCollectionByNameOrId("service_bookings")
  } catch (_) {
    collection = app.findCollectionByNameOrId("bookings")
  }

  collection.viewRule = "@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)"

  var hasIdDoc = false
  var hasLicense = false
  for (var i = 0; i < collection.fields.length; i++) {
    var f = collection.fields[i]
    if (f.name === 'id_document') hasIdDoc = true
    if (f.name === 'drivers_license') hasLicense = true
  }
  if (hasIdDoc && hasLicense) { return app.save(collection) }

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

  return app.save(collection)
}, (app) => {
  let collection
  try {
    collection = app.findCollectionByNameOrId("service_bookings")
  } catch (_) {
    collection = app.findCollectionByNameOrId("bookings")
  }

  collection.fields.removeById("file_id_document")
  collection.fields.removeById("file_drivers_license")
  collection.viewRule = ""

  return app.save(collection)
})
