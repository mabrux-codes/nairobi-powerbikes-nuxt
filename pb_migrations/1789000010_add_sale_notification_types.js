/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("notifications")
  const typeField = collection.fields.getByName("type")
  const additions = ["sale", "payment", "finance"].filter((v) => !typeField.values.includes(v))
  if (additions.length > 0) typeField.values = [...typeField.values, ...additions]
  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("notifications")
  const typeField = collection.fields.getByName("type")
  typeField.values = typeField.values.filter((v) => !["sale", "payment", "finance"].includes(v))
  return app.save(collection)
})
