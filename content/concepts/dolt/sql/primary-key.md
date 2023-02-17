# Primary Keys

## What is a Primary Key?

A primary key is a column or set of columns that defines a unique row in a table. Often the primary key is a unique identification or id number.

In most databases, a map of primary keys to the values of the other columns in the table is how the data is laid out on disk or memory. This makes row lookups by primary key indexed lookups. Indexed lookups can be accomplished in constant time (ie. O(1)). Thus, use of primary keys in table definition and queries is a common database performance optimization. [Secondary Indexes](indexes.md) are called "secondary" to distinguish them from primary keys.

Tables without primary keys, or keyless tables, are implemented differently in databases. Usually, a keyless table is implemented as a map of every column in the table pointing to a counter of the number of rows with that value. When the counter goes to zero the index is deleted.

## How to use Primary Keys

You can add one or many primary keys to a table at creation time. Rows in the table cannot share the same primary key. Each set of primary keys must be unique. Also, primary keys must not be `NULL`. You can add primary keys to a table using `alter table <table> add primary key`.

It is generally desirable for most tables in a database to have a primary key for performance. Most database applications assign a primary key, usually called `id`, on row creation. Databases also support auto incrementing (ie. `AUTO_INCREMENT`) ids and random ids using the `UUID()` function.

## Difference between MySQL Primary Keys and Dolt Primary Keys

MySQL and Dolt primary keys are functionally the same. You use the same syntax to define and alter them.

## Interaction with Dolt Version Control

In Dolt, primary keys are used to produce modifications between rows across versions. A keyless table in Dolt only shows additions and deletions. Tables with primary keys additionally show modifications to non-primary key columns. Thus, Dolt can produce cell-wise diffs and logs across versions for tables with primary keys.

## Example

### Create a table with a primary key

```
mysql> create table keyed (c1 int, c2 int, c3 int, c4 int, primary key(c1, c2));
mysql> show create table keyed;
+-------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Table | Create Table                                                                                                                                                                        |
+-------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| keyed | CREATE TABLE `keyed` (
  `c1` int NOT NULL,
  `c2` int NOT NULL,
  `c3` int,
  `c4` int,
  PRIMARY KEY (`c1`,`c2`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin |
+-------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
```

### Alter a table's primary keys

```
mysql> alter table keyed drop primary key;
mysql> alter table keyed add primary key(c1);
mysql> show create table keyed;
+-------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Table | Create Table                                                                                                                                                                   |
+-------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| keyed | CREATE TABLE `keyed` (
  `c1` int NOT NULL,
  `c2` int NOT NULL,
  `c3` int,
  `c4` int,
  PRIMARY KEY (`c1`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin |
+-------+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
```

### Create a keyless table

```
mysql> create table keyless (c1 int, c2 int, c3 int, c4 int);
mysql> show create table keyless;
+---------+-------------------------------------------------------------------------------------------------------------------------------------+
| Table   | Create Table                                                                                                                             |
+---------+-------------------------------------------------------------------------------------------------------------------------------------+
| keyless | CREATE TABLE `keyless` (
  `c1` int,
  `c2` int,
  `c3` int,
  `c4` int
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin |
+---------+-------------------------------------------------------------------------------------------------------------------------------------+
```

### Diff for keyed and keyless table

```
mysql> insert into keyed values (0,0,0,0), (1,1,1,1), (2,2,2,2);
mysql> insert into keyless values (0,0,0,0), (1,1,1,1), (2,2,2,2);
mysql> call dolt_commit('-am', "Inserted values");
+----------------------------------+
| hash                             |
+----------------------------------+
| 089j3jom08iauhbmbl0mhur8pgsai6nh |
+----------------------------------+
mysql> update keyed set c4=10 where c1=2;
mysql> select * from dolt_diff_keyed where to_commit='WORKING';
+-------+-------+-------+-------+-----------+----------------+---------+---------+---------+---------+----------------------------------+-------------------------+-----------+
| to_c2 | to_c4 | to_c1 | to_c3 | to_commit | to_commit_date | from_c2 | from_c4 | from_c1 | from_c3 | from_commit                      | from_commit_date        | diff_type |
+-------+-------+-------+-------+-----------+----------------+---------+---------+---------+---------+----------------------------------+-------------------------+-----------+
| 2     | 10    | 2     | 2     | WORKING   | NULL           | 2       | 2       | 2       | 2       | 089j3jom08iauhbmbl0mhur8pgsai6nh | 2022-06-21 22:00:52.081 | modified  |
+-------+-------+-------+-------+-----------+----------------+---------+---------+---------+---------+----------------------------------+-------------------------+-----------+
mysql> update keyless set c4=10 where c1=2;
mysql> select * from dolt_diff_keyless where to_commit='WORKING';
+-------+-------+-------+-------+-----------+----------------+---------+---------+---------+---------+----------------------------------+-------------------------+-----------+
| to_c2 | to_c4 | to_c3 | to_c1 | to_commit | to_commit_date | from_c2 | from_c4 | from_c3 | from_c1 | from_commit                      | from_commit_date        | diff_type |
+-------+-------+-------+-------+-----------+----------------+---------+---------+---------+---------+----------------------------------+-------------------------+-----------+
| NULL  | NULL  | NULL  | NULL  | WORKING   | NULL           | 2       | 2       | 2       | 2       | 089j3jom08iauhbmbl0mhur8pgsai6nh | 2022-06-21 22:00:52.081 | removed   |
| 2     | 10    | 2     | 2     | WORKING   | NULL           | NULL    | NULL    | NULL    | NULL    | 089j3jom08iauhbmbl0mhur8pgsai6nh | 2022-06-21 22:00:52.081 | added     |
+-------+-------+-------+-------+-----------+----------------+---------+---------+---------+---------+----------------------------------+-------------------------+-----------+
```
