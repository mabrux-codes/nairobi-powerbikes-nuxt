/// <reference path="../pb_data/types.d.ts" />

// ---------------------------------------------------------------------------
// Email infrastructure collections
// ---------------------------------------------------------------------------

const hasCollection = (app, name) => {
  try { app.findCollectionByNameOrId(name); return true } catch (e) { return false }
}

const adminRules = {
  createRule: "@request.auth.role = 'admin'",
  listRule: "@request.auth.role = 'admin'",
  viewRule: "@request.auth.role = 'admin'",
  updateRule: "@request.auth.role = 'admin'",
  deleteRule: "@request.auth.role = 'admin'",
}

migrate((app) => {
  // Extend the existing email_templates collection with the full schema
  {
    const c = app.findCollectionByNameOrId("email_templates")
    if (c.fields.getByName("key") == null) c.fields.add(new TextField({ name: "key", max: 200 }))
    if (c.fields.getByName("category") == null) c.fields.add(new TextField({ name: "category", max: 100 }))
    if (c.fields.getByName("html") == null) c.fields.add(new TextField({ name: "html", max: 200000 }))
    if (c.fields.getByName("text") == null) c.fields.add(new TextField({ name: "text", max: 200000 }))
    if (c.fields.getByName("enabled") == null) c.fields.add(new BoolField({ name: "enabled" }))
    app.save(c)
  }

  // email_queue
  if (!hasCollection(app, "email_queue")) {
    const c = new Collection(Object.assign({ name: "email_queue", type: "base" }, adminRules))
    c.fields.add(new EmailField({ name: "recipient", required: true }))
    c.fields.add(new TextField({ name: "recipientName", max: 300 }))
    c.fields.add(new TextField({ name: "template", max: 200, required: true }))
    c.fields.add(new JSONField({ name: "payload", maxSize: 200000 }))
    c.fields.add(new TextField({ name: "category", max: 100 }))
    c.fields.add(new SelectField({ name: "priority", maxSelect: 1, values: ["low", "normal", "high"] }))
    c.fields.add(new SelectField({ name: "status", maxSelect: 1, values: ["queued", "processing", "sent", "failed", "cancelled"] }))
    c.fields.add(new NumberField({ name: "attempts", onlyInt: true, min: 0 }))
    c.fields.add(new DateField({ name: "scheduledFor" }))
    c.fields.add(new DateField({ name: "sentAt" }))
    c.fields.add(new DateField({ name: "failedAt" }))
    c.fields.add(new TextField({ name: "lastError", max: 2000 }))
    c.fields.add(new TextField({ name: "relatedType", max: 100 }))
    c.fields.add(new TextField({ name: "relatedId", max: 200 }))
    c.fields.add(new TextField({ name: "idempotencyKey", max: 400 }))
    app.save(c)
  }

  // email_logs
  if (!hasCollection(app, "email_logs")) {
    const c = new Collection({
      name: "email_logs",
      type: "base",
      createRule: "",
      listRule: "@request.auth.role = 'admin'",
      viewRule: "@request.auth.role = 'admin'",
      updateRule: "",
      deleteRule: "@request.auth.role = 'admin'",
    })
    c.fields.add(new TextField({ name: "queueId", max: 200 }))
    c.fields.add(new EmailField({ name: "recipient", required: true }))
    c.fields.add(new TextField({ name: "subject", max: 400 }))
    c.fields.add(new TextField({ name: "template", max: 200 }))
    c.fields.add(new TextField({ name: "category", max: 100 }))
    c.fields.add(new SelectField({ name: "status", maxSelect: 1, values: ["queued", "sent", "failed"] }))
    c.fields.add(new NumberField({ name: "attempts", onlyInt: true, min: 0 }))
    c.fields.add(new DateField({ name: "sentAt" }))
    c.fields.add(new DateField({ name: "failedAt" }))
    c.fields.add(new TextField({ name: "error", max: 2000 }))
    c.fields.add(new TextField({ name: "relatedType", max: 100 }))
    c.fields.add(new TextField({ name: "relatedId", max: 200 }))
    c.fields.add(new TextField({ name: "idempotencyKey", max: 400 }))
    app.save(c)
  }

  // email_preferences
  if (!hasCollection(app, "email_preferences")) {
    const c = new Collection({
      name: "email_preferences",
      type: "base",
      createRule: "",
      listRule: "@request.auth.role = 'admin'",
      viewRule: "@request.auth.role = 'admin'",
      updateRule: "",
      deleteRule: "@request.auth.role = 'admin'",
    })
    c.fields.add(new RelationField({ name: "user", collectionId: "_pb_users_auth_", maxSelect: 1, required: true }))
    c.fields.add(new BoolField({ name: "marketing" }))
    c.fields.add(new BoolField({ name: "promotions" }))
    c.fields.add(new BoolField({ name: "newMotorcycles" }))
    c.fields.add(new BoolField({ name: "blog" }))
    c.fields.add(new BoolField({ name: "offers" }))
    c.fields.add(new BoolField({ name: "wishlistAlerts" }))
    c.fields.add(new BoolField({ name: "restockAlerts" }))
    app.save(c)
  }

  // email_automations
  if (!hasCollection(app, "email_automations")) {
    const c = new Collection(Object.assign({ name: "email_automations", type: "base" }, adminRules))
    c.fields.add(new TextField({ name: "name", max: 200, required: true }))
    c.fields.add(new TextField({ name: "trigger", max: 200, required: true }))
    c.fields.add(new TextField({ name: "condition", max: 2000 }))
    c.fields.add(new NumberField({ name: "delayHours", onlyInt: true, min: 0 }))
    c.fields.add(new TextField({ name: "template", max: 200 }))
    c.fields.add(new BoolField({ name: "enabled" }))
    app.save(c)
  }

  // Extend subscribers with marketing fields
  {
    const c = app.findCollectionByNameOrId("subscribers")
    if (c.fields.getByName("firstName") == null) c.fields.add(new TextField({ name: "firstName", max: 300 }))
    if (c.fields.getByName("lastName") == null) c.fields.add(new TextField({ name: "lastName", max: 300 }))
    if (c.fields.getByName("customer") == null) c.fields.add(new RelationField({ name: "customer", collectionId: "_pb_users_auth_", maxSelect: 1 }))
    if (c.fields.getByName("status") == null) c.fields.add(new SelectField({ name: "status", maxSelect: 1, values: ["subscribed", "unsubscribed", "bounced", "complained"] }))
    if (c.fields.getByName("marketingConsent") == null) c.fields.add(new BoolField({ name: "marketingConsent" }))
    if (c.fields.getByName("consentDate") == null) c.fields.add(new DateField({ name: "consentDate" }))
    if (c.fields.getByName("unsubscribeToken") == null) c.fields.add(new TextField({ name: "unsubscribeToken", max: 200 }))
    if (c.fields.getByName("source") == null) c.fields.add(new TextField({ name: "source", max: 100 }))
    app.save(c)
  }

  // email_campaigns (marketing)
  if (!hasCollection(app, "email_campaigns")) {
    const c = new Collection(Object.assign({ name: "email_campaigns", type: "base" }, adminRules))
    c.fields.add(new TextField({ name: "name", max: 300, required: true }))
    c.fields.add(new TextField({ name: "subject", max: 400, required: true }))
    c.fields.add(new TextField({ name: "previewText", max: 400 }))
    c.fields.add(new SelectField({ name: "audience", maxSelect: 1, values: ["all_subscribers", "customers", "test_ride", "service", "financing", "wishlist", "waiting_list"] }))
    c.fields.add(new TextField({ name: "template", max: 200 }))
    c.fields.add(new TextField({ name: "html", max: 200000 }))
    c.fields.add(new SelectField({ name: "status", maxSelect: 1, values: ["draft", "scheduled", "sending", "sent", "cancelled"] }))
    c.fields.add(new DateField({ name: "scheduledDate" }))
    c.fields.add(new DateField({ name: "sentDate" }))
    c.fields.add(new NumberField({ name: "recipientCount", onlyInt: true, min: 0 }))
    app.save(c)
  }
})
