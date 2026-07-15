#!/usr/bin/env python3
"""Add missing fields to PB collections and seed demo data."""
import urllib.request, urllib.error, json, sys, os, time, hashlib

PB_URL = os.environ.get("PB_URL", "http://127.0.0.1:8090")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "abelmabruke@gmail.com")
ADMIN_PASS = os.environ.get("ADMIN_PASS", "Brooks9383")

def api(method, path, data=None, token=None, raw=False):
    url = f"{PB_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token: headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            if raw: return resp.read().decode()
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        err = e.read().decode()[:500]
        print(f"  FAIL {method} {path}: {e.code} {err}")
        raise

def field_id(prefix, name):
    h = hashlib.md5(f"{prefix}{name}".encode()).hexdigest()[:10]
    return f"{prefix}{h}"

print("Authenticating...")
try:
    auth = api("POST", "/api/collections/_superusers/auth-with-password",
               {"identity": ADMIN_EMAIL, "password": ADMIN_PASS})
    token = auth["token"]
    print("OK")
except Exception as e:
    print(f"Auth failed: {e}")
    sys.exit(1)

# Get all collections
all_colls = api("GET", "/api/collections", token=token)
coll_map = {c["name"]: c for c in all_colls["items"]}
print(f"\nFound {len(coll_map)} collections")

# ============================================================
# 1. ADD MISSING FIELDS TO MOTORCYCLES
# ============================================================
print("\n=== Updating motorcycles collection ===")
moto = coll_map["motorcycles"]
existing = {f["name"]: f for f in moto["fields"]}

new_moto_fields = []

# Preserve existing system + custom fields
for name in ["id", "created", "updated", "name", "slug", "brand", "category",
             "year", "price", "status", "description", "engine", "horsepower",
             "images", "featured", "new_arrival", "offer_price", "sort_order"]:
    if name in existing:
        new_moto_fields.append(existing[name])

# Add missing spec fields
missing_specs = [
    {"name": "engine_cc", "type": "text", "max": 50},
    {"name": "type", "type": "select", "values": ["Sport","Cruiser","Touring","Adventure","Naked","Dirt","Scooter","Electric"], "maxSelect": 1},
    {"name": "sale_price", "type": "number"},
    {"name": "in_stock", "type": "bool"},
    {"name": "torque", "type": "text", "max": 100},
    {"name": "transmission", "type": "text", "max": 100},
    {"name": "fuel_capacity", "type": "text", "max": 50},
    {"name": "weight", "type": "text", "max": 50},
    {"name": "top_speed", "type": "text", "max": 50},
    {"name": "braking", "type": "text", "max": 200},
    {"name": "suspension", "type": "text", "max": 200},
    {"name": "colors", "type": "text", "max": 500},
    {"name": "warranty", "type": "text", "max": 200},
    {"name": "fuel_system", "type": "text", "max": 200},
    {"name": "cooling", "type": "text", "max": 200},
    {"name": "starter", "type": "text", "max": 100},
    {"name": "ignition", "type": "text", "max": 200},
    {"name": "battery", "type": "text", "max": 100},
    {"name": "headlight", "type": "text", "max": 200},
    {"name": "ground_clearance", "type": "text", "max": 50},
    {"name": "seat_height", "type": "text", "max": 50},
]

for spec in missing_specs:
    if spec["name"] not in existing:
        f = {"id": field_id(spec["type"], spec["name"]), "name": spec["name"], "type": spec["type"]}
        if spec["type"] == "select":
            f["values"] = spec["values"]
            f["maxSelect"] = spec.get("maxSelect", 1)
        if "max" in spec:
            f["max"] = spec["max"]
        new_moto_fields.append(f)
        print(f"  + Added field: {spec['name']}")
    else:
        print(f"  ~ Field exists: {spec['name']}")

api("PATCH", f"/api/collections/{moto['id']}", {"fields": new_moto_fields}, token)
print("  motorcycles updated OK")

# ============================================================
# 2. ADD TAGLINE TO BRANDS
# ============================================================
print("\n=== Updating brands collection ===")
brands = coll_map["brands"]
existing_b = {f["name"]: f for f in brands["fields"]}

