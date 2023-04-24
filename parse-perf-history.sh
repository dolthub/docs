#!/bin/bash

# A very hacky script to get historical perf data

set -eo pipefail

BRANCH=$(git rev-parse --abbrev-ref HEAD)

git log --pretty=format:"%h,\"%ad\",%s" | grep 'latency\|perf' > "perf-parse-commits.csv"

while IFS="" read -r line || [ -n "$line" ]
do
  echo "line: $line"
  hash=$(echo "$line" | cut -d , -f 1)
  date=$(echo "$line" | cut -d , -f 2)
  git checkout "$hash" 2>> "perf-parse-log.txt"

  path=""
  [ -f "content/reference/sql/benchmarks/latency.md" ] && path="content/reference/sql/benchmarks/latency.md"
  [ -f "content/reference/sql/latency.md" ] && path="content/reference/sql/latency.md"
  [ -f "content/reference/performance/latency.md" ] && path="content/reference/performance/latency.md"
  [ -f "content/introduction/why-dolt/characteristics.md" ] && path="content/introduction/why-dolt/characteristics.md"
  [ -f "content/reference/characteristics.md" ] && path="content/reference/characteristics.md"
  [ -f "content/reference/characteristics/performance.md" ] && path="content/reference/characteristics/performance.md"
  [ -f "content/introduction/why-dolt/performance-characteristics.md" ] && path="content/introduction/why-dolt/performance-characteristics.md"
  [ -f "content/reference/sql/benchmarks.md" ] && path="content/reference/sql/benchmarks.md"

  if [ -z "path" ]; then
    echo "failed to find path" && exit 1
  fi

  echo "date: $date"
  grep 'Overall Mean' "$path"

done < "perf-parse-commits.csv"

rm "perf-parse-gitlog.txt" "perf-parse-commits.csv"
git checkout "$BRANCH
"