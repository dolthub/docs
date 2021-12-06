---
title: Diff
---

# Diff

## What is a Diff?

Diff, short for difference, is used to display the differences between two references, usually commits. Dolt produces diffs of schema and data.

Dolt produces diffs of table schema. Schema diffs appear as raw textual differences between the `CREATE TABLE` statements used to define the table schema at each commit. 

Dolt produces cell-wise diffs between table data. If a primary key exists, rows are identified across commits via primary key. Non-primary key changes will appear as updates. Primary key changes will appear as inserts and corresponding deletes. 

If no primary key exists, all changes look like inserts and deletes. Effectively, for diff purposes, the keys of the table with no primary keys are the entire form.

Dolt can produce diffs in command line readable form, table form, or as a SQL patch.

Dolt can produce diffs at scale because the Dolt storage engine breaks the rows in the database down into chunks. Each chunk is content-addressed and stored in a tree called [a Prolly Tree](). Thus, to calculate data diffs, Dolt walks the trees at both commits, exposing the chunks that are different. For instance, if nothing has changed, the content address of the root of the table is unchanged. 

## How to use diffs

Diffs are an invaluable tool for data debugging. 

In human readable form, seeing what cells in your database changed can help you instantly spot problems in the data that may have gone overlooked. You can see diffs in human readable form via the [Dolt CLI](../../reference/cli.md) or through a SQL query of the [`dolt_diff_<tablename>` system table](../../reference/sql/dolt-system-tables.md). 

For instance, are you expecting no `NULL` cells but have some? This indicates a bug in your data creation process. Simply looking at a summary of how many rows were added, modified, and deleted in a specific change can be fruitful. Expecting only row additions in a change but got some modifications? A deeper dive into that import job may be required.

Programmatically, you can use SQL to explore very large diffs using the [`dolt_diff_<tablename>` system tables](../../reference/sql/dolt-system-tables.md).

## Difference between Git diffs and Dolt diffs

Git and Dolt diffs are conceptually the same. Display the differences between two sets of files in Git's case and tables in Dolt's case. 

The Git diff command supports many more file specific options. Dolt diffs can be queried using SQL Dolt diffs produce diffs for schema and data. There is no schema diff equivalent in Git.

## Example

Schema

Data with Primary Key

Addition/deletion

Update

Data without primary key

Addition/Deletion

Update

SQL