migrate((app) => {
  const collections = [
    "testimonials", "motorcycles", "brands", "branches",
    "categories", "faqs", "gallery", "offers", "hero_images",
    "accessories", "apparel", "team_members", "timeline_milestones",
    "services", "service_types", "company_stats"
  ]

  for (let i = 0; i < collections.length; i++) {
    let c = app.findCollectionByNameOrId(collections[i])
    c.listRule = "1=1"
    c.viewRule = "1=1"
    app.save(c)
  }
}, (app) => {})
