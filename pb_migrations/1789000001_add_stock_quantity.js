/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("motorcycles")

  // add numeric stock quantity field
  collection.fields.add(new Field({
    "help": "Live available quantity. 0 = out of stock. Whole numbers only.",
    "hidden": false,
    "id": "number1874953021",
    "max": null,
    "min": null,
    "name": "stock_quantity",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  app.save(collection)

  // backfill existing records: available + in_stock -> 10, otherwise 0
  const records = app.findRecordsByFilter("motorcycles", "", "", 500, 0)
  for (const r of records) {
    const status = r.getString("status")
    const inStock = r.getBool("in_stock")
    r.set("stock_quantity", status === "available" && inStock ? 10 : 0)
    app.save(r)
  }
}, (app) => {
  const collection = app.findCollectionByNameOrId("motorcycles")
  const field = collection.fields.getByName("stock_quantity")
  if (field) collection.fields.removeById(field.id)
  app.save(collection)
})