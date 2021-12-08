---
title: Dolt System Tables
---

# Table of contents

* [dolt\_branches](#dolt_branches)
* [dolt\_commit\_diff](#dolt_commit_diff_usdtablename)
* [dolt\_diff](#dolt_diff_usdtablename)
* [dolt\_docs](#dolt_docs)
* [dolt\_history](#dolt_history_usdtablename)
* [dolt\_log](#dolt_log)
* [dolt\_status](#dolt_status)
* [dolt\_conflicts](#dolt_conflicts_usdtablename)
* [dolt\_procedures](#dolt_procedures)
* [dolt\_schemas](#dolt_schemas)
* [dolt\_remotes](#dolt_remotes)

# Dolt System Tables

## `dolt_branches`

`dolt_branches` contains information about branches known to the database.

Branches can be created, modified, or deleted with `INSERT`, `UPDATE`,
or `DELETE` statements.

Because the branch information is global to all clients, not just your
session, it's recommended to lock the table before modifying it.

### Schema

```text
+------------------------+----------+
| Field                  | Type     |
+------------------------+----------+
| name                   | TEXT     |
| hash                   | TEXT     |
| latest_committer       | TEXT     |
| latest_committer_email | TEXT     |
| latest_commit_date     | DATETIME |
| latest_commit_message  | TEXT     |
+------------------------+----------+
```

### Example Queries

Get all the branches.

```sql
SELECT *
FROM dolt_branches
```

```text
+--------+----------------------------------+------------------+------------------------+-----------------------------------+-------------------------------+
| name   | hash                             | latest_committer | latest_committer_email | latest_commit_date                | latest_commit_message         |
+--------+----------------------------------+------------------+------------------------+-----------------------------------+-------------------------------+
| 2011   | t2sbbg3h6uo93002frfj3hguf22f1uvh | bheni            | brian@dolthub.com     | 2020-01-22 20:47:31.213 +0000 UTC | import 2011 column mappings   |
| 2012   | 7gonpqhihgnv8tktgafsg2oovnf3hv7j | bheni            | brian@dolthub.com     | 2020-01-22 23:01:39.08 +0000 UTC  | import 2012 allnoagi data     |
| 2013   | m9seqiabaefo3b6ieg90rr4a14gf6226 | bheni            | brian@dolthub.com     | 2020-01-22 23:50:10.639 +0000 UTC | import 2013 zipcodeagi data   |
| 2014   | v932nm88f5g3pjmtnkq917r2q66jm0df | bheni            | brian@dolthub.com     | 2020-01-23 00:00:43.673 +0000 UTC | update 2014 column mappings   |
| 2015   | c7h0jc23hel6qbh8ro5ertiv15to9g9o | bheni            | brian@dolthub.com     | 2020-01-23 00:04:35.459 +0000 UTC | import 2015 allnoagi data     |
| 2016   | 0jntctp6u236le9qjlt9kf1q1if7mp1l | bheni            | brian@dolthub.com     | 2020-01-28 20:38:32.834 +0000 UTC | fix allnoagi zipcode for 2016 |
| 2017   | j883mmogbd7rg3cfltukugk0n65ud0fh | bheni            | brian@dolthub.com     | 2020-01-28 16:43:45.687 +0000 UTC | import 2017 allnoagi data     |
| master | j883mmogbd7rg3cfltukugk0n65ud0fh | bheni            | brian@dolthub.com     | 2020-01-28 16:43:45.687 +0000 UTC | import 2017 allnoagi data     |
+--------+----------------------------------+------------------+------------------------+-----------------------------------+-------------------------------+
```

Get the current branch for a database named "mydb".

```sql
SELECT *
FROM dolt_branches
WHERE hash = @@mydb_head
```

```text
+--------+----------------------------------+------------------+------------------------+-----------------------------------+-------------------------------+
| name   | hash                             | latest_committer | latest_committer_email | latest_commit_date                | latest_commit_message         |
+--------+----------------------------------+------------------+------------------------+-----------------------------------+-------------------------------+
| 2016   | 0jntctp6u236le9qjlt9kf1q1if7mp1l | bheni            | brian@dolthub.com     | 2020-01-28 20:38:32.834 +0000 UTC | fix allnoagi zipcode for 2016 |
+--------+----------------------------------+------------------+------------------------+-----------------------------------+-------------------------------+
```

Create a new commit, and then create a branch from that commit

```sql
SET @@mydb_head = COMMIT("my commit message")

INSERT INTO dolt_branches (name, hash)
VALUES ("my branch name", @@mydb_head);
```

## `dolt_commit_diff_$TABLENAME`

For every user table named `$TABLENAME`, there is a queryable system
table named `dolt_commit_diff_$TABLENAME` which can be queried to see
how a table has changed between two commits (regardless of which
branch the user is currently using).

For each pair of commits in the database history, the diff tables will
have zero or more rows, each of which represents a row that is
different between the two commits, with its old and new values.

### Schema

```text
+-------------+------+
| field       | type |
+-------------+------+
| from_commit | TEXT |
| to_commit   | TEXT |
| diff_type   | TEXT |
| other cols  |      |
+-------------+------+
```

The remaining columns will be dependent on the schema of the user
table. For every column X in your table at `from_commit`, there will
be a column in the result set named `from_$X` with the same type as
`X`, and for every column `Y` in your table at `to_commit` there will
be a column in the result set named `to_$Y` with the same type as
`Y`. The `from_commit` and `to_commit` parameters must both be filled.

`dolt_commit_diff_$TABLENAME` is more similar to the `dolt diff` CLI
command than the `dolt_diff_$TABLENAME` table. It represents the
[two-dot
diff](https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection#double_dot)
between the two commits provided.

### Example Schema

Let us consider a simple example with a table that has two
columns. Consider the table

```text
+--------------+
| field | type |
+--------------+
| pk    | int  |
| val   | int  |
+--------------+
```

We see that the structure of the `dolt_commit_diff_$TABLENAME` will be.

```text
+------------------+----------+
| field            | type     |
+------------------+----------+
| to_pk            | int      |
| to_val           | int      |
| to_commit        | longtext |
| to_commit_date   | datetime |
| from_pk          | int      |
| from_val         | int      |
| from_commit      | longtext |
| from_commit_date | datetime |
+------------------+----------+
```

### Query Details

Let us now consider the following branch structure:

```text
      A---B---C feature
     /
D---E---F---G master
```

We can use the above table to represent two types of diffs, a
two-point diff and a three-point diff. In a two-point diff we want to
see the difference in rows between Point C and Point G. To do that we
can simply do

```SQL
SELECT * from dolt_commif_diff_$TABLENAME where to_commit=HASHOF('feature') and from_commit = HASHOF('master');
```

We can also compute a three-point diff using this table. In a
three-point diff we want to see how our feature branch has diverged
from our common ancestor E. We can do the following queries

```SQL
SELECT * FROM dolt_commit_diff_$TABLENAME WHERE to_commit=HASHOF('feature') and from_commit=dolt_merge_base('master', 'feature');
```

The function `dolt_merge_base` computes the closest ancestor E
between `master` and `feature`.

### Additional Notes

There is one special `to_commit` value `WORKING` which can be used to
see what changes are in the working set that have yet to be committed
to HEAD. It is often useful to use the `HASHOF()` function to get the
commit hash of a branch, or an ancestor commit. The above table
requires both `from_commit` and `to_commit` to be filled.

## `dolt_diff_$TABLENAME`

For every user table named `$TABLENAME`, there is a queryable system
table named `dolt_diff_$TABLENAME` which can be queried to see how
rows have changed over time. Each row in the result set represents a
row that has changed between two commits. Compared to the
`dolt_commit_diff_$TABLENAME` the `dolt_diff_$TABLENAME` focuses on
how a particular row has evolved over time through the current branch.

### Schema

Every Dolt diff table will have the columns

```text
+-------------+------+
| field       | type |
+-------------+------+
| from_commit | TEXT |
| to_commit   | TEXT |
| diff_type   | TEXT |
| other cols  |      |
+-------------+------+
```

The remaining columns will be dependent on the schema of the user
table. For every column X in your table at `from_commit`, there will
be a column in the result set named `from_$X` with the same type as
`X`, and for every column `Y` in your table at `to_commit` there will
be a column in the result set named `to_$Y` with the same type as `Y`.

### Example Schema

For a hypothetical table named states with a schema that changes
between `from_commit` and `to_commit` as shown below

```text
# schema at from_commit    # schema at to_commit
+------------+--------+    +------------+--------+
| field      | type   |    | field      | type   |
+------------+--------+    +------------+--------+
| state      | TEXT   |    | state      | TEXT   |
| population | BIGINT |    | population | BIGINT |
+------------+--------+    | area       | BIGINT |
                           +-------------+-------+
```

The schema for `dolt_diff_states` would be

```text
+-----------------+--------+
| field           | type   |
+-----------------+--------+
| from_state      | TEXT   |
| to_state        | TEXT   |
| from_population | BIGINT |
| to_population   | BIGINT |
| to_state        | TEXT   |
| from_commit     | TEXT   |
| to_commit       | TEXT   |
| diff_type       | TEXT   |
+-----------------+--------+
```

### Query Details

Doing a `SELECT *` query for a diff table will show you every change
that has occurred to each row for every commit in this branches
history. Using `to_commit` and `from_commit` you can limit the data to
specific commits. There is one special `to_commit` value `WORKING`
which can be used to see what changes are in the working set that have
yet to be committed to HEAD. It is often useful to use the `HASHOF()`
function to get the commit hash of a branch, or an ancestor
commit. To get the differences between the last commit and it's parent
you could use `to_commit=HASHOF("HEAD") and from_commit=HASHOF("HEAD^")`

For each row the field `diff_type` will be one of the values `added`,
`modified`, or `removed`. You can filter which rows appear in the
result set to one or more of those `diff_type` values in order to
limit which types of changes will be returned.

### Example Query

Taking the
[`dolthub/wikipedia-ngrams`](https://www.dolthub.com/repositories/dolthub/wikipedia-ngrams)
data repository from [DoltHub](https://www.dolthub.com/) as our
example, the following query will retrieve the bigrams whose total
counts have changed the most between 2 versions.

```sql
SELECT from_bigram, to_bigram, from_total_count, to_total_count, ABS(to_total_count-from_total_count) AS delta
FROM dolt_diff_bigram_counts
WHERE from_commit = HASHOF("HEAD~3") AND diff_type = "modified"
ORDER BY delta DESC
LIMIT 10;
```

```text
+-------------+-------------+------------------+----------------+-------+
| from_bigram | to_bigram   | from_total_count | to_total_count | delta |
+-------------+-------------+------------------+----------------+-------+
| of the      | of the      | 21566470         | 21616678       | 50208 |
| _START_ The | _START_ The | 19008468         | 19052410       | 43942 |
| in the      | in the      | 14345719         | 14379619       | 33900 |
| _START_ In  | _START_ In  | 8212684          | 8234586        | 21902 |
| to the      | to the      | 7275659          | 7291823        | 16164 |
| _START_ He  | _START_ He  | 5722362          | 5737483        | 15121 |
| at the      | at the      | 4273616          | 4287398        | 13782 |
| for the     | for the     | 4427780          | 4438872        | 11092 |
| and the     | and the     | 4871852          | 4882874        | 11022 |
| is a        | is a        | 4632620          | 4643068        | 10448 |
+-------------+-------------+------------------+----------------+-------+
```

## `dolt_docs`

`dolt_docs` stores the contents of Dolt docs \(`LICENSE.md`,
`README.md`\).

You can modify the contents of these files via SQL, but you are not
guaranteed to see these changes reflected in the files on disk.

### Schema

```text
+----------+------+
| field    | type |
+----------+------+
| doc_name | text |
| doc_text | text |
+----------+------+
```

### Usage

Dolt users do not have to be familiar with this system table in order
to make a `LICENSE.md` or `README.md`. Simply run `dolt init` or
`touch README.md` and `touch LICENSE.md` from a Dolt repository to get
started. Then, `dolt add` and `dolt commit` the docs like you would a
table.

## `dolt_history_$TABLENAME`

For every user table named `$TABLENAME`, there is a queryable system
table named `dolt_history_$TABLENAME` which can be queried to find a
row's value at every commit in the current branches commit graph.

### Schema

Every Dolt history table will have the columns

```text
+-------------+----------+
| field       | type     |
+-------------+----------+
| commit_hash | TEXT     |
| committer   | TEXT     |
| commit_date | DATETIME |
| other cols  |          |
+-------------+----------+
```

The rest of the columns will be the superset of all columns that have
existed throughout the history of the table.

### Example Schema

For a hypothetical data repository with the following commit graph:

```text
   A
  / \
 B   C
      \
       D
```

Which has a table named states with the following schemas at each commit:

```text
# schema at A              # schema at B              # schema at C              # schema at D
+------------+--------+    +------------+--------+    +------------+--------+    +------------+--------+
| field      | type   |    | field      | type   |    | field      | type   |    | field      | type   |
+------------+--------+    +------------+--------+    +------------+--------+    +------------+--------+
| state      | TEXT   |    | state      | TEXT   |    | state      | TEXT   |    | state      | TEXT   |
| population | BIGINT |    | population | BIGINT |    | population | BIGINT |    | population | BIGINT |
+------------+--------+    | capital    | TEXT   |    | area       | BIGINT |    | area       | BIGINT |
                           +------------+--------+    +------------+--------+    | counties   | BIGINT |
                                                                                 +------------+--------+
```

The schema for dolt_history_states would be:

```text
+-------------+----------+
| field       | type     |
+-------------+----------+
| state       | TEXT     |
| population  | BIGINT   |
| capital     | TEXT     |
| area        | BIGINT   |
| counties    | BIGINT   |
| commit_hash | TEXT     |
| committer   | TEXT     |
| commit_date | DATETIME |
+-------------+----------+
```

### Example Query

Taking the above table as an example. If the data inside dates for each commit was:

- At commit "A" the state data from 1790
- At commit "B" the state data from 1800
- At commit "C" the state data from 1800
- At commit "D" the state data from 1810

```sql
SELECT *
FROM dolt_history_states
WHERE state = "Virginia";
```

```text
+----------+------------+----------+--------+----------+-------------+-----------+---------------------------------+
| state    | population | capital  | area   | counties | commit_hash | committer | commit_date                     |
+----------+------------+----------+--------+----------+-------------+-----------+---------------------------------+
| Virginia | 691937     | <NULL>   | <NULL> | <NULL>   | HASH_AT(A)  | billybob  | 1790-01-09 00:00:00.0 +0000 UTC |
| Virginia | 807557     | Richmond | <NULL> | <NULL>   | HASH_AT(B)  | billybob  | 1800-01-01 00:00:00.0 +0000 UTC |
| Virginia | 807557     | <NULL>   | 42774  | <NULL>   | HASH_AT(C)  | billybob  | 1800-01-01 00:00:00.0 +0000 UTC |
| Virginia | 877683     | <NULL>   | 42774  | 99       | HASH_AT(D)  | billybob  | 1810-01-01 00:00:00.0 +0000 UTC |
+----------+------------+----------+--------+----------+-------------+-----------+---------------------------------+

# Note in the real result set there would be actual commit hashes for each row.  Here I have used notation that is
# easier to understand how it relates to our commit graph and the data associated with each commit above
```

## `dolt_log`

`dolt_log` contains the commit log, with contents identical to the
`dolt log` command on the CLI.

### Schema

```text
+-------------+----------+
| field       | type     |
+-------------+--------- +
| commit_hash | text     |
| committer   | text     |
| email       | text     |
| date        | datetime |
| message     | text     |
+-------------+--------- +
```

### Example Query

```sql
SELECT *
FROM dolt_log
WHERE committer = "bheni" and date > "2019-04-01"
ORDER BY "date";
```

```text
+----------------------------------+-----------+--------------------+-----------------------------------+---------------+
| commit_hash                      | committer | email              | date                              | message       |
+----------------------------------+-----------+--------------------+-----------------------------------+---------------+
| qi331vjgoavqpi5am334cji1gmhlkdv5 | bheni     | brian@dolthub.com | 2019-06-07 00:22:24.856 +0000 UTC | update rating |
| 137qgvrsve1u458briekqar5f7iiqq2j | bheni     | brian@dolthub.com | 2019-04-04 22:43:00.197 +0000 UTC | change rating |
| rqpd7ga1nic3jmc54h44qa05i8124vsp | bheni     | brian@dolthub.com | 2019-04-04 21:07:36.536 +0000 UTC | fixes         |
+----------------------------------+-----------+--------------------+-----------------------------------+---------------+
```

## `dolt_status`

`dolt_status` returns the status of the database session, analogous to
running `dolt status` from the command line.

### Schema

```text
+------------+---------+------+-----+
| Field      | Type    | Null | Key |
+------------+---------+------+-----+
| table_name | text    | NO   | PRI |
| staged     | tinyint | NO   |     |
| status     | text    | NO   |     |
+------------+---------+------+-----+
```

### Example Query

```sql
SELECT *
FROM dolt_status
WHERE staged=false;
```

```text
+------------+--------+-----------+
| table_name | staged | status    |
+------------+--------+-----------+
| one_pk     | false  | new table |
+------------+--------+-----------+
```

## `dolt_conflicts_$TABLENAME`

For each table `$TABLENAME` in conflict after a merge, there is a
corresponding system table named `dolt_conflicts_$TABLENAME`. The
schema of each such table contains three columns for each column in
the actual table, representing each row in conflict for each of ours,
theirs, and base values.

Consider a table `mytable` with this schema:

```sql
+-------+------+------+-----+---------+-------+
| Field | Type | Null | Key | Default | Extra |
+-------+------+------+-----+---------+-------+
| a     | int  | NO   | PRI |         |       |
| b     | int  | YES  |     |         |       |
+-------+------+------+-----+---------+-------+
```

If we attempt a merge that creates conflicts in this table, I can
examine them with the following query:

```sql
mydb> select * from dolt_conflicts_mytable;
+--------+--------+-------+-------+---------+---------+
| base_a | base_b | our_a | our_b | their_a | their_b |
+--------+--------+-------+-------+---------+---------+
| NULL   | NULL   | 3     | 3     | 3       | 1       |
| NULL   | NULL   | 4     | 4     | 4       | 2       |
+--------+--------+-------+-------+---------+---------+
```

To mark conflicts as resolved, delete them from the corresponding
table. To effectively keep all `our` values, I would simply run:

```sql
mydb> delete from dolt_conflicts_mytable;
```

If I wanted to keep all `their` values, I would first run this statement:

```sql
mydb> replace into mytable (select their_a, their_b from dolt_conflicts_mytable);
```

And of course you can use any combination of `ours`, `theirs` and
`base` rows in these replacements.

## `dolt_procedures`

`dolt_procedures` stores each stored procedure that has been created
on the database.

The values in this table are implementation details associated with
the storage of stored procedures. It is recommended to use built-in
SQL statements for examining and modifying stored procedures rather
than using this table directly.

### Schema

```text
+-------------+----------+
| field       | type     |
+-------------+----------+
| name        | longtext |
| create_stmt | longtext |
| created_at  | datetime |
| modified_at | datetime |
+-------------+----------+
```

When using the standard `CREATE PROCEDURE` workflow, the `name` column
will always be lowercase. Dolt assumes that `name` is always lowercase
as a result, and manually inserting a stored procedure must also have
a lowercase `name`. Otherwise, it will be invisible to some
operations, such as `DROP PROCEDURE`.

### Example Query

```sql
CREATE PROCEDURE p1(x INT) SELECT x;
SELECT * FROM dolt_procedures;
```

```text
+------+-------------------------------------+-------------------------------+-------------------------------+
| name | create_stmt                         | created_at                    | modified_at                   |
+------+-------------------------------------+-------------------------------+-------------------------------+
| p1   | CREATE PROCEDURE p1(x INT) SELECT x | 2021-03-04 00:00:000+0000 UTC | 2021-03-04 00:00:000+0000 UTC |
+------+-------------------------------------+-------------------------------+-------------------------------+
```

## `dolt_schemas`

`dolt_schemas` stores SQL schema fragments for a dolt database that
are versioned alongside the database itself. Certain DDL statements
will modify this table and the value of this table in a SQL session
will affect what database entities exist in the session.

The values in this table are implementation details associated with
the storage of certain schema elements. It is recommended to use
built-in SQL statements for examining and modifying schemas, rather
than using this table directly.

### Schema

```text
+-------------+----------+
| field       | type     |
+-------------+--------- +
| type        | text     |
| name        | text     |
| fragment    | text     |
+-------------+--------- +
```

Currently on view definitions are stored in `dolt_schemas`. `type` is currently always the string `view`. `name` is the name of the view as supplied in the `CREATE VIEW ...` statement. `fragment` is the `select` fragment that the view is defined as.

The values in this table are partly implementation details associated with the implementation of the underlying database objects.

### Example Query

```sql
CREATE VIEW four AS SELECT 2+2 FROM dual;
SELECT * FROM dolt_schemas;
```

```text
+------+------+----------------------+
| type | name | fragment             |
+------+------+----------------------+
| view | four | select 2+2 from dual |
+------+------+----------------------+
```

## `dolt_remotes`

`dolt_remotes` returns the remote subcontents of the `repo_state.json`, similar
to running `dolt remote -v` from the command line.

The `dolt_remotes` table is currently read only. Use the CLI `dolt remote` functions
to add, update or delete remotes.

### Schema

```text
+-------------+------+------+-----+---------+-------+
| Field       | Type | Null | Key | Default | Extra |
+-------------+------+------+-----+---------+-------+
| name        | text | NO   | PRI |         |       |
| url         | text | NO   |     |         |       |
| fetch_specs | json | YES  |     |         |       |
| params      | json | YES  |     |         |       |
+-------------+------+------+-----+---------+-------+
```

### Example Query

```sql
SELECT *
FROM dolt_remotes
WHERE name = 'origin';
```

```text
+--------+-----------------------------------------+--------------------------------------+--------+
| name   | url                                     | fetch_specs                          | params |
+--------+-----------------------------------------+--------------------------------------+--------+
| origin | file:///go/github.com/dolthub/dolt/rem1 | [refs/heads/*:refs/remotes/origin/*] | map[]  |
+--------+-----------------------------------------+--------------------------------------+--------+
```
