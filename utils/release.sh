#!/bin/bash

set -e

if [ "$#" -ne 1 ]; then
	echo "Usage: ./utils/release.sh (major/minor/patch)"
	exit 1
fi

if [ ! -z "$(git status --porcelain)" ]; then
	echo "Working directory isn't clean"
	# exit 1
fi

type=$1

shopt -s extglob
if [[ $type != @(major|minor|patch) ]]; then
	echo "$type is not a valid release type"
	exit 1
fi

old_version=$(node -pe "require('./package.json').version")
echo "Old version: $old_version"

echo "Creating $type release..."
tag=$(npm -no-git-tag-version version ${type})
version=${tag:1}
sed -i "s/\/$old_version/\/$version/g" src/server/index.ts
sed -i "s/\"$old_version\"/\"$version\"/g" src/webext/manifest.json
sed -i "s/\"$old_version\"/\"$version\"/g" src/webext/manifest.firefox.json

git add .
git commit -m "Release $version"
git tag $tag

echo "Tagged $tag"

echo ""
echo "Now test the build:"
echo " rm -rf dist"
echo " NODE_ENV=production npm run build:app"
echo " NODE_ENV=production npm run start:firefox"
echo " NODE_ENV=production npm run start:chrome"
echo ""
echo "and then push the commit and tag."
