/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("notifications")
  const typeField = collection.fields.getByName("type")
  const values = typeField.values
  if (!values.includes("stock")) {
    typeField.values = [...values, "stock"]
  }
  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("notifications")
  const typeField = collection.fields.getByName("type")
  typeField.values = typeField.values.filter((v) => v !== "stock")
  return app.save(collection)
})