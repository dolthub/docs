---
title: Merge
---

# Merge

## What is a merge?

A merge is a special type of commit that takes two branches and assembles a reasonable combination of the two databases represented by those branches. The merge may or may not generate [conflicts](./conflicts). Merges happen at the Dolt storage layer. No SQL is used to merge.

Dolt implements one merge strategy. The Dolt merge strategy will generally produce reasonable results. For schema, if the two branches modify different tables or columns, no conflict is generated. For data, Dolt does a cell-wise merge of data. See [conflicts](./conflicts) for details on when conflicts are generated and when they are not.

There is a special type of merge call a "Fast-forward" merge. Fast-forward merges happen when no changes happened on the branch you are merging into since you branched. In the commit log, fast-forward merges do not create merge commits, they just append the current branches commits to the end of the branch you are merging into.     

## How to use merges


## Difference between Git merges and Dolt merges


## Example