#!/bin/bash

set -e

OUTPUT_DIR="code-export"

BACKEND_OUTPUT="$OUTPUT_DIR/backend-code.txt"
FRONTEND_PART_1="$OUTPUT_DIR/frontend-code-part-1.txt"
FRONTEND_PART_2="$OUTPUT_DIR/frontend-code-part-2.txt"

mkdir -p "$OUTPUT_DIR"

rm -f \
  "$BACKEND_OUTPUT" \
  "$FRONTEND_PART_1" \
  "$FRONTEND_PART_2"

write_file() {
  local file="$1"
  local output="$2"

  {
    printf '\n\n'
    printf '============================================================\n'
    printf 'FILE: %s\n' "$file"
    printf '============================================================\n\n'
    cat "$file"
    printf '\n'
  } >> "$output"
}

echo "Exporting backend code..."

find backend \
  \( \
    -path '*/__pycache__' -o \
    -path '*/.pytest_cache' -o \
    -path '*/.mypy_cache' -o \
    -path '*/.venv' -o \
    -path '*/venv' \
  \) -prune \
  -o -type f \
  \( \
    -name '*.py' -o \
    -name '*.txt' -o \
    -name '*.json' -o \
    -name '*.yml' -o \
    -name '*.yaml' -o \
    -name '*.md' -o \
    -name 'Dockerfile' \
  \) \
  ! -name '*.pyc' \
  ! -name '.env' \
  ! -name '.env.*' \
  ! -name '*.db' \
  ! -name '*.sqlite' \
  ! -name '*.sqlite3' \
  -print | sort | while IFS= read -r file; do
    write_file "$file" "$BACKEND_OUTPUT"
  done

if [ -f "docker-compose.yml" ]; then
  write_file "docker-compose.yml" "$BACKEND_OUTPUT"
fi

echo "Exporting frontend part 1..."

FRONTEND_PART_1_PATHS=(
  "frontend/src/api"
  "frontend/src/components"
  "frontend/src/constants"
  "frontend/src/context"
  "frontend/src/data"
  "frontend/src/hooks"
  "frontend/src/layouts"
  "frontend/src/providers"
  "frontend/src/routes"
  "frontend/src/styles"
  "frontend/src/types"
  "frontend/src/features/auth"
  "frontend/src/features/chat"
  "frontend/src/features/dashboard"
  "frontend/src/features/home"
  "frontend/src/features/insights"
  "frontend/src/features/market"
)

for path in "${FRONTEND_PART_1_PATHS[@]}"; do
  if [ -d "$path" ]; then
    find "$path" \
      -type f \
      \( \
        -name '*.ts' -o \
        -name '*.tsx' -o \
        -name '*.js' -o \
        -name '*.jsx' -o \
        -name '*.css' -o \
        -name '*.json' -o \
        -name '*.md' \
      \) \
      -print
  fi
done | sort -u | while IFS= read -r file; do
  write_file "$file" "$FRONTEND_PART_1"
done

FRONTEND_ROOT_FILES=(
  "frontend/src/App.tsx"
  "frontend/src/main.tsx"
  "frontend/package.json"
  "frontend/tsconfig.json"
  "frontend/tsconfig.app.json"
  "frontend/tsconfig.node.json"
  "frontend/vite.config.ts"
  "frontend/eslint.config.js"
  "frontend/index.html"
  "frontend/Dockerfile"
)

for file in "${FRONTEND_ROOT_FILES[@]}"; do
  if [ -f "$file" ]; then
    write_file "$file" "$FRONTEND_PART_1"
  fi
done

echo "Exporting frontend part 2..."

FRONTEND_PART_2_PATHS=(
  "frontend/src/features/portfolio"
  "frontend/src/features/search"
  "frontend/src/features/settings"
  "frontend/src/features/watchlist"
)

for path in "${FRONTEND_PART_2_PATHS[@]}"; do
  if [ -d "$path" ]; then
    find "$path" \
      -type f \
      \( \
        -name '*.ts' -o \
        -name '*.tsx' -o \
        -name '*.js' -o \
        -name '*.jsx' -o \
        -name '*.css' -o \
        -name '*.json' -o \
        -name '*.md' \
      \) \
      -print
  fi
done | sort -u | while IFS= read -r file; do
  write_file "$file" "$FRONTEND_PART_2"
done

echo
echo "Code export complete:"
echo "  $BACKEND_OUTPUT"
echo "  $FRONTEND_PART_1"
echo "  $FRONTEND_PART_2"
echo
echo "File sizes:"
ls -lh \
  "$BACKEND_OUTPUT" \
  "$FRONTEND_PART_1" \
  "$FRONTEND_PART_2"
