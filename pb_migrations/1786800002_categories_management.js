/// <reference path="../pb_data/types.d.ts" />
/// Categories: management fields (status, icon, sort order) for the admin
/// management page + public sync. Existing records default to active.
migrate((app) => {
  const c = app.findCollectionByNameOrId("categories")
  const has = (name) => !!c.fields.getByName(name)

  if (!has("status")) {
    c.fields.add(new SelectField({
      "help": "",
      "hidden": false,
      "id": "select_cat_status",
      "maxSelect": 1,
      "name": "status",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "select",
      "values": ["active", "inactive"]
    }))
  }
  if (!has("icon")) {
    c.fields.add(new TextField({
      "autogeneratePattern": "",
      "help": "",
      "hidden": false,
      "id": "text_cat_icon",
      "max": 50,
      "min": 0,
      "name": "icon",
      "pattern": "",
      "presentable": false,
      "primaryKey": false,
      "required": false,
      "system": false,
      "type": "text"
    }))
  }
  if (!has("sort_order")) {
    c.fields.add(new NumberField({
      "help": "",
      "hidden": false,
      "id": "number_cat_sort",
      "max": null,
      "min": null,
      "name": "sort_order",
      "onlyInt": true,
      "presentable": false,
      "required": false,
      "system": false,
      "type": "number"
    }))
  }
  return app.save(c)
}, (app) => {
  const c = app.findCollectionByNameOrId("categories")
  c.fields.removeByName("status")
  c.fields.removeByName("icon")
  c.fields.removeByName("sort_order")
  return app.save(c)
})