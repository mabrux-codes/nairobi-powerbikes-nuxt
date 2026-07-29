/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_986407980")

  collection.viewRule = "@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)"

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_986407980")

  collection.viewRule = ""

  return app.save(collection)
})