if "tagline" not in existing_b:
    new_b_fields = []
    for name in ["id","created","updated","name","slug","country","description","logo","sort_order"]:
        if name in existing_b:
            new_b_fields.append(existing_b[name])
    new_b_fields.append({
        "id": field_id("text", "tagline"),
        "name": "tagline", "type": "text", "max": 300
    })
    api("PATCH", f"/api/collections/{brands['id']}", {"fields": new_b_fields}, token)
    print("  + Added field: tagline")
else:
    print("  ~ Field exists: tagline")

# ============================================================
# 3. FIX ABOUT PAGE — reference correct collection names
# ============================================================
print("\n=== About page references fixed in schema ===")
# about.vue references 'milestones' — the actual collection is 'timeline_milestones'
# about.vue references 'company_stats' — doesn't exist, we'll use website_settings instead
print("  (will fix about.vue in code)")

# ============================================================
# 4. SEED DEMO DATA
# ============================================================
print("\n=== Seeding demo data ===")

def create(collection, data):
    try:
        return api("POST", f"/api/collections/{collection}/records", data, token)
    except Exception as e:
        print(f"  SKIP {data.get('name','')}: {e}")
        return None

def upload_file(collection, record_id, field_name, url):
    """Download a file from URL and upload to PB record."""
    try:
        img_data = urllib.request.urlopen(url, timeout=10).read()
        boundary = "----Boundary7MA4YWxkTrZu0gW"
        body = []
        body.append(f"--{boundary}")
        body.append(f'Content-Disposition: form-data; name="{field_name}"; filename="{os.path.basename(url)}"')
        body.append("Content-Type: image/jpeg")
        body.append("")
        body.append(img_data)
        body.append(f"--{boundary}--")
        body.append("")
        payload = "\r\n".join(body)
        req = urllib.request.Request(
            f"{PB_URL}/api/collections/{collection}/records/{record_id}",
            data=payload.encode() if isinstance(payload, str) else payload,
            headers={"Authorization": f"Bearer {token}", "Content-Type": f"multipart/form-data; boundary={boundary}"},
            method="PATCH"
        )
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode())
    except Exception as e:
        print(f"  Upload fail for {record_id}: {e}")
        return None

# Brands
brand_data = [
    {"name": "Kawasaki", "slug": "kawasaki", "country": "Japan", "tagline": "Let the Good Times Roll", "description": "Kawasaki is a Japanese multinational corporation known for its high-performance motorcycles. From the iconic Ninja series to the versatile Versys lineup, Kawasaki offers bikes for every rider.", "sort_order": 1},
    {"name": "Honda", "slug": "honda", "country": "Japan", "tagline": "The Power of Dreams", "description": "Honda Motor Co. is the world's largest motorcycle manufacturer. Known for reliability, innovation, and engineering excellence across every segment.", "sort_order": 2},
    {"name": "Yamaha", "slug": "yamaha", "country": "Japan", "tagline": "Revs Your Heart", "description": "Yamaha Motor Co. produces a wide range of motorcycles from sport and touring to dirt and cruiser. Known for cutting-edge design and performance.", "sort_order": 3},
    {"name": "Suzuki", "slug": "suzuki", "country": "Japan", "tagline": "Way of Life!", "description": "Suzuki Motor Corporation has been producing motorcycles since 1952. Known for the GSX-R series and versatile V-Strom adventure bikes.", "sort_order": 4},
    {"name": "BMW", "slug": "bmw", "country": "Germany", "tagline": "Sheer Riding Pleasure", "description": "Bayerische Motoren Werke AG produces premium motorcycles renowned for engineering excellence, innovation, and the iconic Boxer engine.", "sort_order": 5},
    {"name": "Ducati", "slug": "ducati", "country": "Italy", "tagline": "The Soul of Speed", "description": "Ducati Motor Holding S.p.A. is an Italian manufacturer known for high-performance V-twin motorcycles with distinctive Italian styling and racing heritage.", "sort_order": 6},
    {"name": "Tekken", "slug": "tekken", "country": "China", "tagline": "Built to Conquer", "description": "Tekken is a Chinese motorcycle brand known for producing affordable and reliable motorcycles for the African market.", "sort_order": 7},
    {"name": "Taro GP", "slug": "taro-gp", "country": "China", "tagline": "Race-Bred Performance", "description": "Taro GP offers high-performance motorcycles engineered for both track and street riding at accessible prices.", "sort_order": 8},
    {"name": "Voge", "slug": "voge", "country": "China", "tagline": "Ride Beyond Limits", "description": "Voge is a Chinese brand focused on adventure and touring motorcycles, offering bikes built to handle any terrain.", "sort_order": 9},
    {"name": "Loncin", "slug": "loncin", "country": "China", "tagline": "Powering Your Ride", "description": "Loncin is a major Chinese manufacturer of motorcycles and engines, known for reliable and affordable transportation.", "sort_order": 10},
    {"name": "QJ Motor", "slug": "qj-motor", "country": "China", "tagline": "The Future of Motion", "description": "QJ Motor is a Chinese brand backed by Qianjiang Group, one of the largest motorcycle manufacturers in the world.", "sort_order": 11},
]
brand_ids = {}
for bd in brand_data:
    r = create("brands", bd)
    if r: brand_ids[bd["slug"]] = r["id"]; print(f"  Brand: {bd['name']}")

