/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "(@request.auth.role != 'customer' && @request.auth.id != '') || (@request.auth.role = 'customer' && conversation.customer = @request.auth.id)",
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
        "cascadeDelete": true,
        "collectionId": "pbc_chat_conversations",
        "help": "",
        "hidden": false,
        "id": "relation2789754894",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "conversation",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "help": "",
        "hidden": false,
        "id": "relation3754839578",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "sender",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "help": "",
        "hidden": false,
        "id": "select2229458912",
        "maxSelect": 1,
        "name": "sender_type",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": ["customer", "agent", "system", "note"]
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text2384114936",
        "max": 5000,
        "min": 0,
        "name": "body",
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
        "id": "file2555784536",
        "maxSelect": 4,
        "maxSize": 8388608,
        "mimeTypes": null,
        "name": "attachments",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": null,
        "type": "file"
      },
      {
        "help": "",
        "hidden": false,
        "id": "date1400116402",
        "max": "",
        "min": "",
        "name": "delivered_at",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "help": "",
        "hidden": false,
        "id": "date3633011298",
        "max": "",
        "min": "",
        "name": "customer_read_at",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "help": "",
        "hidden": false,
        "id": "date3812929165",
        "max": "",
        "min": "",
        "name": "agent_read_at",
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
        "id": "autodate3324736407",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "autodate2224256119",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_chat_messages",
    "indexes": [
      "CREATE INDEX `idx_chat_messages_conversation` ON `chat_messages` (`conversation`)"
    ],
    "listRule": "(@request.auth.role != 'customer' && @request.auth.id != '') || (@request.auth.role = 'customer' && conversation.customer = @request.auth.id && sender_type != 'note')",
    "name": "chat_messages",
    "system": false,
    "type": "base",
    "updateRule": "(@request.auth.role != 'customer' && @request.auth.id != '') || (@request.auth.role = 'customer' && conversation.customer = @request.auth.id)",
    "viewRule": "(@request.auth.role != 'customer' && @request.auth.id != '') || (@request.auth.role = 'customer' && conversation.customer = @request.auth.id && sender_type != 'note')"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("chat_messages");

  return app.delete(collection);
})
