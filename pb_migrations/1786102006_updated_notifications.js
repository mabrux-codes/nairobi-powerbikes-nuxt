/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2301922722")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id = user || (@request.auth.role = 'admin' && user = '')",
    "listRule": "@request.auth.id = user || (@request.auth.role = 'admin' && user = '')",
    "updateRule": "@request.auth.id = user || (@request.auth.role = 'admin' && user = '')",
    "viewRule": "@request.auth.id = user || (@request.auth.role = 'admin' && user = '')"
  }, collection)

  // add field
  collection.fields.addAt(10, new Field({
    "help": "",
    "hidden": false,
    "id": "select_role_target",
    "maxSelect": 1,
    "name": "role",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "admin",
      "customer",
      "staff"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2301922722")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.role = 'admin'",
    "listRule": "@request.auth.role = 'admin' || (@request.auth.role = 'customer' && (@request.auth.id = user || broadcast = true))",
    "updateRule": "@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)",
    "viewRule": "@request.auth.role = 'admin' || (@request.auth.role = 'customer' && (@request.auth.id = user || broadcast = true))"
  }, collection)

  // remove field
  collection.fields.removeById("select_role_target")

  return app.save(collection)
})
