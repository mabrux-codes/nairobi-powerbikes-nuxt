#!/usr/bin/env python3
import urllib.request, urllib.error, json, sys, os, time

PB_URL = os.environ.get("PB_URL", "http://127.0.0.1:8090")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "abelmabruke@gmail.com")
ADMIN_PASS = os.environ.get("ADMIN_PASS", "Brooks9383")

def api(method, path, data=None, token=None):
    url = f"{PB_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token: headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        err = e.read().decode()[:300]
        print(f"  FAIL {method} {path}: {e.code} {err}")
        raise

# Auth
print("Authenticating...")
try:
    auth = api("POST", "/api/collections/_superusers/auth-with-password",
               {"identity": ADMIN_EMAIL, "password": ADMIN_PASS})
    token = auth["token"]
    print("OK")
except Exception:
    print("First-time setup: creating superuser via env vars not supported via API.")
    print("Superuser was created earlier via CLI. Retrying auth...")
    time.sleep(1)
    auth = api("POST", "/api/collections/_superusers/auth-with-password",
               {"identity": ADMIN_EMAIL, "password": ADMIN_PASS})
    token = auth["token"]
    print("OK")

def field_id(prefix, n):
    """Generate a pseudo-random field ID."""
    import hashlib
    h = hashlib.md5(f"{prefix}{n}".encode()).hexdigest()[:10]
    return f"{prefix}{h}"

def text_f(name, **kw):
    f = {"id": field_id("text", name), "name": name, "type": "text"}
    if "required" in kw: f["required"] = kw.pop("required")
    if "unique" in kw: f["unique"] = kw.pop("unique")
    opts = {}
    if "max" in kw: opts["max"] = kw.pop("max")
    if "min" in kw: opts["min"] = kw.pop("min")
    if "pattern" in kw: opts["pattern"] = kw.pop("pattern")
    if opts: f.update(opts)
    return f

def number_f(name, **kw):
    f = {"id": field_id("number", name), "name": name, "type": "number"}
    opts = {}
    if "min" in kw: opts["min"] = kw.pop("min")
    if "max" in kw: opts["max"] = kw.pop("max")
    if "noDecimal" in kw: opts["noDecimal"] = kw.pop("noDecimal")
    if opts: f.update(opts)
    return f

def bool_f(name, **kw):
    return {"id": field_id("bool", name), "name": name, "type": "bool", **kw}

def email_f(name, **kw):
    f = {"id": field_id("email", name), "name": name, "type": "email"}
    if "required" in kw: f["required"] = kw.pop("required")
    if "unique" in kw: f["unique"] = kw.pop("unique")
    return f

def url_f(name, **kw):
    f = {"id": field_id("url", name), "name": name, "type": "url"}
    return f

def select_f(name, values, **kw):
    f = {"id": field_id("select", name), "name": name, "type": "select", "values": values}
    if "maxSelect" in kw: f["maxSelect"] = kw.pop("maxSelect")
    if "required" in kw: f["required"] = kw.pop("required")
    return f

def file_f(name, **kw):
    f = {"id": field_id("file", name), "name": name, "type": "file"}
    if "maxSelect" in kw: f["maxSelect"] = kw.pop("maxSelect")
    if "maxSize" in kw: f["maxSize"] = kw.pop("maxSize")
    if "required" in kw: f["required"] = kw.pop("required")
    if "mimeTypes" in kw: f["mimeTypes"] = kw.pop("mimeTypes")
    return f

def rel_f(name, collection_id, **kw):
    f = {"id": field_id("relation", name), "name": name, "type": "relation", "collectionId": collection_id}
    if "maxSelect" in kw: f["maxSelect"] = kw.pop("maxSelect")
    if "cascadeDelete" in kw: f["cascadeDelete"] = kw.pop("cascadeDelete")
    if "required" in kw: f["required"] = kw.pop("required")
    return f

def make_base(name, fields, list_rule, create_rule, update_rule, delete_rule):
    return {
        "name": name, "type": "base", "fields": fields,
        "listRule": list_rule, "viewRule": "",
        "createRule": create_rule, "updateRule": update_rule, "deleteRule": delete_rule,
    }

def cc(schema):
    return api("POST", "/api/collections", schema, token)

R_A = "@request.auth.role = 'admin'"
R_PUB = ""
R_PUB_BLOG = "@request.auth.role = 'admin' || published = true"
R_OWN = "@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)"
R_OWN_UPD = "@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)"
R_OWN_MSG = "@request.auth.role = 'admin' || (@request.auth.role = 'customer' && (@request.auth.id = from_user || @request.auth.id = to_user))"
R_OWN_MSG_UPD = "@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = to_user)"
R_OWN_FAV = "@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)"
R_SELF = "@request.auth.id = @request.auth.id"

