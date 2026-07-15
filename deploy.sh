#!/bin/bash
# Deployment script for Nairobi Powerbikes
set -e

echo "=== Nairobi Powerbikes Deployment ==="

# Configuration
PB_DIR="/Users/app/Downloads/pocketbase_0.39.5_darwin_amd64"
PB_BINARY="$PB_DIR/pocketbase"
PB_DATA="./pb_data"
PB_PORT="${PB_PORT:-8090}"
PB_ORIGINS="${PB_ORIGINS:-*}"

ADMIN_EMAIL="${ADMIN_EMAIL:-abelmabruke@gmail.com}"
ADMIN_PASS="${ADMIN_PASS:-Brooks9383}"

echo "1. Building Nuxt application..."
npx nuxi build
echo "   Build complete"

echo "2. Starting PocketBase..."
if pgrep -f "pocketbase serve" > /dev/null 2>&1; then
  echo "   PocketBase already running"
else
  nohup "$PB_BINARY" serve --dir="$PB_DATA" --http="127.0.0.1:$PB_PORT" > /tmp/pb.log 2>&1 &
  sleep 2
  echo "   PocketBase started on port $PB_PORT"
fi

echo "3. Verifying PocketBase health..."
curl -sf "http://127.0.0.1:$PB_PORT/api/health" > /dev/null && echo "   Healthy" || echo "   WARNING: Health check failed"

echo "4. Starting Nuxt preview server..."
echo "   Run: node .output/server/index.mjs"
echo ""
echo "=== Done ==="
echo "PocketBase: http://127.0.0.1:$PB_PORT/_/"
echo "API:        http://127.0.0.1:$PB_PORT/api/"
echo "CORS:       $PB_ORIGINS"
