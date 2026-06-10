#!/usr/bin/env bash
# Copies only GraphQL-related files needed for codegen into a temporary directory.
# This allows Docker to cache the codegen layer separately from other source changes.

set -e

SRC_DIR="${1:-.}"
DEST_DIR="${2:-./graphql-tmp}"

# Clean destination
rm -rf "$DEST_DIR"
mkdir -p "$DEST_DIR/src"

# Find and copy all GraphQL documents that codegen reads
find "$SRC_DIR/src" -type f \( \
  -name "queries.ts" \
  -o -name "mutations.ts" \
  -o -path "*/fragments/*.ts" \
  -path "*/searches/*.ts" \
\) | while read -r file; do
  rel_path="${file#$SRC_DIR/}"
  dest_file="$DEST_DIR/$rel_path"
  mkdir -p "$(dirname "$dest_file")"
  cp "$file" "$dest_file"
done

echo "Copied GraphQL files to $DEST_DIR"
