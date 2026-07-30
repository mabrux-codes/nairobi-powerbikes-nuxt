migrate(function(app) {
  var records = app.findRecordsByFilter("brands", "", "created", 1, 999)
  for (var i = 0; i < records.length; i++) {
    var rec = records[i]
    var slug = rec.getString("slug")
    if (slug) continue
    var name = rec.getString("name")
    slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    rec.set("slug", slug)
    app.save(rec)
  }
}, function(app) {
})
