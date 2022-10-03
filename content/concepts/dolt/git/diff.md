---
title: Diff
---

# Diff

## What is a Diff?

Diff, short for difference, is used to display the differences between two references, usually commits. Dolt produces diffs of schema and data.

Dolt produces diffs of table schema. 

Schema diffs appear as raw textual differences between the `CREATE TABLE` statements used to define the table schema at each commit. The can be produced on the command line using `dolt diff --schema`. No way to generate schema diffs in SQL exists yet.

Dolt produces cell-wise diffs for table data. If a primary key exists, rows are identified across commits using the primary key. Changes to columns that are not in the primary key will appear as updates. Changes to primary key columns will appear as inserts and corresponding deletes. 

If no primary key exists, all changes look like inserts and deletes. Effectively, for diff purposes, the keys of the table with no primary keys are the entire form.

Dolt can produce diffs on the command line, as tables, or as a SQL patch.

Dolt can produce diffs at scale because the Dolt storage engine breaks the rows in the database down into chunks. Each chunk is content-addressed and stored in a tree called [a Prolly Tree](../../../architectecture/storage-engine/prolly-tree). Thus, to calculate data diffs, Dolt walks the trees at both commits, exposing the chunks that are different. For instance, if nothing has changed, the content address of the root of the table is unchanged. 

## How to use diffs

Diffs are an invaluable tool for data debugging. 

In human readable form, seeing what cells in your database changed can help you instantly spot problems in the data that may have gone overlooked. You can see diffs in human readable form via the [Dolt CLI](../../../reference/cli.md) or through a SQL query of the [`dolt_diff_<tablename>` system table](../../../reference/sql/dolt-system-tables.md). 

For instance, are you expecting no `NULL` cells but have some? This indicates a bug in your data creation process. Simply looking at a summary of how many rows were added, modified, and deleted in a specific change can be fruitful. Expecting only row additions in a change but got some modifications? A deeper dive into that import job may be required.

Programmatically, you can use SQL to explore very large diffs using the [`dolt_diff_<tablename>` system tables](../../../reference/sql/dolt-system-tables.md).

## Difference between Git diffs and Dolt diffs

Git and Dolt diffs are conceptually the same. Display the differences between two sets of files in Git's case and tables in Dolt's case. 

The Git diff command supports many more file specific options. Dolt diffs can be queried using SQL Dolt diffs produce diffs for schema and data. There is no schema diff equivalent in Git.

## Example

### Schema

```
docs $ dolt sql -q "alter table docs add column c1 int"
docs $ dolt diff
diff --dolt a/docs b/docs
--- a/docs @ 90tss7r2gfraa2cjugganbbtg5j6kjfc
+++ b/docs @ nt808mhhienne2dss4mjdcj8jrdig6ml
 CREATE TABLE `docs` (
   `pk` int NOT NULL,
+  `c1` int,
   PRIMARY KEY (`pk`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
+-----+----+----+
|  <  | pk |    |
|  >  | pk | c1 |
+-----+----+----+
+-----+----+----+
```

### Data with Primary Key

#### Addition/deletion

```
docs $ dolt sql -q "insert into docs values (1,0),(2,1)"
Query OK, 2 rows affected
docs $ dolt diff
diff --dolt a/docs b/docs
--- a/docs @ cj9ln2kg7u6aiprr7i24rf48es4tk1eg
+++ b/docs @ qfiv5iankh0gltpov71h0mcvaqvftvlh
+-----+----+----+
|     | pk | c1 |
+-----+----+----+
|  +  | 1  | 0  |
|  +  | 2  | 1  |
+-----+----+----+
docs $ dolt sql -q "delete from docs where pk=0"
Query OK, 1 row affected
docs $ dolt diff
diff --dolt a/docs b/docs
--- a/docs @ cj9ln2kg7u6aiprr7i24rf48es4tk1eg
+++ b/docs @ 8aca41vfss9kcqkrdhos25be87nlu3b9
+-----+----+----+
|     | pk | c1 |
+-----+----+----+
|  -  | 0  | 0  |
|  +  | 1  | 0  |
|  +  | 2  | 1  |
+-----+----+----+
```

#### Update

```
docs $ dolt sql -q "update docs set c1=1 where pk=1"
Query OK, 1 row affected
Rows matched: 1  Changed: 1  Warnings: 0
docs $ dolt diff
diff --dolt a/docs b/docs
--- a/docs @ 8aca41vfss9kcqkrdhos25be87nlu3b9
+++ b/docs @ 2lcu9e49ia08icjonmt3l0s7ph2cdb5s
+-----+----+----+
|     | pk | c1 |
+-----+----+----+
|  <  | 1  | 0  |
|  >  | 1  | 1  |
+-----+----+----+
```

### Data without primary key

#### Addition/Deletion

