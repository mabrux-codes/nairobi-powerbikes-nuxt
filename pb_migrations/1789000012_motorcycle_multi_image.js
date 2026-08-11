/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const c = app.findCollectionByNameOrId("motorcycles")
  const images = c.fields.getByName("images")
  if (images.maxSelect < 15) images.maxSelect = 15
  if (!c.fields.getByName("image_categories")) {
    c.fields.add(new JSONField({ "name": "image_categories", "maxSize": 0, "required": false, "presentable": false }))
  }
  if (!c.fields.getByName("main_image")) {
    c.fields.add(new NumberField({ "name": "main_image", "onlyInt": true, "min": 0, "max": null, "required": false, "presentable": false }))
  }
  return app.save(c)
}, (app) => {
  const c = app.findCollectionByNameOrId("motorcycles")
  c.fields.removeByName("image_categories")
  c.fields.removeByName("main_image")
  return app.save(c)
})
