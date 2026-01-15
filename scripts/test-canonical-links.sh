#!/bin/bash

echo "🔍 Testing canonical URL compliance..."
echo ""

# Find all violations (excluding legitimate exceptions)
violations=$(grep -rn 'href="/[^"]*[^/]"' src/ --include="*.astro" --include="*.tsx" --include="*.ts" | \
  grep -v '\.svg"' | \
  grep -v '\.jpg"' | \
  grep -v '\.png"' | \
  grep -v '\.gif"' | \
  grep -v '\.webp"' | \
  grep -v '\.csv"' | \
  grep -v '/#' | \
  grep -v 'http://' | \
  grep -v 'https://' | \
  wc -l)

if [ "$violations" -gt 0 ]; then
  echo "❌ FAILED: Found $violations non-canonical internal links"
  echo ""
  echo "Violations:"
  grep -rn 'href="/[^"]*[^/]"' src/ --include="*.astro" --include="*.tsx" --include="*.ts" | \
    grep -v '\.svg"' | \
    grep -v '\.jpg"' | \
    grep -v '\.png"' | \
    grep -v '\.gif"' | \
    grep -v '\.webp"' | \
    grep -v '\.csv"' | \
    grep -v '/#' | \
    grep -v 'http://' | \
    grep -v 'https://'
  echo ""
  echo "Fix: Add trailing slash '/' before closing quote"
  exit 1
else
  echo "✅ PASSED: All internal links are canonical!"
  echo ""
  echo "Summary:"
  echo "  • All internal page URLs end with '/'"
  echo "  • Static assets (.svg, .jpg, etc.) preserved without '/'"
  echo "  • Hash fragments use correct format: /page/#section"
  echo "  • External URLs preserved unchanged"
  echo ""
  echo "✨ Your site is optimized for direct navigation (no redirects)!"
  exit 0
fi
