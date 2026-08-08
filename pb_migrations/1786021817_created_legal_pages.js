/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "@request.auth.role = 'admin'",
    "deleteRule": "@request.auth.role = 'admin'",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "help": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text3144836161",
        "max": 200,
        "min": 0,
        "name": "title",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text2244390532",
        "max": 100,
        "min": 0,
        "name": "slug",
        "pattern": "^[a-z0-9_-]+$",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text1301875158",
        "max": 500,
        "min": 0,
        "name": "description",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "convertUrls": true,
        "conversionFormats": ["html"],
        "converters": [],
        "enableLinkContext": true,
        "forceAutosave": false,
        "help": "",
        "hidden": false,
        "id": "editor1144368695",
        "maxHeight": null,
        "minHeight": null,
        "name": "body",
        "outline": true,
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "spellcheck": true,
        "system": false,
        "type": "editor"
      },
      {
        "help": "",
        "hidden": false,
        "id": "select1048508523",
        "maxSelect": 1,
        "name": "status",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": ["draft", "published", "archived"]
      },
      {
        "help": "",
        "hidden": false,
        "id": "number2496473988",
        "max": 100000,
        "min": 1,
        "name": "version",
        "onlyInt": true,
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "help": "",
        "hidden": false,
        "id": "date2635488571",
        "max": "",
        "min": "",
        "name": "published_at",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text2282129684",
        "max": 200,
        "min": 0,
        "name": "published_by",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text3888492340",
        "max": 200,
        "min": 0,
        "name": "created_by",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "help": "",
        "hidden": false,
        "id": "date3910558231",
        "max": "",
        "min": "",
        "name": "archived_at",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "date"
      }
    ],
    "id": "pbc_889114334",
    "indexes": [
      "CREATE INDEX `idx_legal_pages_slug` ON `legal_pages` (`slug`)"
    ],
    "listRule": "@request.auth.role = 'admin' || status = 'published'",
    "name": "legal_pages",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.role = 'admin'",
    "viewRule": "@request.auth.role = 'admin' || status = 'published'"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("legal_pages");

  return app.delete(collection);
})