```
docs $ dolt sql -q "insert into no_pk values (0,0,0),(1,1,1),(2,2,2)"
Query OK, 3 rows affected
docs $ dolt diff
diff --dolt a/no_pk b/no_pk
--- a/no_pk @ df9bd3mf77t2gicphep87nvuobqjood7
+++ b/no_pk @ 7s8jhc9nlnouhai8kdtsssrm1hpegpf0
+-----+----+----+----+
|     | c1 | c2 | c3 |
+-----+----+----+----+
|  +  | 1  | 1  | 1  |
|  +  | 2  | 2  | 2  |
|  +  | 0  | 0  | 0  |
+-----+----+----+----+
docs $ dolt commit -am "Added data to no_pk table" 
commit mjbtf27jidi86jrm32lvop7mmlpgplbg
Author: Tim Sehn <tim@dolthub.com>
Date:   Mon Dec 06 13:38:19 -0800 2021

	Added data to no_pk table

docs $ dolt sql -q "delete from no_pk where c1=0"
Query OK, 1 row affected
docs $ dolt diff
diff --dolt a/no_pk b/no_pk
--- a/no_pk @ 7s8jhc9nlnouhai8kdtsssrm1hpegpf0
+++ b/no_pk @ s23c851fomfcjaiufm25mi9mlnhurh2c
+-----+----+----+----+
|     | c1 | c2 | c3 |
+-----+----+----+----+
|  -  | 0  | 0  | 0  |
+-----+----+----+----+
```

#### Update

```
docs $ dolt sql -q "update no_pk set c1=0 where c1=1"
Query OK, 1 row affected
Rows matched: 1  Changed: 1  Warnings: 0
docs $ dolt diff
diff --dolt a/no_pk b/no_pk
--- a/no_pk @ s23c851fomfcjaiufm25mi9mlnhurh2c
+++ b/no_pk @ 18k2q3pav9a2v8mkk26nhhhss4eda86k
+-----+----+----+----+
|     | c1 | c2 | c3 |
+-----+----+----+----+
|  -  | 1  | 1  | 1  |
|  +  | 0  | 1  | 1  |
+-----+----+----+----+
```

### SQL

```
docs $ dolt sql -q "select * from dolt_diff_docs"
+-------+-------+----------------------------------+-----------------------------------+---------+---------+----------------------------------+-----------------------------------+-----------+
| to_c1 | to_pk | to_commit                        | to_commit_date                    | from_c1 | from_pk | from_commit                      | from_commit_date                  | diff_type |
+-------+-------+----------------------------------+-----------------------------------+---------+---------+----------------------------------+-----------------------------------+-----------+
| 0     | 0     | dmmkbaiq6g6mm0vruc07utpns47sjkv7 | 2021-12-06 21:31:54.041 +0000 UTC | NULL    | NULL    | v42og53ru3k3hak3decm23crp5p6kd2f | 2021-12-06 21:27:53.886 +0000 UTC | added     |
| 1     | 1     | 5emu36fgedeurr6qk5uq6mj96k5j53j9 | 2021-12-06 21:36:02.076 +0000 UTC | 0       | 1       | ne14m8g2trlunju5a2mu735kjioocmll | 2021-12-06 21:34:12.585 +0000 UTC | modified  |
| NULL  | NULL  | ne14m8g2trlunju5a2mu735kjioocmll | 2021-12-06 21:34:12.585 +0000 UTC | 0       | 0       | dmmkbaiq6g6mm0vruc07utpns47sjkv7 | 2021-12-06 21:31:54.041 +0000 UTC | removed   |
| 0     | 1     | ne14m8g2trlunju5a2mu735kjioocmll | 2021-12-06 21:34:12.585 +0000 UTC | NULL    | NULL    | dmmkbaiq6g6mm0vruc07utpns47sjkv7 | 2021-12-06 21:31:54.041 +0000 UTC | added     |
| 1     | 2     | ne14m8g2trlunju5a2mu735kjioocmll | 2021-12-06 21:34:12.585 +0000 UTC | NULL    | NULL    | dmmkbaiq6g6mm0vruc07utpns47sjkv7 | 2021-12-06 21:31:54.041 +0000 UTC | added     |
+-------+-------+----------------------------------+-----------------------------------+---------+---------+----------------------------------+-----------------------------------+-----------+
docs $ dolt sql -q "select * from dolt_diff_docs where from_pk=0"
+-------+-------+----------------------------------+-----------------------------------+---------+---------+----------------------------------+-----------------------------------+-----------+
| to_c1 | to_pk | to_commit                        | to_commit_date                    | from_c1 | from_pk | from_commit                      | from_commit_date                  | diff_type |
+-------+-------+----------------------------------+-----------------------------------+---------+---------+----------------------------------+-----------------------------------+-----------+
| NULL  | NULL  | ne14m8g2trlunju5a2mu735kjioocmll | 2021-12-06 21:34:12.585 +0000 UTC | 0       | 0       | dmmkbaiq6g6mm0vruc07utpns47sjkv7 | 2021-12-06 21:31:54.041 +0000 UTC | removed   |
+-------+-------+----------------------------------+-----------------------------------+---------+---------+----------------------------------+-----------------------------------+-----------+
```