# Motorcycles
moto_data = [
    {"name": "Ninja ZX-6R", "slug": "ninja-zx-6r", "brand": brand_ids.get("kawasaki",""), "year": 2025, "price": 1850000, "status": "available", "description": "The Kawasaki Ninja ZX-6R is a legendary middleweight sport bike that combines track-ready performance with street-legal practicality. Featuring a powerful 636cc inline-four engine with advanced electronics.", "engine": "636cc liquid-cooled inline-4", "engine_cc": "636", "horsepower": "130hp @ 13,500rpm", "torque": "71Nm @ 11,500rpm", "transmission": "6-speed", "fuel_capacity": "17L", "weight": "198kg", "top_speed": "260km/h", "braking": "Dual 310mm semi-floating discs, 4-piston calipers (front); 220mm disc (rear)", "suspension": "41mm SFF-BP fork (front); Bottom-Link Uni-Trak with gas-charged shock (rear)", "colors": "Lime Green, Metallic Spark Black, Pearl Storm Grey", "warranty": "2 years", "type": "Sport", "featured": True, "new_arrival": True, "in_stock": True, "sort_order": 1},
    {"name": "Ninja H2", "slug": "ninja-h2", "brand": brand_ids.get("kawasaki",""), "year": 2025, "price": 4500000, "status": "available", "description": "The Kawasaki Ninja H2 is a supercharged hypersport motorcycle that represents the pinnacle of Kawasaki engineering. With a 998cc supercharged engine producing immense power.", "engine": "998cc supercharged inline-4", "engine_cc": "998", "horsepower": "310hp", "transmission": "6-speed", "fuel_capacity": "17L", "weight": "238kg", "top_speed": "336km/h", "type": "Sport", "featured": True, "in_stock": False, "sort_order": 2},
    {"name": "Z900", "slug": "z900", "brand": brand_ids.get("kawasaki",""), "year": 2024, "price": 1450000, "status": "available", "description": "The Kawasaki Z900 is a powerful naked bike that delivers thrilling performance with a aggressive Sugomi-inspired design.", "engine": "948cc liquid-cooled inline-4", "engine_cc": "948", "horsepower": "125hp", "transmission": "6-speed", "fuel_capacity": "17L", "weight": "210kg", "top_speed": "240km/h", "type": "Naked", "featured": True, "in_stock": True, "sort_order": 3},
    {"name": "Versys 650", "slug": "versys-650", "brand": brand_ids.get("kawasaki",""), "year": 2024, "price": 950000, "status": "available", "description": "The Versys 650 is a versatile adventure tourer that's equally at home on city streets and winding mountain roads.", "engine": "649cc liquid-cooled parallel-twin", "engine_cc": "649", "horsepower": "69hp", "transmission": "6-speed", "fuel_capacity": "21L", "weight": "216kg", "top_speed": "190km/h", "type": "Adventure", "in_stock": True, "sort_order": 4},
    {"name": "CBR650R", "slug": "cbr650r", "brand": brand_ids.get("honda",""), "year": 2025, "price": 1250000, "status": "available", "description": "The Honda CBR650R is a middleweight sport bike that combines exhilarating performance with everyday usability.", "engine": "649cc liquid-cooled inline-4", "engine_cc": "649", "horsepower": "95hp", "transmission": "6-speed", "fuel_capacity": "15.4L", "weight": "208kg", "top_speed": "235km/h", "type": "Sport", "featured": True, "new_arrival": True, "in_stock": True, "sort_order": 5},
    {"name": "CB500X", "slug": "cb500x", "brand": brand_ids.get("honda",""), "year": 2024, "price": 750000, "status": "available", "description": "The CB500X is a lightweight adventure bike perfect for beginners and experienced riders alike.", "engine": "471cc liquid-cooled parallel-twin", "engine_cc": "471", "horsepower": "47hp", "transmission": "6-speed", "fuel_capacity": "17.5L", "weight": "197kg", "top_speed": "175km/h", "type": "Adventure", "in_stock": True, "sort_order": 6},
    {"name": "Africa Twin", "slug": "africa-twin", "brand": brand_ids.get("honda",""), "year": 2025, "price": 2500000, "status": "available", "description": "The Honda Africa Twin is the ultimate adventure motorcycle, built to conquer any terrain.", "engine": "1084cc liquid-cooled parallel-twin", "engine_cc": "1084", "horsepower": "100hp", "transmission": "6-speed DCT", "fuel_capacity": "24.8L", "weight": "240kg", "top_speed": "200km/h", "type": "Adventure", "featured": True, "new_arrival": True, "in_stock": False, "sort_order": 7},
    {"name": "MT-07", "slug": "mt-07", "brand": brand_ids.get("yamaha",""), "year": 2024, "price": 950000, "status": "available", "description": "The Yamaha MT-07 is a legendary naked bike known for its incredible torque and agile handling.", "engine": "689cc liquid-cooled parallel-twin", "engine_cc": "689", "horsepower": "74hp", "torque": "68Nm", "transmission": "6-speed", "fuel_capacity": "14L", "weight": "184kg", "top_speed": "210km/h", "type": "Naked", "featured": True, "in_stock": True, "sort_order": 8},
    {"name": "MT-09", "slug": "mt-09", "brand": brand_ids.get("yamaha",""), "year": 2025, "price": 1450000, "status": "available", "description": "The MT-09 delivers class-leading performance with its torquey CP3 engine and advanced electronics.", "engine": "890cc liquid-cooled inline-3", "engine_cc": "890", "horsepower": "119hp", "transmission": "6-speed", "fuel_capacity": "14L", "weight": "193kg", "top_speed": "240km/h", "type": "Naked", "featured": True, "new_arrival": True, "in_stock": True, "sort_order": 9},
    {"name": "R1", "slug": "r1", "brand": brand_ids.get("yamaha",""), "year": 2025, "price": 2800000, "status": "coming_soon", "description": "The Yamaha R1 is a race-bred superbike with crossplane crankshaft technology.", "engine": "998cc liquid-cooled inline-4", "engine_cc": "998", "horsepower": "200hp", "transmission": "6-speed", "fuel_capacity": "17L", "weight": "201kg", "top_speed": "299km/h", "type": "Sport", "new_arrival": True, "in_stock": False, "sort_order": 10},
    {"name": "GSX-R750", "slug": "gsxr750", "brand": brand_ids.get("suzuki",""), "year": 2024, "price": 1650000, "status": "available", "description": "The Suzuki GSX-R750 is a legendary supersport bike that has dominated tracks worldwide.", "engine": "750cc liquid-cooled inline-4", "engine_cc": "750", "horsepower": "150hp", "transmission": "6-speed", "fuel_capacity": "17L", "weight": "190kg", "top_speed": "275km/h", "type": "Sport", "featured": True, "in_stock": True, "sort_order": 11},
    {"name": "V-Strom 650", "slug": "v-strom-650", "brand": brand_ids.get("suzuki",""), "year": 2024, "price": 950000, "status": "available", "description": "The V-Strom 650 is a versatile adventure tourer trusted by riders worldwide.", "engine": "645cc liquid-cooled V-twin", "engine_cc": "645", "horsepower": "70hp", "transmission": "6-speed", "fuel_capacity": "20L", "weight": "214kg", "top_speed": "190km/h", "type": "Adventure", "in_stock": True, "sort_order": 12},
    {"name": "S 1000 RR", "slug": "s1000rr", "brand": brand_ids.get("bmw",""), "year": 2025, "price": 3200000, "status": "available", "description": "The BMW S 1000 RR is a superbike that sets the benchmark for performance and technology.", "engine": "999cc liquid-cooled inline-4", "engine_cc": "999", "horsepower": "205hp", "transmission": "6-speed", "fuel_capacity": "16.5L", "weight": "197kg", "top_speed": "303km/h", "type": "Sport", "featured": True, "new_arrival": True, "in_stock": False, "sort_order": 13},
    {"name": "R 1250 GS", "slug": "r1250gs", "brand": brand_ids.get("bmw",""), "year": 2024, "price": 3500000, "status": "available", "description": "The R 1250 GS is the king of adventure touring with the legendary Boxer engine.", "engine": "1254cc air/liquid-cooled Boxer twin", "engine_cc": "1254", "horsepower": "136hp", "transmission": "6-speed", "fuel_capacity": "30L", "weight": "249kg", "top_speed": "220km/h", "type": "Adventure", "featured": True, "in_stock": True, "sort_order": 14},
    {"name": "Panigale V4", "slug": "panigale-v4", "brand": brand_ids.get("ducati",""), "year": 2025, "price": 4500000, "status": "coming_soon", "description": "The Ducati Panigale V4 represents the pinnacle of Italian motorcycle engineering.", "engine": "1103cc liquid-cooled V4", "engine_cc": "1103", "horsepower": "215hp", "transmission": "6-speed", "fuel_capacity": "16L", "weight": "198kg", "top_speed": "310km/h", "type": "Sport", "featured": True, "new_arrival": True, "in_stock": False, "sort_order": 15},
    {"name": "Monster 937", "slug": "monster-937", "brand": brand_ids.get("ducati",""), "year": 2024, "price": 1900000, "status": "available", "description": "The Ducati Monster is the original naked bike, completely reimagined.", "engine": "937cc liquid-cooled V-twin", "engine_cc": "937", "horsepower": "111hp", "transmission": "6-speed", "fuel_capacity": "14L", "weight": "188kg", "top_speed": "230km/h", "type": "Naked", "in_stock": True, "sort_order": 16},
]
for md in moto_data:
    r = create("motorcycles", md)
    if r: print(f"  Moto: {md['name']}")

