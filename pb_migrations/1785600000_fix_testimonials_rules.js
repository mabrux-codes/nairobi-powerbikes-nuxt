migrate(function(app) {
  var collection = app.findCollectionByNameOrId("testimonials")
  if (!collection) collection = app.findCollectionByNameOrId("pbc_1873367423")
  if (!collection) return
  collection.listRule = null
  collection.viewRule = null
  try {
    app.save(collection)
  } catch(e) {
    // fallback: direct SQL update
    app.db().newQuery("UPDATE collections SET listRule = NULL, viewRule = NULL WHERE name = 'testimonials'").execute()
  }
}, function(app) {
  var collection = app.findCollectionByNameOrId("testimonials")
  if (!collection) collection = app.findCollectionByNameOrId("pbc_1873367423")
  if (!collection) return
  collection.listRule = ""
  collection.viewRule = ""
  try {
    app.save(collection)
  } catch(e) {
    app.db().newQuery("UPDATE collections SET listRule = '', viewRule = '' WHERE name = 'testimonials'").execute()
  }
})
