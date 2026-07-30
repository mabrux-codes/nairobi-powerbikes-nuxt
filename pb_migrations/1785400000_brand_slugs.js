migrate(function(app) {
  var collection = app.findCollectionByNameOrId("brands")
  if (!collection) return

  var allRecords = app.findRecordsByFilter("brands", "", 0, 0, "created")
  for (var i = 0; i < allRecords.length; i++) {
    var rec = allRecords[i]
    var slug = rec.getString("slug")
    if (slug) continue
    var name = rec.getString("name")
    slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    rec.set("slug", slug)
    app.save(rec)
  }
}, function(app) {
})
