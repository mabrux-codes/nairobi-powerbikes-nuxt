/// <reference path="../pb_data/types.d.ts" />

// Email preferences collection adjustments:
//  - add `email` (prefs for unsubscribed guests / email-only visitors)
//  - make `user` optional (guests have no account)
//  - email_campaigns: add `category` (promotion category used for consent gating)

migrate((app) => {
  {
    const c = app.findCollectionByNameOrId("email_preferences")
    if (c.fields.getByName("email") == null) {
      c.fields.add(new EmailField({ name: "email" }))
    }
    const userField = c.fields.getByName("user")
    if (userField != null && userField.required) {
      // add() replaces the existing field by name, keeping optionals.
      c.fields.add(new RelationField({
        name: "user",
        collectionId: "_pb_users_auth_",
        maxSelect: 1,
        minSelect: 0,
        required: false,
      }))
    }
    app.save(c)
  }

  {
    const c = app.findCollectionByNameOrId("email_campaigns")
    if (c.fields.getByName("category") == null) {
      c.fields.add(new TextField({ name: "category", max: 100 }))
    }
    app.save(c)
  }
})