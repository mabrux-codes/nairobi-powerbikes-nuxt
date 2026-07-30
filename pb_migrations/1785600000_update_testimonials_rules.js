migrate(function(app) {
  var collection = app.findCollectionByNameOrId("testimonials")
  collection.listRule = null
  collection.viewRule = null
  app.save(collection)
})
