/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const c = app.findCollectionByNameOrId("motorcycles")
  if (!c.fields.getByName("units_sold")) {
    c.fields.add(new NumberField({ "name": "units_sold", "onlyInt": true, "min": 0, "max": null, "required": false, "presentable": false }))
  }
  if (!c.fields.getByName("reserved_quantity")) {
    c.fields.add(new NumberField({ "name": "reserved_quantity", "onlyInt": true, "min": 0, "max": null, "required": false, "presentable": false }))
  }
  return app.save(c)
}, (app) => {
  const c = app.findCollectionByNameOrId("motorcycles")
  c.fields.removeByName("units_sold")
  c.fields.removeByName("reserved_quantity")
  return app.save(c)
})
