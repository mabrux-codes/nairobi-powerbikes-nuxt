/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("legal_pages");

  collection.indexes = collection.indexes.map((index) =>
    index.replace("CREATE UNIQUE INDEX", "CREATE INDEX"),
  );

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("legal_pages");

  collection.indexes = collection.indexes.map((index) =>
    index.replace("CREATE INDEX", "CREATE UNIQUE INDEX"),
  );

  return app.save(collection);
})
