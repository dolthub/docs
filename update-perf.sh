#!/bin/bash

set -ex
set -o pipefail

version=""
sed_cmd_i=""
start_marker=""
end_marker=""
dest_file=""

sql_reference_dir="content/reference/sql"

new_table="updated.md"

start_template="<!-- START_%s_RESULTS_TABLE -->"
end_template="<!-- END_%s_RESULTS_TABLE -->"

if [ "$#" -ne 2 ]; then
  echo "Must supply version and type, eg update-perf.sh 'v0.39.0' latency|correctness"
  exit 1;
fi

version="$1"
type="$2"

# handle sed for linux and macos
if [[ "$OSTYPE" == "linux-gnu"* ]]
then
  sed_cmd_i="sed -i"
else
  sed_cmd_i="sed -i ''"
fi

if [ "$type" == "latency" ]
then
  dest_file="$sql_reference_dir/latency.md"

  # update the version
  eval "$sed_cmd_i 's/The Dolt version is \\\`.*\\\`/The Dolt version is \\\`$version\\\`/' $dest_file"

  start_marker=$(printf "$start_template" "LATENCY")
  end_marker=$(printf "$end_template" "LATENCY")

else
  dest_file="$sql_reference_dir/correctness.md"

  # update the correctness version
  eval "$sed_cmd_i 's/Here are Dolt'\''s sqllogictest results for version \\\`.*\\\`./Here are Dolt'\''s sqllogictest results for version \\\`$version\\\`./' $dest_file"

  start_marker=$(printf "$start_template" "CORRECTNESS")
  end_marker=$(printf "$end_template" "CORRECTNESS")
fi

# store in variable
updated=$(cat "$new_table")
updated_with_markers=$(printf "$start_marker\n$updated\n$end_marker\n")

echo "$updated_with_markers" > "$new_table"

# replace table in the proper file
sed -e '/\<!-- END/r '"$new_table"'' -e '/\<!-- START/,/\<!-- END/d' "$dest_file" > temp.md
# mv temp.md "$dest_file"
