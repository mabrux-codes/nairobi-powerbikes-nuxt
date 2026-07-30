migrate(function(app) {
  try {
    var collection = app.findCollectionByNameOrId("testimonials")
    collection.listRule = null
    collection.viewRule = null
    app.save(collection)
    console.log("testimonials rules updated via app.save")
  } catch(e) {
    console.log("app.save failed: " + e)
    try {
      var collection = $app.findCollectionByNameOrId("testimonials")
      collection.listRule = null
      collection.viewRule = null
      $app.save(collection)
      console.log("testimonials rules updated via $app.save")
    } catch(e2) {
      console.log("$app.save failed: " + e2)
      try {
        $app.db().newQuery("UPDATE _collections SET listRule = NULL, viewRule = NULL WHERE name = 'testimonials'").execute()
        console.log("testimonials rules updated via SQL")
      } catch(e3) {
        console.log("SQL update also failed: " + e3)
      }
    }
  }
})
