#!/usr/bin/env python3
"""Fix all critical audit issues in PB collections."""
import urllib.request, urllib.error, json, sys, os, time, hashlib

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
        err = e.read().decode()[:500]
        print(f"  FAIL {method} {path}: {e.code} {err}")
        raise

def field_id(prefix, name):
    h = hashlib.md5(f"{prefix}{name}".encode()).hexdigest()[:10]
    return f"{prefix}{h}"

print("Authenticating...")
auth = api("POST", "/api/collections/_superusers/auth-with-password",
           {"identity": ADMIN_EMAIL, "password": ADMIN_PASS})
token = auth["token"]
print("OK")

def coll(name):
    return api("GET", f"/api/collections/{name}", token=token)

def update_coll(name, data):
    return api("PATCH", f"/api/collections/{name}", data, token)

# ============================================================
# 1. FIX company_stats - add label, value, suffix, sort_order
# ============================================================
print("\n=== Fixing company_stats ===")
cs = coll("company_stats")
cs_fields = {f["name"]: f for f in cs["fields"]}
cs_new = [cs_fields[f] for f in ["id","created","updated"] if f in cs_fields]
cs_to_add = [
    {"id": field_id("text", "label"), "name": "label", "type": "text", "max": 200, "required": True},
    {"id": field_id("number", "value"), "name": "value", "type": "number"},
    {"id": field_id("text", "suffix"), "name": "suffix", "type": "text", "max": 50},
    {"id": field_id("number", "sort_order"), "name": "sort_order", "type": "number"},
]
for f in cs_to_add:
    if f["name"] not in cs_fields:
        cs_new.append(f)
        print(f"  + Added field: {f['name']}")
    else:
        cs_new.append(cs_fields[f["name"]])
        print(f"  ~ Field exists: {f['name']}")
update_coll("company_stats", {"fields": cs_new})
print("  company_stats updated OK")

# Seed initial stats
try:
    api("POST", "/api/collections/company_stats/records", {"label": "Bikes Sold", "value": 5000, "suffix": "+", "sort_order": 1}, token)
    api("POST", "/api/collections/company_stats/records", {"label": "Happy Customers", "value": 15000, "suffix": "+", "sort_order": 2}, token)
    api("POST", "/api/collections/company_stats/records", {"label": "Brands", "value": 12, "suffix": "", "sort_order": 3}, token)
    api("POST", "/api/collections/company_stats/records", {"label": "Satisfaction", "value": 98, "suffix": "%", "sort_order": 4}, token)
    print("  Seeded company_stats data")
except Exception as e:
    print(f"  Seed skip (may already exist): {e}")

# ============================================================
# 2. FIX services - add name, description, icon, sort_order
# ============================================================
print("\n=== Fixing services ===")
sv = coll("services")
sv_fields = {f["name"]: f for f in sv["fields"]}
sv_new = [sv_fields[f] for f in ["id","created","updated"] if f in sv_fields]
sv_to_add = [
    {"id": field_id("text", "name"), "name": "name", "type": "text", "max": 200, "required": True},
    {"id": field_id("text", "description"), "name": "description", "type": "text", "max": 5000},
    {"id": field_id("text", "icon"), "name": "icon", "type": "text", "max": 100},
    {"id": field_id("number", "sort_order"), "name": "sort_order", "type": "number"},
]
for f in sv_to_add:
    if f["name"] not in sv_fields:
        sv_new.append(f)
        print(f"  + Added field: {f['name']}")
    else:
        sv_new.append(sv_fields[f["name"]])
        print(f"  ~ Field exists: {f['name']}")
update_coll("services", {"fields": sv_new})
print("  services updated OK")

# Delete existing seed records (from migrate-schema.py) and re-seed properly
try:
    existing = api("GET", "/api/collections/services/records", token=token)
    for item in existing.get("items", []):
        api("DELETE", f"/api/collections/services/records/{item['id']}", token=token)
    print("  Cleared old services records")