# Branches
branch_data = [
    {"name": "Nairobi Showroom", "slug": "nairobi-showroom", "address": "Mombasa Road, Nairobi, Kenya", "phone": "+254 700 100 200", "email": "nairobi@nairobi-powerbikes.co.ke", "hours": "Mon-Sat: 8:00 AM - 6:00 PM\nSun: 9:00 AM - 3:00 PM", "map_url": "https://maps.google.com/?q=Nairobi+Mombasa+Road", "sort_order": 1},
    {"name": "Westlands Branch", "slug": "westlands", "address": "Waiyaki Way, Westlands, Nairobi", "phone": "+254 700 100 201", "email": "westlands@nairobi-powerbikes.co.ke", "hours": "Mon-Sat: 8:00 AM - 6:00 PM\nSun: Closed", "sort_order": 2},
    {"name": "Mombasa Branch", "slug": "mombasa", "address": "Nyali Road, Mombasa, Kenya", "phone": "+254 700 100 202", "email": "mombasa@nairobi-powerbikes.co.ke", "hours": "Mon-Sat: 8:00 AM - 5:00 PM\nSun: 9:00 AM - 2:00 PM", "sort_order": 3},
]
for bd in branch_data:
    r = create("branches", bd)
    if r: print(f"  Branch: {bd['name']}")

