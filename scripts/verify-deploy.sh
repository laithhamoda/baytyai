#!/usr/bin/env bash
#
# Post-deploy verification for BaytyAI.
# Runs the smoke checks from DEPLOY_CHECKLIST.md against a live URL.
#
# Usage:
#   ./scripts/verify-deploy.sh                     # defaults to https://baytyai.com
#   ./scripts/verify-deploy.sh https://www.baytyai.com
#
set -uo pipefail

BASE_URL="${1:-https://baytyai.com}"
BASE_URL="${BASE_URL%/}" # strip trailing slash

pass=0
fail=0

green() { printf '\033[32m%s\033[0m' "$1"; }
red() { printf '\033[31m%s\033[0m' "$1"; }

check() {
  # check "<label>" "<test command>"
  local label="$1"
  shift
  if "$@" >/dev/null 2>&1; then
    printf '  [%s] %s\n' "$(green PASS)" "$label"
    pass=$((pass + 1))
  else
    printf '  [%s] %s\n' "$(red FAIL)" "$label"
    fail=$((fail + 1))
  fi
}

http_status() {
  curl -sS -o /dev/null -w '%{http_code}' -L --max-time 20 "$1"
}

echo "Verifying $BASE_URL"
echo

# 1. Homepage 200
status="$(http_status "$BASE_URL/")"
check "homepage returns 200 (got $status)" test "$status" = "200"

# 2. robots.txt reachable and contains a sitemap line
robots="$(curl -sS -L --max-time 20 "$BASE_URL/robots.txt")"
check "robots.txt reachable" test -n "$robots"
check "robots.txt references sitemap" grep -qi 'sitemap' <<<"$robots"

# 3. sitemap.xml reachable and well-formed-ish
sitemap="$(curl -sS -L --max-time 20 "$BASE_URL/sitemap.xml")"
check "sitemap.xml is XML" grep -q '<urlset' <<<"$sitemap"
# The sitemap always emits canonical production URLs (no trailing slash),
# independent of the host being tested — so assert on structure, not BASE_URL.
check "sitemap lists at least one URL" grep -q '<loc>https\?://[^<]*</loc>' <<<"$sitemap"
check "sitemap includes the /ar locale" grep -q '/ar</loc>' <<<"$sitemap"

# 4. OG image renders as PNG
octype="$(curl -sS -o /dev/null -w '%{content_type}' -L --max-time 30 "$BASE_URL/opengraph-image")"
check "opengraph-image is an image (got $octype)" grep -qi 'image/' <<<"$octype"

# 5. JSON-LD present on homepage
home="$(curl -sS -L --max-time 20 "$BASE_URL/")"
check "homepage embeds JSON-LD" grep -q 'application/ld+json' <<<"$home"
check "homepage has canonical link" grep -qi 'rel="canonical"' <<<"$home"

echo
printf 'Result: %s passed, %s failed\n' "$(green "$pass")" "$([ "$fail" -gt 0 ] && red "$fail" || green "$fail")"
echo
echo "Manual validators (paste $BASE_URL):"
echo "  - Google Rich Results : https://search.google.com/test/rich-results"
echo "  - Schema.org Validator : https://validator.schema.org"
echo "  - LinkedIn Inspector   : https://www.linkedin.com/post-inspector/"
echo "  - Twitter Card         : https://cards-dev.twitter.com/validator"

exit "$([ "$fail" -gt 0 ] && echo 1 || echo 0)"
