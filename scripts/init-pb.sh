#!/bin/bash
set -e

PB_URL="${PB_URL:-http://127.0.0.1:8090}"
ADMIN_EMAIL="${ADMIN_EMAIL:-abelmabruke@gmail.com}"
ADMIN_PASS="${ADMIN_PASS:-Brooks9383}"

TOKEN=$(curl -s -X POST "$PB_URL/api/superusers/auth-with-password" \
  -H "Content-Type: application/json" \
  -d "{\"identity\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASS\"}" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])" 2>/dev/null)

[ -z "$TOKEN" ] && echo "Auth FAILED" && exit 1
echo "Authenticated"

AUTH="Authorization: Bearer $TOKEN"

cc() {
  local result=$(curl -s -w "\n%{http_code}" -X POST "$PB_URL/api/collections" \
    -H "Content-Type: application/json" -H "$AUTH" -d "$1")
  local code=$(echo "$result" | tail -1)
  local body=$(echo "$result" | head -1)
  if [ "$code" = "200" ]; then
    echo "$body" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])"
    return 0
  else
    echo "FAIL($code): $body" >&2
    return 1
  fi
}

echo "=== Step 1: Collections without relations ==="

BRANDS_ID=$(cc '{"name":"brands","type":"base","schema":[{"name":"name","type":"text","required":true,"options":{"max":200}},{"name":"slug","type":"text","unique":true,"options":{"max":200}},{"name":"country","type":"text","options":{"max":200}},{"name":"description","type":"text","options":{"max":5000}},{"name":"logo","type":"file","options":{"maxSelect":1,"maxSize":2097152}},{"name":"sort_order","type":"number"}],"listRule":"","viewRule":"","createRule":"","updateRule":"@request.auth.role = '\''admin'\''","deleteRule":"@request.auth.role = '\''admin'\''"}')
echo "  brands = $BRANDS_ID"

CATS_ID=$(cc '{"name":"categories","type":"base","schema":[{"name":"name","type":"text","required":true,"options":{"max":200}},{"name":"slug","type":"text","unique":true,"options":{"max":200}},{"name":"description","type":"text","options":{"max":2000}}],"listRule":"","viewRule":"","createRule":"","updateRule":"@request.auth.role = '\''admin'\''","deleteRule":"@request.auth.role = '\''admin'\''"}')
echo "  categories = $CATS_ID"

ACCESSORIES_ID=$(cc '{"name":"accessories","type":"base","schema":[{"name":"name","type":"text","required":true,"options":{"max":200}},{"name":"slug","type":"text","unique":true,"options":{"max":200}},{"name":"category","type":"text","options":{"max":200}},{"name":"price","type":"number","options":{"min":0}},{"name":"description","type":"text","options":{"max":5000}},{"name":"image","type":"file","options":{"maxSelect":1,"maxSize":2097152}},{"name":"in_stock","type":"bool"},{"name":"sort_order","type":"number"}],"listRule":"","viewRule":"","createRule":"","updateRule":"@request.auth.role = '\''admin'\''","deleteRule":"@request.auth.role = '\''admin'\''"}')
echo "  accessories = $ACCESSORIES_ID"

APPAREL_ID=$(cc '{"name":"apparel","type":"base","schema":[{"name":"name","type":"text","required":true,"options":{"max":200}},{"name":"slug","type":"text","unique":true,"options":{"max":200}},{"name":"type","type":"text","options":{"max":200}},{"name":"size","type":"select","options":{"values":["XS","S","M","L","XL","XXL","3XL","4XL"],"maxSelect":1}},{"name":"price","type":"number","options":{"min":0}},{"name":"color","type":"text","options":{"max":100}},{"name":"description","type":"text","options":{"max":5000}},{"name":"image","type":"file","options":{"maxSelect":1,"maxSize":2097152}},{"name":"in_stock","type":"bool"},{"name":"sort_order","type":"number"}],"listRule":"","viewRule":"","createRule":"","updateRule":"@request.auth.role = '\''admin'\''","deleteRule":"@request.auth.role = '\''admin'\''"}')
echo "  apparel = $APPAREL_ID"

BRANCHES_ID=$(cc '{"name":"branches","type":"base","schema":[{"name":"name","type":"text","required":true,"options":{"max":200}},{"name":"slug","type":"text","unique":true,"options":{"max":200}},{"name":"address","type":"text","options":{"max":500}},{"name":"phone","type":"text","options":{"max":50}},{"name":"email","type":"email"},{"name":"hours","type":"text","options":{"max":500}},{"name":"map_url","type":"url","options":{"max":1000}},{"name":"image","type":"file","options":{"maxSelect":1,"maxSize":2097152}},{"name":"sort_order","type":"number"}],"listRule":"","viewRule":"","createRule":"","updateRule":"@request.auth.role = '\''admin'\''","deleteRule":"@request.auth.role = '\''admin'\''"}')
echo "  branches = $BRANCHES_ID"

TEAM_ID=$(cc '{"name":"team_members","type":"base","schema":[{"name":"name","type":"text","required":true,"options":{"max":200}},{"name":"role","type":"text","options":{"max":200}},{"name":"bio","type":"text","options":{"max":5000}},{"name":"photo","type":"file","options":{"maxSelect":1,"maxSize":2097152}},{"name":"sort_order","type":"number"}],"listRule":"","viewRule":"","createRule":"","updateRule":"@request.auth.role = '\''admin'\''","deleteRule":"@request.auth.role = '\''admin'\''"}')
echo "  team_members = $TEAM_ID"

MILESTONES_ID=$(cc '{"name":"timeline_milestones","type":"base","schema":[{"name":"title","type":"text","required":true,"options":{"max":200}},{"name":"year","type":"text","options":{"max":50}},{"name":"description","type":"text","options":{"max":5000}},{"name":"display_order","type":"number"}],"listRule":"","viewRule":"","createRule":"","updateRule":"@request.auth.role = '\''admin'\''","deleteRule":"@request.auth.role = '\''admin'\''"}')
echo "  timeline_milestones = $MILESTONES_ID"

TESTIMONIALS_ID=$(cc '{"name":"testimonials","type":"base","schema":[{"name":"name","type":"text","required":true,"options":{"max":200}},{"name":"role","type":"text","options":{"max":200}},{"name":"content","type":"text","required":true,"options":{"max":5000}},{"name":"rating","type":"number","options":{"min":1,"max":5}},{"name":"photo","type":"file","options":{"maxSelect":1,"maxSize":2097152}},{"name":"display_order","type":"number"}],"listRule":"","viewRule":"","createRule":"","updateRule":"@request.auth.role = '\''admin'\''","deleteRule":"@request.auth.role = '\''admin'\''"}')
echo "  testimonials = $TESTIMONIALS_ID"

FAQS_ID=$(cc '{"name":"faqs","type":"base","schema":[{"name":"question","type":"text","required":true,"options":{"max":500}},{"name":"answer","type":"text","required":true,"options":{"max":10000}},{"name":"category","type":"text","options":{"max":200}},{"name":"display_order","type":"number"}],"listRule":"","viewRule":"","createRule":"","updateRule":"@request.auth.role = '\''admin'\''","deleteRule":"@request.auth.role = '\''admin'\''"}')
echo "  faqs = $FAQS_ID"

OFFERS_ID=$(cc '{"name":"offers","type":"base","schema":[{"name":"title","type":"text","required":true,"options":{"max":200}},{"name":"description","type":"text","options":{"max":5000}},{"name":"discount_percent","type":"number","options":{"min":0,"max":100}},{"name":"valid_from","type":"text","options":{"max":50}},{"name":"valid_until","type":"text","options":{"max":50}},{"name":"image","type":"file","options":{"maxSelect":1,"maxSize":2097152}},{"name":"active","type":"bool"},{"name":"sort_order","type":"number"}],"listRule":"","viewRule":"","createRule":"","updateRule":"@request.auth.role = '\''admin'\''","deleteRule":"@request.auth.role = '\''admin'\''"}')
echo "  offers = $OFFERS_ID"

BLOG_ID=$(cc '{"name":"blog_posts","type":"base","schema":[{"name":"title","type":"text","required":true,"options":{"max":300}},{"name":"slug","type":"text","unique":true,"options":{"max":300}},{"name":"content","type":"text","options":{"max":100000}},{"name":"excerpt","type":"text","options":{"max":1000}},{"name":"author","type":"text","options":{"max":200}},{"name":"image","type":"file","options":{"maxSelect":1,"maxSize":5242880}},{"name":"tags","type":"text","options":{"max":500}},{"name":"published","type":"bool"},{"name":"published_at","type":"text","options":{"max":50}}],"listRule":"@request.auth.role = '\''admin'\'' || published = true","viewRule":"","createRule":"","updateRule":"@request.auth.role = '\''admin'\''","deleteRule":"@request.auth.role = '\''admin'\''"}')
echo "  blog_posts = $BLOG_ID"

GALLERY_ID=$(cc '{"name":"gallery","type":"base","schema":[{"name":"title","type":"text","options":{"max":200}},{"name":"description","type":"text","options":{"max":1000}},{"name":"image","type":"file","required":true,"options":{"maxSelect":1,"maxSize":10485760}},{"name":"category","type":"text","options":{"max":200}},{"name":"sort_order","type":"number"}],"listRule":"","viewRule":"","createRule":"","updateRule":"@request.auth.role = '\''admin'\''","deleteRule":"@request.auth.role = '\''admin'\''"}')
echo "  gallery = $GALLERY_ID"

CONTACTS_ID=$(cc '{"name":"contacts","type":"base","schema":[{"name":"name","type":"text","required":true,"options":{"max":200}},{"name":"email","type":"email","required":true},{"name":"phone","type":"text","options":{"max":50}},{"name":"subject","type":"text","options":{"max":300}},{"name":"message","type":"text","required":true,"options":{"max":10000}},{"name":"status","type":"select","options":{"values":["new","contacted","resolved"],"maxSelect":1}},{"name":"assigned_to","type":"text","options":{"max":200}}],"listRule":"@request.auth.role = '\''admin'\''","viewRule":"","createRule":"","updateRule":"@request.auth.role = '\''admin'\''","deleteRule":"@request.auth.role = '\''admin'\''"}')
echo "  contacts = $CONTACTS_ID"

SUBS_ID=$(cc '{"name":"subscribers","type":"base","schema":[{"name":"email","type":"email","required":true,"unique":true},{"name":"name","type":"text","options":{"max":200}},{"name":"active","type":"bool"}],"listRule":"@request.auth.role = '\''admin'\''","viewRule":"","createRule":"","updateRule":"@request.auth.role = '\''admin'\''","deleteRule":"@request.auth.role = '\''admin'\''"}')
echo "  subscribers = $SUBS_ID"

WS_ID=$(cc '{"name":"website_settings","type":"base","schema":[{"name":"key","type":"text","required":true,"unique":true,"options":{"max":200}},{"name":"value","type":"text","options":{"max":50000}},{"name":"group","type":"text","options":{"max":200}},{"name":"type","type":"select","options":{"values":["text","textarea","image","bool","number"],"maxSelect":1}}],"listRule":"@request.auth.role = '\''admin'\''","viewRule":"","createRule":"","updateRule":"@request.auth.role = '\''admin'\''","deleteRule":"@request.auth.role = '\''admin'\''"}')
echo "  website_settings = $WS_ID"

EMAIL_T_ID=$(cc '{"name":"email_templates","type":"base","schema":[{"name":"name","type":"text","required":true,"unique":true,"options":{"max":200}},{"name":"subject","type":"text","required":true,"options":{"max":500}},{"name":"body","type":"text","required":true,"options":{"max":100000}},{"name":"variables","type":"text","options":{"max":2000}},{"name":"active","type":"bool"}],"listRule":"@request.auth.role = '\''admin'\''","viewRule":"","createRule":"","updateRule":"@request.auth.role = '\''admin'\''","deleteRule":"@request.auth.role = '\''admin'\''"}')
echo "  email_templates = $EMAIL_T_ID"

MEDIA_ID=$(cc '{"name":"media","type":"base","schema":[{"name":"filename","type":"text","required":true,"options":{"max":300}},{"name":"file","type":"file","required":true,"options":{"maxSelect":1,"maxSize":10485760}},{"name":"alt","type":"text","options":{"max":300}},{"name":"type","type":"select","options":{"values":["image","document","video","other"],"maxSelect":1}},{"name":"uploaded_by","type":"relation","options":{"collectionId":"_pb_users_auth_","maxSelect":1,"cascadeDelete":false}}],"listRule":"@request.auth.role = '\''admin'\''","viewRule":"","createRule":"","updateRule":"@request.auth.role = '\''admin'\''","deleteRule":"@request.auth.role = '\''admin'\''"}')
echo "  media = $MEDIA_ID"

AUDIT_ID=$(cc '{"name":"audit_logs","type":"base","schema":[{"name":"user","type":"relation","options":{"collectionId":"_pb_users_auth_","maxSelect":1,"cascadeDelete":false}},{"name":"action","type":"text","required":true,"options":{"max":200}},{"name":"resource","type":"text","options":{"max":200}},{"name":"resource_id","type":"text","options":{"max":200}},{"name":"details","type":"text","options":{"max":10000}},{"name":"ip","type":"text","options":{"max":50}}],"listRule":"@request.auth.role = '\''admin'\''","viewRule":"","createRule":"","updateRule":"@request.auth.role = '\''admin'\''","deleteRule":"@request.auth.role = '\''admin'\''"}')
echo "  audit_logs = $AUDIT_ID"

SYS_ID=$(cc '{"name":"system_settings","type":"base","schema":[{"name":"key","type":"text","required":true,"unique":true,"options":{"max":200}},{"name":"value","type":"text","options":{"max":50000}},{"name":"type","type":"select","options":{"values":["text","number","bool","json"],"maxSelect":1}}],"listRule":"@request.auth.role = '\''admin'\''","viewRule":"","createRule":"","updateRule":"@request.auth.role = '\''admin'\''","deleteRule":"@request.auth.role = '\''admin'\''"}')
echo "  system_settings = $SYS_ID"

echo ""
echo "=== Step 2: Collections with relations ==="

MOTO_ID=$(cc "{\"name\":\"motorcycles\",\"type\":\"base\",\"schema\":[{\"name\":\"name\",\"type\":\"text\",\"required\":true,\"options\":{\"max\":300}},{\"name\":\"slug\",\"type\":\"text\",\"unique\":true,\"options\":{\"max\":300}},{\"name\":\"brand\",\"type\":\"relation\",\"options\":{\"collectionId\":\"$BRANDS_ID\",\"maxSelect\":1,\"cascadeDelete\":false}},{\"name\":\"category\",\"type\":\"relation\",\"options\":{\"collectionId\":\"$CATS_ID\",\"maxSelect\":1,\"cascadeDelete\":false}},{\"name\":\"year\",\"type\":\"number\",\"options\":{\"min\":1900,\"max\":2100}},{\"name\":\"price\",\"type\":\"number\",\"options\":{\"min\":0}},{\"name\":\"status\",\"type\":\"select\",\"options\":{\"values\":[\"available\",\"sold\",\"coming_soon\"],\"maxSelect\":1}},{\"name\":\"description\",\"type\":\"text\",\"options\":{\"max\":10000}},{\"name\":\"engine\",\"type\":\"text\",\"options\":{\"max\":200}},{\"name\":\"horsepower\",\"type\":\"text\",\"options\":{\"max\":200}},{\"name\":\"images\",\"type\":\"file\",\"options\":{\"maxSelect\":10,\"maxSize\":5242880}},{\"name\":\"featured\",\"type\":\"bool\"},{\"name\":\"new_arrival\",\"type\":\"bool\"},{\"name\":\"offer_price\",\"type\":\"number\",\"options\":{\"min\":0}},{\"name\":\"sort_order\",\"type\":\"number\"}],\"listRule\":\"\",\"viewRule\":\"\",\"createRule\":\"@request.auth.role = 'admin'\",\"updateRule\":\"@request.auth.role = 'admin'\",\"deleteRule\":\"@request.auth.role = 'admin'\"}")
echo "  motorcycles = $MOTO_ID"

BOOKINGS_ID=$(cc "{\"name\":\"bookings\",\"type\":\"base\",\"schema\":[{\"name\":\"user\",\"type\":\"relation\",\"options\":{\"collectionId\":\"_pb_users_auth_\",\"maxSelect\":1,\"cascadeDelete\":false}},{\"name\":\"type\",\"type\":\"select\",\"required\":true,\"options\":{\"values\":[\"test_ride\",\"service\"],\"maxSelect\":1}},{\"name\":\"motorcycle\",\"type\":\"text\",\"options\":{\"max\":300}},{\"name\":\"motorcycle_id\",\"type\":\"relation\",\"options\":{\"collectionId\":\"$MOTO_ID\",\"maxSelect\":1,\"cascadeDelete\":false}},{\"name\":\"service_type\",\"type\":\"text\",\"options\":{\"max\":200}},{\"name\":\"branch\",\"type\":\"text\",\"options\":{\"max\":200}},{\"name\":\"preferred_date\",\"type\":\"text\",\"options\":{\"max\":100}},{\"name\":\"preferred_time\",\"type\":\"text\",\"options\":{\"max\":50}},{\"name\":\"status\",\"type\":\"select\",\"options\":{\"values\":[\"pending\",\"confirmed\",\"in_progress\",\"completed\",\"cancelled\"],\"maxSelect\":1}},{\"name\":\"notes\",\"type\":\"text\",\"options\":{\"max\":5000}},{\"name\":\"assigned_to\",\"type\":\"text\",\"options\":{\"max\":200}}],\"listRule\":\"@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)\",\"viewRule\":\"\",\"createRule\":\"\",\"updateRule\":\"@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)\",\"deleteRule\":\"@request.auth.role = 'admin'\"}")
echo "  bookings = $BOOKINGS_ID"

SR_ID=$(cc "{\"name\":\"service_requests\",\"type\":\"base\",\"schema\":[{\"name\":\"user\",\"type\":\"relation\",\"options\":{\"collectionId\":\"_pb_users_auth_\",\"maxSelect\":1,\"cascadeDelete\":false}},{\"name\":\"motorcycle\",\"type\":\"text\",\"options\":{\"max\":300}},{\"name\":\"service_type\",\"type\":\"text\",\"options\":{\"max\":200}},{\"name\":\"description\",\"type\":\"text\",\"options\":{\"max\":5000}},{\"name\":\"preferred_date\",\"type\":\"text\",\"options\":{\"max\":100}},{\"name\":\"status\",\"type\":\"select\",\"options\":{\"values\":[\"pending\",\"diagnosed\",\"in_progress\",\"completed\",\"cancelled\"],\"maxSelect\":1}},{\"name\":\"cost\",\"type\":\"number\",\"options\":{\"min\":0}},{\"name\":\"notes\",\"type\":\"text\",\"options\":{\"max\":5000}},{\"name\":\"assigned_to\",\"type\":\"text\",\"options\":{\"max\":200}}],\"listRule\":\"@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)\",\"viewRule\":\"\",\"createRule\":\"\",\"updateRule\":\"@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)\",\"deleteRule\":\"@request.auth.role = 'admin'\"}")
echo "  service_requests = $SR_ID"

NOTIF_ID=$(cc "{\"name\":\"notifications\",\"type\":\"base\",\"schema\":[{\"name\":\"user\",\"type\":\"relation\",\"options\":{\"collectionId\":\"_pb_users_auth_\",\"maxSelect\":1,\"cascadeDelete\":true}},{\"name\":\"title\",\"type\":\"text\",\"required\":true,\"options\":{\"max\":300}},{\"name\":\"message\",\"type\":\"text\",\"options\":{\"max\":5000}},{\"name\":\"type\",\"type\":\"select\",\"options\":{\"values\":[\"booking\",\"service\",\"offer\",\"system\",\"message\"],\"maxSelect\":1}},{\"name\":\"link\",\"type\":\"text\",\"options\":{\"max\":500}},{\"name\":\"read\",\"type\":\"bool\"}],\"listRule\":\"@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)\",\"viewRule\":\"\",\"createRule\":\"@request.auth.role = 'admin'\",\"updateRule\":\"@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)\",\"deleteRule\":\"@request.auth.role = 'admin'\"}")
echo "  notifications = $NOTIF_ID"

MSGS_ID=$(cc "{\"name\":\"messages\",\"type\":\"base\",\"schema\":[{\"name\":\"from_user\",\"type\":\"relation\",\"options\":{\"collectionId\":\"_pb_users_auth_\",\"maxSelect\":1,\"cascadeDelete\":false}},{\"name\":\"to_user\",\"type\":\"relation\",\"options\":{\"collectionId\":\"_pb_users_auth_\",\"maxSelect\":1,\"cascadeDelete\":false}},{\"name\":\"subject\",\"type\":\"text\",\"options\":{\"max\":300}},{\"name\":\"message\",\"type\":\"text\",\"required\":true,\"options\":{\"max\":10000}},{\"name\":\"read\",\"type\":\"bool\"}],\"listRule\":\"@request.auth.role = 'admin' || (@request.auth.role = 'customer' && (@request.auth.id = from_user || @request.auth.id = to_user))\",\"viewRule\":\"\",\"createRule\":\"@request.auth.role = 'admin'\",\"updateRule\":\"@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = to_user)\",\"deleteRule\":\"@request.auth.role = 'admin'\"}")
echo "  messages = $MSGS_ID"

FAV_ID=$(cc "{\"name\":\"favorites\",\"type\":\"base\",\"schema\":[{\"name\":\"user\",\"type\":\"relation\",\"options\":{\"collectionId\":\"_pb_users_auth_\",\"maxSelect\":1,\"cascadeDelete\":true}},{\"name\":\"motorcycle\",\"type\":\"relation\",\"options\":{\"collectionId\":\"$MOTO_ID\",\"maxSelect\":1,\"cascadeDelete\":false}}],\"listRule\":\"@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)\",\"viewRule\":\"\",\"createRule\":\"@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)\",\"updateRule\":\"@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)\",\"deleteRule\":\"@request.auth.role = 'admin' || (@request.auth.role = 'customer' && @request.auth.id = user)\"}")
echo "  favorites = $FAV_ID"

echo ""
echo "=== Step 3: Update users collection with role field ==="

# Add role to users
USERS_ID=$(curl -s http://127.0.0.1:8090/api/collections \
  -H "$AUTH" | python3 -c "import sys,json; d=json.load(sys.stdin); print([c['id'] for c in d['items'] if c['name']=='users'][0])")

curl -s -w " HTTP:%{http_code}" -X PATCH "$PB_URL/api/collections/$USERS_ID" \
  -H "Content-Type: application/json" -H "$AUTH" \
  -d '{"schema":[{"name":"name","type":"text","options":{"max":200}},{"name":"avatar","type":"file","options":{"maxSelect":1,"maxSize":2097152}},{"name":"phone","type":"text","options":{"max":50}},{"name":"role","type":"select","required":true,"options":{"values":["customer","admin"],"maxSelect":1}},{"name":"availability","type":"select","options":{"values":["online","busy","offline"],"maxSelect":1}},{"name":"email_notifications","type":"bool"},{"name":"sms_notifications","type":"bool"}],"listRule":"@request.auth.id = @request.auth.id","viewRule":"","createRule":"","updateRule":"@request.auth.id = @request.auth.id || @request.auth.role = '\''admin'\''","deleteRule":"@request.auth.role = '\''admin'\''"}'

echo ""
echo "=== All Done ==="
