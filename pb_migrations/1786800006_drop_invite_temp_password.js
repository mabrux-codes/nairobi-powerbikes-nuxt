migrate((app) => {
  const c = app.findCollectionByNameOrId("staff_invitations")
  const f = c.fields.getByName("temp_password")
  if (f) c.fields.removeById(f.id)
  app.save(c)
}, (app) => {
  const c = app.findCollectionByNameOrId("staff_invitations")
  const f = c.fields.getByName("temp_password")
  if (!f) {
    c.fields.add(new Field({
      "autogeneratePattern": "",
      "help": "",
      "hidden": false,
      "id": "text_invite_temp_password",
      "max": 200,
      "min": 0,
      "name": "temp_password",
      "pattern": "",
      "presentable": false,
      "primaryKey": false,
      "required": false,
      "system": false,
      "type": "text"
    }))
    app.save(c)
  }
})