except:
    pass

sv_data = [
    {"name": "Oil Change", "description": "Full engine oil and filter replacement using premium grade oils.", "icon": "Droplets", "sort_order": 1},
    {"name": "Brake Service", "description": "Brake pad replacement, rotor inspection, and fluid flush.", "icon": "CircleSlash2", "sort_order": 2},
    {"name": "Chain & Sprocket", "description": "Chain adjustment, lubrication, and sprocket replacement.", "icon": "Link2", "sort_order": 3},
    {"name": "Tire Replacement", "description": "New tire fitting, balancing, and pressure check.", "icon": "CircleDot", "sort_order": 4},
    {"name": "Full Service", "description": "Comprehensive 50-point inspection and service.", "icon": "Wrench", "sort_order": 5},
    {"name": "Engine Diagnostics", "description": "Computer diagnostic scan and troubleshooting.", "icon": "Zap", "sort_order": 6},
    {"name": "Electrical Repair", "description": "Battery, wiring, lighting, and electrical system repairs.", "icon": "Bolt", "sort_order": 7},
    {"name": "Customization", "description": "Custom parts fitting, painting, and performance upgrades.", "icon": "Paintbrush", "sort_order": 8},
]
for sd in sv_data:
    api("POST", "/api/collections/services/records", sd, token)
    print(f"  Service: {sd['name']}")

# ============================================================
# 3. CREATE service_types collection
# ============================================================
print("\n=== Creating service_types ===")
st_payload = {
    "name": "service_types",
    "type": "base",
    "fields": [
        {"id": field_id("text", "name"), "name": "name", "type": "text", "max": 200, "required": True},
        {"id": field_id("number", "price"), "name": "price", "type": "number"},
        {"id": field_id("text", "description"), "name": "description", "type": "text", "max": 5000},
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": "@request.auth.role = 'admin'",
    "updateRule": "@request.auth.role = 'admin'",
    "deleteRule": "@request.auth.role = 'admin'",
}
try:
    result = api("POST", "/api/collections", st_payload, token)
    print(f"  Created service_types (id={result['id']})")
except Exception as e:
    print(f"  SKIP (may already exist): {e}")

# Seed service_types
st_data = [
    {"name": "Oil Change", "price": 2500, "description": "Full engine oil and filter replacement."},
    {"name": "Brake Service", "price": 3500, "description": "Brake pad replacement and fluid flush."},
    {"name": "Tire Replacement", "price": 1500, "description": "New tire fitting and balancing."},
    {"name": "Full Service", "price": 8000, "description": "Comprehensive 50-point inspection."},
    {"name": "Engine Tune-Up", "price": 5000, "description": "Engine diagnostics and tune-up."},
    {"name": "Electrical Repair", "price": 3000, "description": "Battery, wiring, and electrical repairs."},
    {"name": "Custom Modification", "price": 10000, "description": "Custom parts fitting and upgrades."},
]
for sd in st_data:
    try:
        api("POST", "/api/collections/service_types/records", sd, token)
        print(f"  Service type: {sd['name']}")
    except Exception as e:
        print(f"  SKIP {sd['name']}: {e}")

# ============================================================
# 4. FIX collection permissions
# ============================================================
print("\n=== Fixing permissions ===")

# service_types: public should be able to list (for booking form)
try:
    st = coll("service_types")
    update_coll("service_types", {"listRule": "", "viewRule": ""})
    print("  service_types: public list/view enabled")
except:
    pass

# services: public list
try:
    sv = coll("services")
    update_coll("services", {"listRule": "", "viewRule": ""})
    print("  services: public list/view enabled")
except:
    pass

# company_stats: public list
try:
    update_coll("company_stats", {"listRule": "", "viewRule": ""})
    print("  company_stats: public list/view enabled")
except:
    pass

print("\n=== DONE ===")
