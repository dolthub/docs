---
title: Diff
---

# Diff

## What is a Diff?

Diff, short for difference, is a command in Dolt used to print the differences between two references, usually commits. Dolt produces diffs between schema and data.

Dolt produces diffs between table schema. Schema diffs appear as raw textual differences between the `CREATE TABLE` statements used to define the table schema at each commit. 

Dolt produces cell-wise diffs between table data. If a primary key exists, rows are identified across commits via primary key. Non-primary key changes will appear as updates. Primary key changes will appear as inserts and corresponding deletes. If no primary key exists, all changes look like inserts and deletes.

Dolt can produce diffs in command line readable form, table form, or as a SQL patch.

## How to use diffs


## Difference between Git diffs and Dolt diffs


## Example

Schema

Data with Primary Key

Addition/deletion

Update

Data without primary key

Addition/Deletion

Update

SQL