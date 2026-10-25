#!/bin/sh
# Verifies staged .ts/.svelte files against CLAUDE.md rules.
# Called by lint-staged via package.json
# Usage: check-patterns.sh file1.ts file2.svelte ...

failed=0

# 1) console.log / as any / @ts-ignore / @ts-expect-error
if grep -lE "console\.log|: any\b|\bas any\b|@ts-ignore|@ts-expect-error" "$@" 2>/dev/null; then
  echo "❌ Prohibited: console.log / :any / as any / ts-ignore"
  failed=1
fi

# 2) {#each} without key (no '(' on same line)
if grep -lE "\{#each [^(]+}" "$@" 2>/dev/null; then
  echo "❌ {#each} without key expression"
  failed=1
fi

exit $failed