# Team members
team_data = [
    {"name": "James Mwangi", "role": "General Manager", "bio": "With over 15 years in the motorcycle industry, James leads our team with passion and expertise.", "sort_order": 1},
    {"name": "Sarah Wanjiku", "role": "Sales Director", "bio": "Sarah has helped over 2000 customers find their perfect bike. She knows every model in our inventory inside out.", "sort_order": 2},
    {"name": "Peter Kamau", "role": "Head Mechanic", "bio": "Master technician with specialized training from Kawasaki and Honda. Peter ensures every bike leaving our workshop is perfect.", "sort_order": 3},
    {"name": "Grace Akinyi", "role": "Customer Relations", "bio": "Grace ensures every customer has a seamless experience from browsing to after-sales support.", "sort_order": 4},
    {"name": "David Ochieng", "role": "Finance Manager", "bio": "David makes motorcycle ownership accessible with flexible financing options tailored to your needs.", "sort_order": 5},
    {"name": "Mary Wangari", "role": "Marketing Lead", "bio": "Mary drives our brand presence and community engagement, organizing rides and events.", "sort_order": 6},
]
for td in team_data:
    r = create("team_members", td)
    if r: print(f"  Team: {td['name']}")

# Testimonials
testimonial_data = [
    {"name": "John K.", "role": "Customer", "content": "Best motorcycle dealership in Nairobi! I bought my Kawasaki Ninja from them and the service was exceptional from start to finish.", "rating": 5, "display_order": 1},
    {"name": "Alice M.", "role": "Customer", "content": "The service center is top-notch. They diagnosed and fixed my bike in record time. Highly recommend!", "rating": 5, "display_order": 2},
    {"name": "Kevin N.", "role": "Customer", "content": "I was nervous about financing a bike but the team made it so easy. Competitive rates and friendly staff.", "rating": 4, "display_order": 3},
    {"name": "Diana W.", "role": "Customer", "content": "Great selection of bikes and accessories. The staff really know their stuff and helped me choose the perfect helmet.", "rating": 5, "display_order": 4},
    {"name": "Brian O.", "role": "Customer", "content": "I've been bringing my bike here for servicing for 3 years. Consistent quality work and fair prices.", "rating": 4, "display_order": 5},
]
for t in testimonial_data:
    r = create("testimonials", t)
    if r: print(f"  Testimonial: {t['name']}")

