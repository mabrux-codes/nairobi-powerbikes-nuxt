/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  for (const name of ["accessories", "apparel"]) {
    const c = app.findCollectionByNameOrId(name)
    const image = c.fields.getByName("image")
    if (image.maxSelect < 15) image.maxSelect = 15
    if (!c.fields.getByName("image_categories")) {
      c.fields.add(new JSONField({ "name": "image_categories", "maxSize": 0, "required": false, "presentable": false }))
    }
    if (!c.fields.getByName("main_image")) {
      c.fields.add(new NumberField({ "name": "main_image", "onlyInt": true, "min": 0, "max": null, "required": false, "presentable": false }))
    }
    app.save(c)
  }
}, (app) => {
  for (const name of ["accessories", "apparel"]) {
    const c = app.findCollectionByNameOrId(name)
    c.fields.removeByName("image_categories")
    c.fields.removeByName("main_image")
    app.save(c)
  }
})
