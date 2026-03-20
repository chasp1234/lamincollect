#!/usr/bin/env bash
set -euo pipefail

# Usage:
# ./scripts/r2-upload-from-plan.sh <bucket-name> [plan-json]
# Requires: jq, curl, wrangler (authenticated)

BUCKET="${1:-}"
PLAN="${2:-tmp/r2/upload-plan.json}"

if [[ -z "$BUCKET" ]]; then
  echo "Usage: $0 <bucket-name> [plan-json]"
  exit 1
fi

if [[ ! -f "$PLAN" ]]; then
  echo "Plan file not found: $PLAN"
  exit 1
fi

TMP_DIR="tmp/r2/downloads"
mkdir -p "$TMP_DIR"

TOTAL=$(jq 'length' "$PLAN")
echo "Uploading $TOTAL objects to R2 bucket: $BUCKET"

for i in $(seq 0 $((TOTAL-1))); do
  KEY=$(jq -r ".[${i}].key" "$PLAN")
  SRC=$(jq -r ".[${i}].source" "$PLAN")
  OUT="$TMP_DIR/$(printf '%04d' "$i").jpg"

  echo "[$((i+1))/$TOTAL] $KEY"

  # download source image
  curl -L --fail --retry 3 --retry-delay 2 \
    -H "User-Agent: Mozilla/5.0" \
    "$SRC" -o "$OUT"

  # upload to R2
  wrangler r2 object put "${BUCKET}/${KEY}" --file "$OUT"

  # keep a tiny pause to avoid bursts
  sleep 0.15
done

echo "Done."
