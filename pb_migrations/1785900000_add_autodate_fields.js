migrate((app) => {
  const missing = [
    "testimonials", "brands", "categories", "branches",
    "team_members", "timeline_milestones", "faqs", "offers",
    "blog_posts", "gallery", "website_settings", "email_templates",
    "media", "audit_logs", "system_settings", "services",
    "company_stats", "service_types", "hero_images"
  ]

  for (let i = 0; i < missing.length; i++) {
    let c = app.findCollectionByNameOrId(missing[i])
    let hasCreated = false
    let hasUpdated = false
    for (let j = 0; j < c.fields.length; j++) {
      if (c.fields[j].name === 'created') hasCreated = true
      if (c.fields[j].name === 'updated') hasUpdated = true
    }
    if (!hasCreated) {
      c.fields.addAt(c.fields.length, new Field({
        "hidden": false,
        "id": "autodate_c_" + missing[i],
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }))
    }
    if (!hasUpdated) {
      c.fields.addAt(c.fields.length, new Field({
        "hidden": false,
        "id": "autodate_u_" + missing[i],
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }))
    }
    app.save(c)
  }
}, (app) => {})
