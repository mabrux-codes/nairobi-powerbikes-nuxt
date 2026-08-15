/// <reference path="../pb_data/types.d.ts" />
/// Branches: multi-image support + status for public sync.
migrate((app) => {
  const c = app.findCollectionByNameOrId("branches")
  const has = (name) => !!c.fields.getByName(name)

  if (!has("images")) {
    c.fields.add(new FileField({
      "help": "",
      "hidden": false,
      "id": "file_branch_images",
      "maxSelect": 15,
      "maxSize": 5242880,
      "mimeTypes": ["image/jpeg", "image/png", "image/webp", "image/avif"],
      "name": "images",
      "presentable": false,
      "protected": false,
      "required": false,
      "system": false,
      "thumbs": null,
      "type": "file"
    }))
  }
  if (!has("image_categories")) {
    c.fields.add(new JSONField({
      "help": "",
      "hidden": false,
      "id": "json_branch_imgcats",
      "maxSize": 0,
      "name": "image_categories",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "json"
    }))
  }
  if (!has("main_image")) {
    c.fields.add(new NumberField({
      "help": "",
      "hidden": false,
      "id": "number_branch_mainimg",
      "max": null,
      "min": 0,
      "name": "main_image",
      "onlyInt": true,
      "presentable": false,
      "required": false,
      "system": false,
      "type": "number"
    }))
  }
  if (!has("status")) {
    c.fields.add(new SelectField({
      "help": "",
      "hidden": false,
      "id": "select_branch_status",
      "maxSelect": 1,
      "name": "status",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "select",
      "values": ["active", "inactive"]
    }))
  }
  return app.save(c)
}, (app) => {
  const c = app.findCollectionByNameOrId("branches")
  c.fields.removeByName("images")
  c.fields.removeByName("image_categories")
  c.fields.removeByName("main_image")
  c.fields.removeByName("status")
  return app.save(c)
})