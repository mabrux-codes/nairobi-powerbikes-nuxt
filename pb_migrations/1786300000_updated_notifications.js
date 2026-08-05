/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("notifications")

  var hasBroadcast = false
  for (var i = 0; i < collection.fields.length; i++) {
    if (collection.fields[i].name === 'broadcast') hasBroadcast = true
  }
  if (!hasBroadcast) {
    collection.fields.add(new Field({
      "name": "broadcast",
      "type": "bool",
      "required": false,
      "system": false
    }))
  }

  const typeField = collection.fields.getByName("type")
  typeField.values = [
    "booking", "service", "test_ride", "testimonial", "contact",
    "offer", "system", "message", "general", "media", "user", "staff", "auth", "motorcycle"
  ]

  const rules = "@request.auth.role = 'admin' || (@request.auth.role = 'customer' && (@request.auth.id = user || broadcast = true))"
  collection.listRule = rules
  collection.viewRule = rules
  collection.updateRule = "@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)"

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("notifications")
  collection.fields.removeById("broadcast")
  const typeField = collection.fields.getByName("type")
  typeField.values = ["booking", "service", "offer", "system", "message"]
  collection.listRule = "@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)"
  collection.viewRule = ""
  collection.updateRule = "@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)"
  return app.save(collection)
})
