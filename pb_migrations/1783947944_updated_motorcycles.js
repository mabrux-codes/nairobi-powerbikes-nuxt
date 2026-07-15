/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1020517649")

  // add field
  collection.fields.addAt(16, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text9c1ab12102",
    "max": 50,
    "min": 0,
    "name": "engine_cc",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(17, new Field({
    "help": "",
    "hidden": false,
    "id": "select86541eeefa",
    "maxSelect": 1,
    "name": "type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Sport",
      "Cruiser",
      "Touring",
      "Adventure",
      "Naked",
      "Dirt",
      "Scooter",
      "Electric"
    ]
  }))

  // add field
  collection.fields.addAt(18, new Field({
    "help": "",
    "hidden": false,
    "id": "numbercd48b2669d",
    "max": null,
    "min": null,
    "name": "sale_price",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(19, new Field({
    "help": "",
    "hidden": false,
    "id": "bool64102088ba",
    "name": "in_stock",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(20, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text3c4bbde670",
    "max": 100,
    "min": 0,
    "name": "torque",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(21, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "textdf597ace31",
    "max": 100,
    "min": 0,
    "name": "transmission",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(22, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text11d0bc93d8",
    "max": 50,
    "min": 0,
    "name": "fuel_capacity",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(23, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text42e100ce81",
    "max": 50,
    "min": 0,
    "name": "weight",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(24, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "textb0d08aff3d",
    "max": 50,
    "min": 0,
    "name": "top_speed",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(25, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text98da2c092a",
    "max": 200,
    "min": 0,
    "name": "braking",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(26, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "texte75c43cff1",
    "max": 200,
    "min": 0,
    "name": "suspension",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(27, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "textbceb22d390",
    "max": 500,
    "min": 0,
    "name": "colors",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(28, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text511e422037",
    "max": 200,
    "min": 0,
    "name": "warranty",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(29, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "texte45108fe84",
    "max": 200,
    "min": 0,
    "name": "fuel_system",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(30, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text14fae5f7e7",
    "max": 200,
    "min": 0,
    "name": "cooling",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(31, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text7e40be1d4f",
    "max": 100,
    "min": 0,
    "name": "starter",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(32, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text852798317f",
    "max": 200,
    "min": 0,
    "name": "ignition",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(33, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text82e45e7e59",
    "max": 100,
    "min": 0,
    "name": "battery",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(34, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "textc25338a934",
    "max": 200,
    "min": 0,
    "name": "headlight",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(35, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text11372a4f66",
    "max": 50,
    "min": 0,
    "name": "ground_clearance",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(36, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text4ab7c8f8bb",
    "max": 50,
    "min": 0,
    "name": "seat_height",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1020517649")

  // remove field
  collection.fields.removeById("text9c1ab12102")

  // remove field
  collection.fields.removeById("select86541eeefa")

  // remove field
  collection.fields.removeById("numbercd48b2669d")

  // remove field
  collection.fields.removeById("bool64102088ba")

  // remove field
  collection.fields.removeById("text3c4bbde670")

  // remove field
  collection.fields.removeById("textdf597ace31")

  // remove field
  collection.fields.removeById("text11d0bc93d8")

  // remove field
  collection.fields.removeById("text42e100ce81")

  // remove field
  collection.fields.removeById("textb0d08aff3d")

  // remove field
  collection.fields.removeById("text98da2c092a")

  // remove field
  collection.fields.removeById("texte75c43cff1")

  // remove field
  collection.fields.removeById("textbceb22d390")

  // remove field
  collection.fields.removeById("text511e422037")

  // remove field
  collection.fields.removeById("texte45108fe84")

  // remove field
  collection.fields.removeById("text14fae5f7e7")

  // remove field
  collection.fields.removeById("text7e40be1d4f")

  // remove field
  collection.fields.removeById("text852798317f")

  // remove field
  collection.fields.removeById("text82e45e7e59")

  // remove field
  collection.fields.removeById("textc25338a934")

  // remove field
  collection.fields.removeById("text11372a4f66")

  // remove field
  collection.fields.removeById("text4ab7c8f8bb")

  return app.save(collection)
})
