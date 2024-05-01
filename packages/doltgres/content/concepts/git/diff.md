---
title: Diff
---

# Diff

## What is a Diff?

Diff, short for difference, is used to display the differences between two references, usually
commits. Doltgres produces diffs of schema and data.

Doltgres produces cell-wise diffs for table data. If a primary key exists, rows are identified
across commits using the primary key. Changes to columns that are not in the primary key will appear
as updates. Changes to primary key columns will appear as inserts and corresponding deletes.

If no primary key exists, all changes look like inserts and deletes. Effectively, for diff purposes,
the keys of the table with no primary keys are the entire form.

Doltgres can produce diffs on the command line, as tables, or as a SQL patch.

Doltgres can produce diffs at scale because the Doltgres storage engine breaks the rows in the
database down into chunks. Each chunk is content-addressed and stored in a tree called a Prolly
Tree. Thus, to calculate data diffs, Doltgres walks the trees at both commits, exposing the chunks
that are different. For instance, if nothing has changed, the content address of the root of the
table is unchanged.

## How to use diffs

Diffs are an invaluable tool for data debugging. 

In human readable form, seeing what cells in your database changed can help you instantly spot
problems in the data that may have gone overlooked. You can see diffs through a SQL query of the
[`dolt_diff_<tablename>` system
table](../../reference/sql/version-control/dolt-system-tables.md#dolt_diff_usdtablename).

## Difference between Git diffs and Doltgres diffs

Git and Doltgres diffs are conceptually the same. Display the differences between two sets of files
in Git's case and tables in Doltgres's case.

The Git diff command supports many more file specific options. Doltgres diffs can be queried using
SQL. Doltgres diffs produce diffs for schema and data. There is no schema diff equivalent in Git.

## Example

```sql
select * from dolt_diff_docs;
+-------+-------+----------------------------------+-----------------------------------+---------+---------+----------------------------------+-----------------------------------+-----------+
| to_c1 | to_pk | to_commit                        | to_commit_date                    | from_c1 | from_pk | from_commit                      | from_commit_date                  | diff_type |
+-------+-------+----------------------------------+-----------------------------------+---------+---------+----------------------------------+-----------------------------------+-----------+
| 0     | 0     | dmmkbaiq6g6mm0vruc07utpns47sjkv7 | 2021-12-06 21:31:54.041 +0000 UTC | NULL    | NULL    | v42og53ru3k3hak3decm23crp5p6kd2f | 2021-12-06 21:27:53.886 +0000 UTC | added     |
| 1     | 1     | 5emu36fgedeurr6qk5uq6mj96k5j53j9 | 2021-12-06 21:36:02.076 +0000 UTC | 0       | 1       | ne14m8g2trlunju5a2mu735kjioocmll | 2021-12-06 21:34:12.585 +0000 UTC | modified  |
| NULL  | NULL  | ne14m8g2trlunju5a2mu735kjioocmll | 2021-12-06 21:34:12.585 +0000 UTC | 0       | 0       | dmmkbaiq6g6mm0vruc07utpns47sjkv7 | 2021-12-06 21:31:54.041 +0000 UTC | removed   |
| 0     | 1     | ne14m8g2trlunju5a2mu735kjioocmll | 2021-12-06 21:34:12.585 +0000 UTC | NULL    | NULL    | dmmkbaiq6g6mm0vruc07utpns47sjkv7 | 2021-12-06 21:31:54.041 +0000 UTC | added     |
| 1     | 2     | ne14m8g2trlunju5a2mu735kjioocmll | 2021-12-06 21:34:12.585 +0000 UTC | NULL    | NULL    | dmmkbaiq6g6mm0vruc07utpns47sjkv7 | 2021-12-06 21:31:54.041 +0000 UTC | added     |
+-------+-------+----------------------------------+-----------------------------------+---------+---------+----------------------------------+-----------------------------------+-----------+

select * from dolt_diff_docs where from_pk=0;
+-------+-------+----------------------------------+-----------------------------------+---------+---------+----------------------------------+-----------------------------------+-----------+
| to_c1 | to_pk | to_commit                        | to_commit_date                    | from_c1 | from_pk | from_commit                      | from_commit_date                  | diff_type |
+-------+-------+----------------------------------+-----------------------------------+---------+---------+----------------------------------+-----------------------------------+-----------+
| NULL  | NULL  | ne14m8g2trlunju5a2mu735kjioocmll | 2021-12-06 21:34:12.585 +0000 UTC | 0       | 0       | dmmkbaiq6g6mm0vruc07utpns47sjkv7 | 2021-12-06 21:31:54.041 +0000 UTC | removed   |
+-------+-------+----------------------------------+-----------------------------------+---------+---------+----------------------------------+-----------------------------------+-----------+
```
