#!/usr/bin/env bash
set -e

# Build
echo "🏗️ Building the package..."
npm run build

# Bump prerelease version
echo "🔖 Bumping beta version..."
npm version prerelease --preid=beta

# Publish to npm
echo "🚀 Publishing to npm (beta)..."
npm publish --tag beta --access public

# Push Git tags

echo "🔀 Pushing Git tags..."
git push origin --tags

echo "✅ Done!"