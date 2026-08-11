/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const c = app.findCollectionByNameOrId("blog_posts")
  const image = c.fields.getByName("image")
  if (image.maxSelect < 15) image.maxSelect = 15
  if (!c.fields.getByName("status")) {
    c.fields.add(new SelectField({ "name": "status", "required": false, "maxSelect": 1, "values": ["draft", "published", "scheduled", "archived"], "presentable": false }))
  }
  if (!c.fields.getByName("featured")) {
    c.fields.add(new BoolField({ "name": "featured", "required": false, "presentable": false }))
  }
  if (!c.fields.getByName("category")) {
    c.fields.add(new TextField({ "name": "category", "max": 200, "min": 0, "required": false, "presentable": false }))
  }
  if (!c.fields.getByName("reading_time")) {
    c.fields.add(new NumberField({ "name": "reading_time", "onlyInt": true, "min": 0, "max": null, "required": false, "presentable": false }))
  }
  if (!c.fields.getByName("seo_title")) {
    c.fields.add(new TextField({ "name": "seo_title", "max": 200, "min": 0, "required": false, "presentable": false }))
  }
  if (!c.fields.getByName("seo_description")) {
    c.fields.add(new TextField({ "name": "seo_description", "max": 500, "min": 0, "required": false, "presentable": false }))
  }
  // published_at text -> date (needed for scheduling)
  const pt = c.fields.getByName("published_at")
  if (pt && pt.type !== "date") {
    c.fields.removeByName("published_at")
    c.fields.add(new DateField({ "name": "published_at", "required": false, "presentable": false }))
  }
  const visible = "@request.auth.role = 'admin' || (status = 'published' && (published_at = null || published_at <= @now))"
  c.listRule = visible
  c.viewRule = visible
  return app.save(c)
}, (app) => {
  const c = app.findCollectionByNameOrId("blog_posts")
  c.fields.removeByName("status")
  c.fields.removeByName("featured")
  c.fields.removeByName("category")
  c.fields.removeByName("reading_time")
  c.fields.removeByName("seo_title")
  c.fields.removeByName("seo_description")
  c.listRule = "@request.auth.role = 'admin' || published = true"
  c.viewRule = ""
  return app.save(c)
})