# Timeline milestones
milestone_data = [
    {"title": "Humble Beginnings", "year": "2017", "description": "Nairobi Powerbikes LTD starts as a modest Motorcycle Accessories Dealer in Nairobi.", "display_order": 1},
    {"title": "Brand Partnerships", "year": "2019", "description": "Secured official dealership agreements with leading global motorcycle brands.", "display_order": 2},
    {"title": "Showroom Expansion", "year": "2020", "description": "Expanded to a full-fledged dealership with an expansive showroom in Nairobi.", "display_order": 3},
    {"title": "Service Network", "year": "2021", "description": "Launched our second branch in Westlands with a full-service workshop.", "display_order": 4},
    {"title": "Mombasa Road Hub", "year": "2023", "description": "Opened our third branch, adding dedicated test ride tracks and gear shop.", "display_order": 5},
    {"title": "Digital Transformation", "year": "2025", "description": "Launched our online platform for seamless browsing, booking, and financing.", "display_order": 6},
]
for m in milestone_data:
    r = create("timeline_milestones", m)
    if r: print(f"  Milestone: {m['title']}")

# Categories
cat_data = [
    {"name": "Sport", "slug": "sport", "description": "High-performance sport motorcycles designed for speed and agility."},
    {"name": "Naked", "slug": "naked", "description": "Streetfighters and naked bikes with aggressive styling."},
    {"name": "Adventure", "slug": "adventure", "description": "Adventure touring bikes built for any terrain."},
    {"name": "Cruiser", "slug": "cruiser", "description": "Classic cruiser motorcycles for relaxed riding."},
    {"name": "Touring", "slug": "touring", "description": "Long-distance touring motorcycles with comfort features."},
    {"name": "Dirt", "slug": "dirt", "description": "Off-road and dual-sport motorcycles."},
]
for c in cat_data:
    r = create("categories", c)
    if r: print(f"  Category: {c['name']}")

# Services
services_data = [
    {"name": "Oil Change", "description": "Full engine oil and filter replacement using premium grade oils.", "icon": "Droplets", "sort_order": 1},
    {"name": "Brake Service", "description": "Brake pad replacement, rotor inspection, and fluid flush.", "icon": "CircleSlash2", "sort_order": 2},
    {"name": "Chain & Sprocket", "description": "Chain adjustment, lubrication, and sprocket replacement.", "icon": "Link2", "sort_order": 3},
    {"name": "Tire Replacement", "description": "New tire fitting, balancing, and pressure check.", "icon": "CircleDot", "sort_order": 4},
    {"name": "Full Service", "description": "Comprehensive 50-point inspection and service.", "icon": "Wrench", "sort_order": 5},
    {"name": "Engine Diagnostics", "description": "Computer diagnostic scan and troubleshooting.", "icon": "Zap", "sort_order": 6},
    {"name": "Electrical Repair", "description": "Battery, wiring, lighting, and electrical system repairs.", "icon": "Bolt", "sort_order": 7},
    {"name": "Customization", "description": "Custom parts fitting, painting, and performance upgrades.", "icon": "Paintbrush", "sort_order": 8},
]
# Services collection may not exist - let's just seed it
for sd in services_data:
    try:
        r = create("services", sd)
        if r: print(f"  Service: {sd['name']}")
    except:
        pass

