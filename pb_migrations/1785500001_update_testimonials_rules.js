migrate(function(app) {
  var collection = app.findCollectionByNameOrId("pbc_1873367423")
  if (!collection) collection = app.findCollectionByNameOrId("testimonials")
  if (!collection) return
  collection.listRule = null
  collection.viewRule = null
  app.save(collection)
}, function(app) {
  var collection = app.findCollectionByNameOrId("pbc_1873367423")
  if (!collection) collection = app.findCollectionByNameOrId("testimonials")
  if (!collection) return
  collection.listRule = ""
  collection.viewRule = ""
  app.save(collection)
})
