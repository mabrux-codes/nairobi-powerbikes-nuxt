/// <reference path="../pb_data/types.d.ts" />

// Add missing system autodate fields (created/updated) to the JSVM-created
// email collections so they support default sort + timestamps.

const AUTODATE = {
  created: new DateField({ name: "created", system: true, hidden: false }),
  updated: new DateField({ name: "updated", system: true, hidden: false }),
}

migrate((app) => {
  for (const name of ["email_queue", "email_logs", "email_preferences", "email_automations", "email_campaigns"]) {
    const c = app.findCollectionByNameOrId(name)
    if (c.fields.getByName("created") == null) c.fields.add(AUTODATE.created)
    if (c.fields.getByName("updated") == null) c.fields.add(AUTODATE.updated)
    app.save(c)
  }
})
