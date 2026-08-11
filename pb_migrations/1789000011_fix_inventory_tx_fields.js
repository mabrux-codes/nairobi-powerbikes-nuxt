/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const c = app.findCollectionByNameOrId("inventory_transactions")
  for (const name of ["quantity_before", "quantity_change", "quantity_after"]) {
    const f = c.fields.getByName(name)
    f.required = false
  }
  return app.save(c)
}, (app) => {
  const c = app.findCollectionByNameOrId("inventory_transactions")
  for (const name of ["quantity_before", "quantity_change", "quantity_after"]) {
    const f = c.fields.getByName(name)
    f.required = true
  }
  return app.save(c)
})