# FAQs
faq_data = [
    {"question": "What payment methods do you accept?", "answer": "We accept M-Pesa, bank transfers, credit/debit cards, and cash payments. We also offer financing options through our partners.", "category": "Sales", "display_order": 1},
    {"question": "Do you offer test rides?", "answer": "Yes! We encourage test rides for all our motorcycles. Simply book through our website or visit any of our branches with a valid driver's license.", "category": "Sales", "display_order": 2},
    {"question": "What is your warranty policy?", "answer": "All new motorcycles come with a minimum 2-year manufacturer warranty. Extended warranty options are available at the time of purchase.", "category": "Service", "display_order": 3},
    {"question": "How often should I service my motorcycle?", "answer": "We recommend servicing every 3,000km or 3 months, whichever comes first. Regular maintenance keeps your bike in optimal condition.", "category": "Service", "display_order": 4},
    {"question": "Do you buy used motorcycles?", "answer": "Yes, we accept trade-ins and buy used motorcycles. Bring your bike to any branch for a free valuation.", "category": "Sales", "display_order": 5},
    {"question": "Can I finance a motorcycle?", "answer": "Absolutely! We offer flexible financing options with competitive rates. Our finance team will help you find a plan that fits your budget.", "category": "Finance", "display_order": 6},
]
for f in faq_data:
    r = create("faqs", f)
    if r: print(f"  FAQ: {f['question'][:40]}...")

# Website settings
ws_data = [
    {"key": "company_name", "value": "Nairobi Powerbikes LTD", "group": "general", "type": "text"},
    {"key": "company_tagline", "value": "Premium Motorcycles, Expert Service, Riding Culture", "group": "general", "type": "text"},
    {"key": "company_email", "value": "info@nairobi-powerbikes.co.ke", "group": "contact", "type": "text"},
    {"key": "company_phone", "value": "+254 700 100 200", "group": "contact", "type": "text"},
    {"key": "company_address", "value": "Mombasa Road, Nairobi, Kenya", "group": "contact", "type": "text"},
    {"key": "social_facebook", "value": "https://facebook.com/nairobi-powerbikes", "group": "social", "type": "text"},
    {"key": "social_instagram", "value": "https://instagram.com/nairobi-powerbikes", "group": "social", "type": "text"},
    {"key": "social_twitter", "value": "https://twitter.com/npbikes", "group": "social", "type": "text"},
    {"key": "social_youtube", "value": "https://youtube.com/@nairobi-powerbikes", "group": "social", "type": "text"},
    {"key": "whatsapp_number", "value": "+254700100200", "group": "contact", "type": "text"},
    {"key": "home_hero_title", "value": "Ride the <span class='text-brand-red'>Future</span>", "group": "homepage", "type": "text"},
    {"key": "home_hero_subtitle", "value": "Premium motorcycles, expert service, and riding culture in Nairobi.", "group": "homepage", "type": "text"},
    {"key": "about_our_story", "value": "Founded in 2017, Nairobi Powerbikes LTD has evolved from a modest Motorcycle Accessories Dealer into one of Kenya's foremost Motorcycle Dealerships.", "group": "about", "type": "textarea"},
]
for w in ws_data:
    r = create("website_settings", w)
    if r: print(f"  Setting: {w['key']}")

# Gallery
gallery_data = [
    {"title": "Showroom Display", "description": "Our main showroom floor with the latest arrivals", "category": "showroom", "sort_order": 1},
    {"title": "Service Center", "description": "State-of-the-art service bay", "category": "service", "sort_order": 2},
    {"title": "Team Photo", "description": "The Nairobi Powerbikes team", "category": "team", "sort_order": 3},
    {"title": "Rider Event", "description": "Monthly community ride event", "category": "events", "sort_order": 4},
]
for g in gallery_data:
    r = create("gallery", g)
    if r: print(f"  Gallery: {g['title']}")

print("\n=== DONE ===")
