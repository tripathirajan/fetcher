#!/usr/bin/env bash
set -e

# Build
echo "🏗️ Building the package..."
npm run build

# Bump prerelease version
echo "🔖 Bumping beta version..."
npm version prerelease --preid=beta

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "📦 New version: $NEW_VERSION"

# Publish to npm
echo "🚀 Publishing to npm (beta)..."
npm publish --tag beta --access public

# Update dist-tag to point beta to the latest beta version
echo "🏷️ Updating dist-tag 'beta' to $NEW_VERSION..."
npm dist-tag add @tripathirajan/fetcher@$NEW_VERSION beta

# Push Git tags
echo "🔀 Pushing Git tags..."
git push origin --tags

echo "✅ Done!"