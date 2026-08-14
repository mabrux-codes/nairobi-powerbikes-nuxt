/// <reference path="../pb_data/types.d.ts" />
/// Split test rides out of the shared `service_bookings` collection into
/// their own `test_rides` collection.
///
/// Up:
///   1. create the test_rides collection (test-ride fields only)
///   2. copy all type = 'test_ride' records (SQL, preserves created/updated)
///   3. copy the id_document / drivers_license file bytes
///   4. delete the moved records from service_bookings
///   5. restrict service_bookings.type to ['service'] to prevent mixing again
///
/// Data moves via raw SQL so no record event hooks (emails, notifications)
/// fire for the migration itself.
migrate((app) => {
  // --- 1. create the collection ---
  const collection = new Collection({
    "createRule": "",
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
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "help": "",
        "hidden": false,
        "id": "relation8712a3c001",
        "maxSelect": 0,
        "minSelect": 0,
        "name": "user",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text8491b2c301",
        "max": 200,
        "min": 0,
        "name": "name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text3017d5e402",
        "max": 50,
        "min": 0,
        "name": "phone",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "exceptDomains": null,
        "help": "",
        "hidden": false,
        "id": "email6129a8c703",
        "name": "email",
        "onlyDomains": null,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "email"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text9325d1e804",
        "max": 300,
        "min": 0,
        "name": "motorcycle",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text4478b2f105",
        "max": 200,
        "min": 0,
        "name": "branch",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text7582c9a306",
        "max": 100,
        "min": 0,
        "name": "preferred_date",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text2294d6b107",
        "max": 50,
        "min": 0,
        "name": "preferred_time",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text6835a1c208",
        "max": 200,
        "min": 0,
        "name": "ride_experience",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text9157d3e409",
        "max": 5000,
        "min": 0,
        "name": "notes",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text3318b2f510",
        "max": 200,
        "min": 0,
        "name": "assigned_to",
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
        "id": "select5826c9a311",
        "maxSelect": 0,
        "name": "status",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "pending",
          "awaiting_verification",
          "confirmed",
          "rescheduled",
          "ready",
          "checked_in",
          "in_progress",
          "quality_check",
          "completed",
          "cancelled",
          "rejected",
          "no_show",
          "diagnosed",
          "awaiting_approval",
          "approved"
        ]
      },
      {
        "help": "",
        "hidden": false,
        "id": "file7412d5e812",
        "maxSelect": 1,
        "maxSize": 5242880,
        "mimeTypes": ["image/jpeg", "image/png", "application/pdf"],
        "name": "id_document",
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
        "id": "file1187b3f213",
        "maxSelect": 1,
        "maxSize": 5242880,
        "mimeTypes": ["image/jpeg", "image/png", "application/pdf"],
        "name": "drivers_license",
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
        "id": "autodate_c_tr",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "help": "",
        "hidden": false,
        "id": "autodate_u_tr",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_74510c2d9f",
    "indexes": [],
    "listRule": "@request.auth.role = 'admin' || @request.auth.id = @request.auth.id",
    "name": "test_rides",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)",
    "viewRule": "@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)"
  })
  app.save(collection)

  // --- 2-4. move records (SQL so record hooks stay silent) ---
  var srcColl = null
  try { srcColl = app.findCollectionByNameOrId("service_bookings") } catch (e) { srcColl = app.findCollectionByNameOrId("bookings") }
  var srcId = srcColl.id
  var dstId = collection.id
  var srcTable = srcColl.name
  var dstTable = collection.name
  var storageBase = app.dataDir() + "/storage/"

  // read the rows column by column (JSVM `all()`/`scanMap()` can't populate JS objects)
  var cols = ["id", "user", "name", "phone", "email", "motorcycle", "branch", "preferred_date", "preferred_time", "ride_experience", "notes", "assigned_to", "status", "id_document", "drivers_license", "created", "updated"]
  var colData = {}
  for (var ci = 0; ci < cols.length; ci++) {
    var arr = nullArray()
    app.db().newQuery(
      "SELECT [" + cols[ci] + "] FROM " + srcTable + " WHERE type = {:t} ORDER BY id"
    ).bind({ t: "test_ride" }).column(arr)
    colData[cols[ci]] = arr
  }
  var rows = []
  for (var ri = 0; ri < colData["id"].length; ri++) {
    var r = {}
    for (var cj = 0; cj < cols.length; cj++) r[cols[cj]] = colData[cols[cj]][ri]
    rows.push(r)
  }

  for (var i = 0; i < rows.length; i++) {
    var r = rows[i]
    var id = r["id"]

    // copy file bytes into the new collection's storage dir
    var srcDir = storageBase + srcId + "/" + id + "/"
    var dstDir = storageBase + dstId + "/" + id + "/"
    var fileFields = ["id_document", "drivers_license"]
    var newFiles = {}
    for (var f = 0; f < fileFields.length; f++) {
      var field = fileFields[f]
      var val = r[field]
      var names = []
      if (val) {
        try { names = JSON.parse(val) } catch (e) { names = [] }
      }
      var kept = []
      for (var n = 0; n < names.length; n++) {
        var fn = names[n]
        var from = srcDir + fn
        try {
          if ($os.stat(from)) {
            $os.mkdirAll(dstDir)
            $os.writeFile(dstDir + fn, $os.readFile(from))
            kept.push(fn)
          }
        } catch (e) {}
      }
      newFiles[field] = kept
    }

    app.db().newQuery(
      "INSERT INTO " + dstTable + " (id, [user], name, phone, email, motorcycle, branch, preferred_date, preferred_time, ride_experience, notes, assigned_to, status, id_document, drivers_license, created, updated) VALUES ({:id}, {:user}, {:name}, {:phone}, {:email}, {:motorcycle}, {:branch}, {:preferred_date}, {:preferred_time}, {:ride_experience}, {:notes}, {:assigned_to}, {:status}, {:id_document}, {:drivers_license}, {:created}, {:updated})"
    ).bind({
      id: id,
      user: r["user"],
      name: r["name"] || "",
      phone: r["phone"] || "",
      email: r["email"] || "",
      motorcycle: r["motorcycle"] || "",
      branch: r["branch"] || "",
      preferred_date: r["preferred_date"] || "",
      preferred_time: r["preferred_time"] || "",
      ride_experience: r["ride_experience"] || "",
      notes: r["notes"] || "",
      assigned_to: r["assigned_to"] || "",
      status: r["status"] || "",
      id_document: newFiles["id_document"].length ? JSON.stringify(newFiles["id_document"]) : "",
      drivers_license: newFiles["drivers_license"].length ? JSON.stringify(newFiles["drivers_license"]) : "",
      created: r["created"] || "",
      updated: r["updated"] || "",
    }).execute()
  }

  app.db().newQuery("DELETE FROM " + srcTable + " WHERE type = {:t}").bind({ t: "test_ride" }).execute()

  // --- 5. restrict the legacy type field to services only ---
  try {
    var typeField = srcColl.fields.getByName("type")
    if (typeField) {
      typeField.values = ["service"]
      app.save(srcColl)
    }
  } catch (e) {}

  // cleanup: drop orphaned storage dirs of the deleted records
  for (var j = 0; j < rows.length; j++) {
    try { $os.removeAll(storageBase + srcId + "/" + rows[j]["id"]) } catch (e) {}
  }
}, (app) => {
  // down: move records back into service_bookings (best effort)
  var coll = app.findCollectionByNameOrId("test_rides")
  var dstColl = null
  try { dstColl = app.findCollectionByNameOrId("service_bookings") } catch (e) { dstColl = app.findCollectionByNameOrId("bookings") }
  try {
    var typeField = dstColl.fields.getByName("type")
    if (typeField) {
      typeField.values = ["service", "test_ride"]
      app.save(dstColl)
    }
  } catch (e) {}
  var srcId = coll.id
  var dstId = dstColl.id
  var srcTable = coll.name
  var dstTable = dstColl.name
  var storageBase = app.dataDir() + "/storage/"

  var cols = ["id", "user", "name", "phone", "email", "motorcycle", "branch", "preferred_date", "preferred_time", "ride_experience", "notes", "assigned_to", "status", "id_document", "drivers_license", "created", "updated"]
  var colData = {}
  for (var ci = 0; ci < cols.length; ci++) {
    var arr = nullArray()
    app.db().newQuery(
      "SELECT [" + cols[ci] + "] FROM " + srcTable + " ORDER BY id"
    ).column(arr)
    colData[cols[ci]] = arr
  }
  var rows = []
  for (var ri = 0; ri < colData["id"].length; ri++) {
    var r = {}
    for (var cj = 0; cj < cols.length; cj++) r[cols[cj]] = colData[cols[cj]][ri]
    rows.push(r)
  }

  for (var i = 0; i < rows.length; i++) {
    var r = rows[i]
    var id = r["id"]
    var srcDir = storageBase + srcId + "/" + id + "/"
    var dstDir = storageBase + dstId + "/" + id + "/"
    var fileFields = ["id_document", "drivers_license"]
    var newFiles = {}
    for (var f = 0; f < fileFields.length; f++) {
      var field = fileFields[f]
      var names = []
      var val = r[field]
      if (val) {
        try { names = JSON.parse(val) } catch (e) { names = [] }
      }
      var kept = []
      for (var n = 0; n < names.length; n++) {
        var fn = names[n]
        try {
          if ($os.stat(srcDir + fn)) {
            $os.mkdirAll(dstDir)
            $os.writeFile(dstDir + fn, $os.readFile(srcDir + fn))
            kept.push(fn)
          }
        } catch (e) {}
      }
      newFiles[field] = kept
    }

    app.db().newQuery(
      "INSERT INTO " + dstTable + " (id, [user], type, name, phone, email, motorcycle, branch, preferred_date, preferred_time, ride_experience, notes, assigned_to, status, id_document, drivers_license, created, updated) VALUES ({:id}, {:user}, {:type}, {:name}, {:phone}, {:email}, {:motorcycle}, {:branch}, {:preferred_date}, {:preferred_time}, {:ride_experience}, {:notes}, {:assigned_to}, {:status}, {:id_document}, {:drivers_license}, {:created}, {:updated})"
    ).bind({
      id: id,
      user: r["user"],
      type: "test_ride",
      name: r["name"] || "",
      phone: r["phone"] || "",
      email: r["email"] || "",
      motorcycle: r["motorcycle"] || "",
      branch: r["branch"] || "",
      preferred_date: r["preferred_date"] || "",
      preferred_time: r["preferred_time"] || "",
      ride_experience: r["ride_experience"] || "",
      notes: r["notes"] || "",
      assigned_to: r["assigned_to"] || "",
      status: r["status"] || "",
      id_document: newFiles["id_document"].length ? JSON.stringify(newFiles["id_document"]) : "",
      drivers_license: newFiles["drivers_license"].length ? JSON.stringify(newFiles["drivers_license"]) : "",
      created: r["created"] || "",
      updated: r["updated"] || "",
    }).execute()
  }

  app.delete(coll)
})
