/// <reference path="../pb_data/types.d.ts" />
/// Fix roles select values to include the full staff set.
migrate((app) => {
  const c = app.findCollectionByNameOrId("_pb_users_auth_")
  const role = c.fields.getByName("role")
  const current = (role && role.values ? role.values.slice() : []).slice()
  for (const r of ["manager", "mechanic"]) {
    if (current.indexOf(r) < 0) current.push(r)
  }
  const idx = c.fields.indexOf(role)
  c.fields.addAt(idx, new Field({
    "help": "",
    "hidden": false,
    "id": role.id || "select1466534506",
    "maxSelect": 1,
    "name": "role",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": current
  }))
  return app.save(c)
}, (app) => {
  const c = app.findCollectionByNameOrId("_pb_users_auth_")
  c.fields.addAt(c.fields.indexOf(c.fields.getByName("role")), new Field({
    "help": "",
    "hidden": false,
    "id": "select_role_orig",
    "maxSelect": 1,
    "name": "role",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": ["customer", "admin", "salesperson"]
  }))
  return app.save(c)
})