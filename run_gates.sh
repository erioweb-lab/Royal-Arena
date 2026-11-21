#!/bin/bash
# P0 통합 게이트 러너 — 컴파일→정적게이트→시뮬→E2E(tests/test_*.py)
set -u
ROOT=$(cd "$(dirname "$0")" && pwd); cd "$ROOT"
TMP=$(mktemp -d); cp royal-arena/js/*.js royal-arena/sw.js "$TMP/"; FAIL=0
for f in "$TMP"/*.js; do node --check "$f" 2>/dev/null || { echo "COMPILE:FAIL $(basename $f)"; FAIL=1; }; done
[ $FAIL -eq 0 ] && echo "COMPILE:OK"
node scripts/camera_check.cjs 2>&1 | tail -1 | grep -q "CAMERA_CHECK:PASS" || { echo "CAMERA_CHECK:FAIL"; FAIL=1; }
node scripts/active_resources_check.cjs 2>&1 | tail -1 | grep -q "ACTIVE-RESOURCES:OK" || { echo "ACTIVE-RESOURCES:FAIL"; FAIL=1; }
node scripts/sim_duel.cjs 2>&1 | tail -1 | grep -q "DUEL:OK" || { echo "DUEL:FAIL"; FAIL=1; }
export BASE="http://127.0.0.1:4183/index.html"
python3 -m http.server 4183 --directory royal-arena >/dev/null 2>&1 &
SRV=$!; sleep 1
for t in tests/test_*.py; do echo "--- $t"; python3 "$t" || { echo "E2E:FAIL $t"; FAIL=1; }; done
kill $SRV 2>/dev/null; fuser -k 4183/tcp 2>/dev/null
[ $FAIL -eq 0 ] && echo "RUN_GATES:ALL_OK" || echo "RUN_GATES:FAIL"
exit $FAIL
