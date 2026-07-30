migrate(function(app) {
  var collection = app.findCollectionByNameOrId("brands")
  if (!collection) return

  var records = app.findRecordsByFilter("brands", "slug = '' || slug = null", 0, 0, "")
  for (var i = 0; i < records.length; i++) {
    var rec = records[i]
    var name = rec.getString("name")
    var slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    rec.set("slug", slug)
    app.save(rec)
  }
}, function(app) {
})
