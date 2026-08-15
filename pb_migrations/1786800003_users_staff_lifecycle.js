/// <reference path="../pb_data/types.d.ts" />
/// Staff invitation lifecycle fields on users + extended role list.
/// Every invited member gets a temporary password, must change it on first
/// login, and can be suspended/reactivated (blocked at the backend).
migrate((app) => {
  const c = app.findCollectionByNameOrId("_pb_users_auth_")
  const has = (name) => !!c.fields.getByName(name)

  // Extend roles to the full staff set the dashboard already references.
  // PB JSVM: re-add the select field via addAt to persist new values.
  const role = c.fields.getByName("role")
  if (role && role.type === "select") {
    const current = (role.values || []).slice()
    for (const r of ["manager", "mechanic"]) {
      if (current.indexOf(r) < 0) current.push(r)
    }
    const idx = c.fields.indexOf(role)
    c.fields.addAt(idx, new Field({
      "help": "",
      "hidden": false,
      "id": "select_role_ext",
      "maxSelect": 1,
      "name": "role",
      "presentable": false,
      "required": true,
      "system": false,
      "type": "select",
      "values": current
    }))
  }

  if (!has("must_change_password")) {
    c.fields.add(new BoolField({
      "help": "",
      "hidden": false,
      "id": "bool_user_mcp",
      "name": "must_change_password",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "bool"
    }))
  }
  if (!has("invited_at")) {
    c.fields.add(new DateField({
      "help": "",
      "hidden": false,
      "id": "date_user_invited_at",
      "max": "",
      "min": "",
      "name": "invited_at",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "date"
    }))
  }
  if (!has("invited_by")) {
    c.fields.add(new TextField({
      "autogeneratePattern": "",
      "help": "",
      "hidden": false,
      "id": "text_user_invited_by",
      "max": 200,
      "min": 0,
      "name": "invited_by",
      "pattern": "",
      "presentable": false,
      "primaryKey": false,
      "required": false,
      "system": false,
      "type": "text"
    }))
  }
  if (!has("activated_at")) {
    c.fields.add(new DateField({
      "help": "",
      "hidden": false,
      "id": "date_user_activated_at",
      "max": "",
      "min": "",
      "name": "activated_at",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "date"
    }))
  }
  if (!has("password_changed_at")) {
    c.fields.add(new DateField({
      "help": "",
      "hidden": false,
      "id": "date_user_pwd_changed_at",
      "max": "",
      "min": "",
      "name": "password_changed_at",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "date"
    }))
  }
  if (!has("suspended_at")) {
    c.fields.add(new DateField({
      "help": "",
      "hidden": false,
      "id": "date_user_suspended_at",
      "max": "",
      "min": "",
      "name": "suspended_at",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "date"
    }))
  }
  if (!has("suspended_by")) {
    c.fields.add(new TextField({
      "autogeneratePattern": "",
      "help": "",
      "hidden": false,
      "id": "text_user_suspended_by",
      "max": 200,
      "min": 0,
      "name": "suspended_by",
      "pattern": "",
      "presentable": false,
      "primaryKey": false,
      "required": false,
      "system": false,
      "type": "text"
    }))
  }
  if (!has("last_login")) {
    c.fields.add(new DateField({
      "help": "",
      "hidden": false,
      "id": "date_user_last_login",
      "max": "",
      "min": "",
      "name": "last_login",
      "presentable": false,
      "required": false,
      "system": false,
      "type": "date"
    }))
  }
  return app.save(c)
}, (app) => {
  const c = app.findCollectionByNameOrId("_pb_users_auth_")
  for (const name of ["must_change_password", "invited_at", "invited_by", "activated_at", "password_changed_at", "suspended_at", "suspended_by", "last_login"]) {
    if (c.fields.getByName(name)) c.fields.removeByName(name)
  }
  return app.save(c)
})