#!/usr/bin/env bash
set -e

# Build package
echo "🏗️ Building the package..."
npm run build

# Bump version (patch/minor/major should be passed as argument)
VERSION_TYPE=${1:-patch}
echo "🔖 Bumping $VERSION_TYPE version..."
npm version $VERSION_TYPE

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "📦 New version: $NEW_VERSION"

# Publish to npm
echo "🚀 Publishing to npm (latest)..."
npm publish --access public

# Push Git tags
echo "🔀 Pushing Git tags..."
git push origin --tags
git push

# Tagging release
echo "🏷️ Creating GitHub release tag v$NEW_VERSION..."
git tag v$NEW_VERSION

echo "✅ Release v$NEW_VERSION published successfully!"