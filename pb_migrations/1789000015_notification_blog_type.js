/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("notifications")
  const typeField = collection.fields.getByName("type")
  if (!typeField.values.includes("blog")) {
    typeField.values = [...typeField.values, "blog"]
  }
  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("notifications")
  const typeField = collection.fields.getByName("type")
  typeField.values = typeField.values.filter((v) => v !== "blog")
  return app.save(collection)
})
