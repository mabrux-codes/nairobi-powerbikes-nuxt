// legal_pages: the slug identifies the DOCUMENT (all versions share it),
// so the unique constraint added in cms_slugs_richtext is wrong here.
// Keep a non-empty normalized slug enforced by the slug hook, but allow
// multiple versions of the same document.
migrate((app) => {
  const collection = app.findCollectionByNameOrId("legal_pages")
  const field = collection.fields.getByName("slug")
  field.unique = false
  app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("legal_pages")
  const field = collection.fields.getByName("slug")
  field.unique = true
  app.save(collection)
})
