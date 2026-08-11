/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const collection = app.findCollectionByNameOrId("blog_posts")

  if (collection.fields.getByName("image_categories") == null) {
    collection.fields.add(new JSONField({
      name: "image_categories",
      maxSize: 20000,
    }))
  }

  if (collection.fields.getByName("main_image") == null) {
    collection.fields.add(new NumberField({
      name: "main_image",
      onlyInt: true,
      min: 0,
    }))
  }

  app.save(collection)
})
