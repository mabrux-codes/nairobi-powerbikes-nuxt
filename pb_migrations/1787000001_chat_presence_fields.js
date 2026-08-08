/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const conv = app.findCollectionByNameOrId("chat_conversations")

  // add customer_last_seen (heartbeat timestamp for online presence)
  conv.fields.addAt(19, new Field({
    "help": "Updated by the customer/guest heartbeat to power online presence.",
    "hidden": false,
    "id": "date1787000001",
    "max": "",
    "min": "",
    "name": "customer_last_seen",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  app.save(conv)

  // add "away" to users.availability select
  const users = app.findCollectionByNameOrId("_pb_users_auth_")
  const avail = users.fields.getByName("availability")
  if (avail) {
    avail.values = ["online", "away", "busy", "offline"]
    app.save(users)
  }
}, (app) => {
  const conv = app.findCollectionByNameOrId("chat_conversations")
  conv.fields.removeById("date1787000001")
  app.save(conv)

  const users = app.findCollectionByNameOrId("_pb_users_auth_")
  const avail = users.fields.getByName("availability")
  if (avail) {
    avail.values = ["online", "busy", "offline"]
    app.save(users)
  }
})