print("\n=== Step 1: Base collections (no relations) ===")

def cr(name, fields, *rules):
    r = cc(make_base(name, fields, *rules))
    print(f"  {name} = {r['id']}")
    return r

brands = cr("brands", [
    text_f("name", required=True, max=200), text_f("slug", max=200, unique=True),
    text_f("country", max=200), text_f("description", max=5000),
    file_f("logo"), number_f("sort_order"),
], R_PUB, R_A, R_A, R_A)

cats = cr("categories", [
    text_f("name", required=True, max=200), text_f("slug", max=200, unique=True),
    text_f("description", max=2000),
], R_PUB, R_A, R_A, R_A)

acc = cr("accessories", [
    text_f("name", required=True, max=200), text_f("slug", max=200, unique=True),
    text_f("category", max=200), number_f("price"), text_f("description", max=5000),
    file_f("image"), bool_f("in_stock"), number_f("sort_order"),
], R_PUB, R_A, R_A, R_A)

apparel = cr("apparel", [
    text_f("name", required=True, max=200), text_f("slug", max=200, unique=True),
    text_f("type", max=200), select_f("size", ["XS","S","M","L","XL","XXL"]),
    number_f("price"), text_f("color", max=100), text_f("description", max=5000),
    file_f("image"), bool_f("in_stock"), number_f("sort_order"),
], R_PUB, R_A, R_A, R_A)

branches = cr("branches", [
    text_f("name", required=True, max=200), text_f("slug", max=200, unique=True),
    text_f("address", max=500), text_f("phone", max=50), email_f("email"),
    text_f("hours", max=500), url_f("map_url"), file_f("image"), number_f("sort_order"),
], R_PUB, R_A, R_A, R_A)

team = cr("team_members", [
    text_f("name", required=True, max=200), text_f("role", max=200),
    text_f("bio", max=5000), file_f("photo"), number_f("sort_order"),
], R_PUB, R_A, R_A, R_A)

milestones = cr("timeline_milestones", [
    text_f("title", required=True, max=200), text_f("year", max=50),
    text_f("description", max=5000), number_f("display_order"),
], R_PUB, R_A, R_A, R_A)

testimonials = cr("testimonials", [
    text_f("name", required=True, max=200), text_f("role", max=200),
    text_f("content", required=True, max=5000), number_f("rating", min=1, max=5),
    file_f("photo"), number_f("display_order"),
], R_PUB, R_A, R_A, R_A)

faqs = cr("faqs", [
    text_f("question", required=True, max=500), text_f("answer", required=True, max=10000),
    text_f("category", max=200), number_f("display_order"),
], R_PUB, R_A, R_A, R_A)

offers = cr("offers", [
    text_f("title", required=True, max=200), text_f("description", max=5000),
    number_f("discount_percent", min=0, max=100), text_f("valid_from", max=50),
    text_f("valid_until", max=50), file_f("image"), bool_f("active"), number_f("sort_order"),
], R_PUB, R_A, R_A, R_A)

blog = cr("blog_posts", [
    text_f("title", required=True, max=300), text_f("slug", max=300, unique=True),
    text_f("content", max=100000), text_f("excerpt", max=1000), text_f("author", max=200),
    file_f("image", maxSize=5242880), text_f("tags", max=500), bool_f("published"),
    text_f("published_at", max=50),
], R_PUB_BLOG, R_A, R_A, R_A)

gallery = cr("gallery", [
    text_f("title", max=200), text_f("description", max=1000),
    file_f("image", required=True, maxSize=10485760), text_f("category", max=200),
    number_f("sort_order"),
], R_PUB, R_A, R_A, R_A)

contacts = cr("contacts", [
    text_f("name", required=True, max=200), email_f("email", required=True),
    text_f("phone", max=50), text_f("subject", max=300),
    select_f("category", ["general","sales","service","parts","finance","other"]),
    text_f("message", required=True, max=10000),
    select_f("status", ["new","contacted","resolved"]), text_f("assigned_to", max=200),
], R_A, "", R_A, R_A)

subs = cr("subscribers", [
    email_f("email", required=True, unique=True), text_f("name", max=200), bool_f("active"),
], R_A, "", R_A, R_A)

ws = cr("website_settings", [
    text_f("key", required=True, max=200, unique=True), text_f("value", max=50000),
    text_f("group", max=200), select_f("type", ["text","textarea","image","bool","number"]),
], R_A, R_A, R_A, R_A)

et = cr("email_templates", [
    text_f("name", required=True, max=200, unique=True), text_f("subject", required=True, max=500),
    text_f("body", required=True, max=100000), text_f("variables", max=2000), bool_f("active"),
], R_A, R_A, R_A, R_A)

