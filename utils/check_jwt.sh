#!/bin/bash

set -e

echo "Signing JWT"

JWT=$(node utils/make_jwt.js $1 $2)

curl -o - "https://addons.mozilla.org/api/v5/accounts/profile/" \
     -H "Authorization: JWT $JWT"