media = cr("media", [
    text_f("filename", required=True, max=300), file_f("file", required=True, maxSize=10485760),
    text_f("alt", max=300), select_f("type", ["image","document","video","other"]),
    rel_f("uploaded_by", "_pb_users_auth_"),
], R_A, R_A, R_A, R_A)

audit = cr("audit_logs", [
    rel_f("user", "_pb_users_auth_"), text_f("action", required=True, max=200),
    text_f("resource", max=200), text_f("resource_id", max=200),
    text_f("details", max=10000), text_f("ip", max=50),
], R_A, R_A, R_A, R_A)

sys_st = cr("system_settings", [
    text_f("key", required=True, max=200, unique=True), text_f("value", max=50000),
    select_f("type", ["text","number","bool","json"]),
], R_A, R_A, R_A, R_A)

print("\n=== Step 2: Collections with relations ===")

moto = cr("motorcycles", [
    text_f("name", required=True, max=300), text_f("slug", max=300, unique=True),
    rel_f("brand", brands["id"]), rel_f("category", cats["id"]),
    number_f("year", min=1900, max=2100), number_f("price"),
    select_f("status", ["available","sold","coming_soon"]),
    text_f("description", max=10000), text_f("engine", max=200), text_f("horsepower", max=200),
    file_f("images", maxSelect=10, maxSize=5242880), bool_f("featured"), bool_f("new_arrival"),
    number_f("offer_price"), number_f("sort_order"),
], R_PUB, R_A, R_A, R_A)

bookings = cr("bookings", [
    rel_f("user", "_pb_users_auth_"),
    select_f("type", ["test_ride","service"], required=True),
    text_f("motorcycle", max=300), rel_f("motorcycle_id", moto["id"]),
    text_f("service_type", max=200), text_f("branch", max=200),
    text_f("preferred_date", max=100), text_f("preferred_time", max=50),
    select_f("status", ["pending","confirmed","in_progress","completed","cancelled"]),
    text_f("notes", max=5000), text_f("assigned_to", max=200),
], R_OWN, "", R_OWN_UPD, R_A)

sr = cr("service_requests", [
    rel_f("user", "_pb_users_auth_"), text_f("motorcycle", max=300),
    text_f("service_type", max=200), text_f("description", max=5000),
    text_f("preferred_date", max=100),
    select_f("status", ["pending","diagnosed","in_progress","completed","cancelled"]),
    number_f("cost"), text_f("notes", max=5000), text_f("assigned_to", max=200),
], R_OWN, "", R_OWN_UPD, R_A)

notif = cr("notifications", [
    rel_f("user", "_pb_users_auth_", cascadeDelete=True),
    text_f("title", required=True, max=300), text_f("message", max=5000),
    select_f("type", ["booking","service","offer","system","message"]),
    text_f("link", max=500), bool_f("read"),
], R_OWN, R_A, R_OWN_UPD, R_A)

msgs = cr("messages", [
    rel_f("from_user", "_pb_users_auth_"), rel_f("to_user", "_pb_users_auth_"),
    text_f("subject", max=300), text_f("message", required=True, max=10000), bool_f("read"),
], R_OWN_MSG, R_A, R_OWN_MSG_UPD, R_A)

favs = cr("favorites", [
    rel_f("user", "_pb_users_auth_", cascadeDelete=True),
    rel_f("motorcycle", moto["id"]),
], R_OWN_FAV, R_OWN_FAV, R_OWN_FAV, R_OWN_FAV)

print("\n=== Step 3: Update users collection ===")
users_id = "_pb_users_auth_"

existing = api("GET", f"/api/collections/{users_id}", token=token)
field_map = {f["name"]: f for f in existing["fields"]}

# Preserve existing fields, add new fields
new_fields = []
for name in ["id","password","tokenKey","email","emailVisibility","verified","name","avatar","created","updated"]:
    if name in field_map:
        new_fields.append(field_map[name])
    # skip if not found (system fields should exist)

# Add custom fields
custom_fields = [
    {"name": "phone", "type": "text", "max": 50},
    {"name": "role", "type": "select", "required": True, "values": ["customer", "admin"], "maxSelect": 1},
    {"name": "availability", "type": "select", "values": ["online", "busy", "offline"], "maxSelect": 1},
    {"name": "email_notifications", "type": "bool"},
    {"name": "sms_notifications", "type": "bool"},
]
for cf in custom_fields:
    if cf["name"] in field_map:
        new_fields.append(field_map[cf["name"]])
    else:
        new_fields.append(cf)

api("PATCH", f"/api/collections/{users_id}", {
    "fields": new_fields,
    "listRule": R_SELF,
    "viewRule": R_SELF,
    "createRule": "",
    "updateRule": f"@request.auth.id = @request.auth.id || @request.auth.role = 'admin'",
    "deleteRule": R_A,
}, token)
print("  users updated with role field")

print("\n=== DONE ===")
