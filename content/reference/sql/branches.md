---
title: Using branches
---

# Using branches

Unlike other relational databases, Dolt has multiple heads, one for
each branch in the database. A head can be a branch, a tag, or a
working set. Multiple clients can connect to each branch, and will see
other writes to the same branch following the normal SQL transactional
isolation semantics (REPEATABLE_READ). In effect, each branch
functions as its own isolated database instance, with changes only
visible to other clients connected to the same branch.

![A Dolt database server with multiple heads](../../.gitbook/assets/dolt-server-branches.png)

A database server has a default branch, which is the checked-out
branch at the time the server was started. Each client can choose a
specific branch to connect to with their connection string, or change it
for their session with various statements.

## Specify a branch in the connection string

The exact connection string you need to use will vary depending on
your client.

To connect to the default branch, use a connection string with the name
of the database only.

`mysql://127.0.0.1:3306/mydb`

To connect to a different branch, specify that branch name with a
slash after the database name:

`mysql://127.0.0.1:3306/mydb/feature-branch`

To connect to a specific revision of the database, use a commit hash
instead of a branch name. The database will be read-only in this case.

`mysql://127.0.0.1:3306/mydb/ia1ibijq8hq1llr7u85uivsi5lh3310p`

The above options also work with the standard MySQL command line
client:

```sh
mysql --host 127.0.0.1 --port 3306 -u root mydb/feature-branch
```

## Switch heads with the `USE` statement

Following the above connection string examples, you can issue `USE`
statements to switch your current branch.

`USE mydb` switches to the default branch.

To switch to a named branch:

```sql
USE `mydb/feature-branch`
```

Note that the string must be back-tick quoted, since it contains a `/`
character.

To switch to a read-only database at a commit hash:

```sql
USE `mydb/ia1ibijq8hq1llr7u85uivsi5lh3310p`
```

## Switch branches with the `DOLT_CHECKOUT()` function

The `DOLT_CHECKOUT()` SQL function provides identical functionality to
the `dolt checkout` command on the command line, and accepts the same
arguments.

`SELECT DOLT_CHECKOUT('feature-branch');` switches the session to the
`feature-branch` branch. You can also switch to a new branch, like so:

```sql
SELECT DOLT_CHECKOUT('-b', 'new-branch');
```

You can switch to a new branch with a starting commit as well:

```sql
SELECT DOLT_CHECKOUT('-b', 'new-branch-at-commit', 'ia1ibijq8hq1llr7u85uivsi5lh3310p')
```

## Switch branches with a session variable

Each session defines a system variable that controls the current
session head. For a database called `mydb` as above, this variable
will be called `@@mydb_head_ref` and be set to the current head.

```sql
mydb> select @@mydb_head_ref;
+-------------------------+
| @@SESSION.mydb_head_ref |
+-------------------------+
| refs/heads/main       |
+-------------------------+
```

To switch branches, set this session variable. Use either
`refs/heads/branchName` or just `branchName`:

```sql
SET @@mydb_head_ref = 'feature-branch'
```

## Notes on switching branches

If you have outstanding changes in your session (because you have
issued DML or DDL statements to change the data or schema), you must
`COMMIT` them or `ROLLBACK` the transaction before switching branches.

## Merging branches

To merge a branch into your current branch, use the [`DOLT_MERGE()`
function](dolt-sql-functions.md#dolt_merge):

```sql
select dolt_merge('feature-branch');
```

Merging branches can create
[conflicts](../../concepts/dolt/conflicts.md), which you must resolve
before you can commit your transaction. If a merge creates conflicts,
the `DOLT_MERGE()` function will return a non-zero result. You can
find which tables are in conflict by querying the `dolt_conflicts`
system table:

```sql
SELECT * FROM dolt_conflicts;
+--------+---------------+
| table  | num_conflicts |
+--------+---------------+
| people |             3 |
+--------+---------------+
```

Each database table has an associated `dolt_conflicts` table, which
you can `SELECT`, `UPDATE` and `DELETE` rows from to examine and
resolve conflicts. For the hypothetical `people` table above, the
conflict table looks like this:

```sql
DESCRIBE dolt_conflicts_people;
+------------------+-------------+------+------+---------+-------+
| Field            | Type        | Null | Key  | Default | Extra |
+------------------+-------------+------+------+---------+-------+``
| base_occupation  | varchar(32) | YES  |      |         |       |
| base_last_name   | varchar(64) | YES  |      |         |       |
| base_id          | int         | YES  |      |         |       |
| base_first_name  | varchar(32) | YES  |      |         |       |
| base_age         | int         | YES  |      |         |       |
| our_occupation   | varchar(32) | YES  |      |         |       |
| our_last_name    | varchar(64) | YES  |      |         |       |
| our_id           | int         | YES  |      |         |       |
| our_first_name   | varchar(32) | YES  |      |         |       |
| our_age          | int         | YES  |      |         |       |
| their_occupation | varchar(32) | YES  |      |         |       |
| their_last_name  | varchar(64) | YES  |      |         |       |
| their_id         | int         | YES  |      |         |       |
| their_first_name | varchar(32) | YES  |      |         |       |
| their_age        | int         | YES  |      |         |       |
+------------------+-------------+------+------+---------+-------+

SELECT * FROM dolt_conflicts_people;
+-----------------+----------------+---------+-----------------+----------+----------------+---------------+--------+----------------+---------+------------------+-----------------+----------+------------------+-----------+
| base_occupation | base_last_name | base_id | base_first_name | base_age | our_occupation | our_last_name | our_id | our_first_name | our_age | their_occupation | their_last_name | their_id | their_first_name | their_age |
+-----------------+----------------+---------+-----------------+----------+----------------+---------------+--------+----------------+---------+------------------+-----------------+----------+------------------+-----------+
| Homemaker       | Simpson        |       1 | Marge           |       37 | Homemaker      | Simpson       |      1 | Marge          |      36 | NULL             | NULL            |     NULL | NULL             |      NULL |
| Bartender       | Szslak         |       2 | Moe             |     NULL | Bartender      | Szslak        |      2 | Moe            |      62 | Bartender        | Szslak          |        2 | Moe              |        60 |
| NULL            | NULL           |    NULL | NULL            |     NULL | Student        | Simpson       |      3 | Bart           |      10 | Student          | Simpson         |        3 | Lisa             |         8 |
+-----------------+----------------+---------+-----------------+----------+----------------+---------------+--------+----------------+---------+------------------+-----------------+----------+------------------+-----------+
```

For each column in the database table, the `conflicts` table has three
columns: one for `base`, one for `ours` and one for `theirs`. These
represent the three different values you might choose to resolve the
conflict (either the common commit ancestor's values, the current
table values, or the merged table values).

### Resolving conflicts

To commit your transaction, you must first resolve the merge conflicts
by deleting every row in every `dolt_conflicts` system table. This
signals to Dolt that you have resolved every merge conflict to your
satisfaction. There are several different strategies you could use,
which you must repeat for every table in conflict.

#### Take ours

To use the values in the current working set (rather than the merged
values), simply delete from the `dolt_conflicts` table without
changing anything else.

```sql
DELETE FROM dolt_conflicts_people;
```

#### Take theirs

To use the merged values, overwriting our own, `REPLACE` and `DELETE`
rows from the table using the conflicts table:

```sql
-- Replace existing rows with rows taken with their_* values as long 
-- as their_id is not null (rows deleted in theirs)
REPLACE INTO people (id,first_name,last_name,age) (
    SELECT their_id, their_first_name, their_last_name, their_age
    FROM dolt_conflicts_people
    WHERE their_id IS NOT NULL
);

-- Delete any rows that are deleted in theirs
DELETE FROM PEOPLE WHERE id IN (
    SELECT base_id
    FROM dolt_conflicts
    WHERE base_id IS NOT NULL AND their_id IS NULL
);

-- mark conflicts resolved
DELETE FROM dolt_conflicts_people;
```

#### Custom logic

It's also possible that you want your users to resolve conflicts
themselves by picking which of the conflicting values to use for each
row in conflict. You can build this workflow, or any other custom
logic you want, with the SQL primitives above.

### Commiting with conflicts

By default, Dolt will allow you to commit transactions that have
conflicts. Anyone else connected to the same branch will see these
conflicts as well once you commit the transaction.  In a multi user
environment, it may be necessary to prevent clients from committing
working sets that contain conflicts. To force clients to resolve
conflicts before committing their SQL transactions, set this system
variable to off:

```sql
set GLOBAL @@dolt_allow_commit_conflicts = 0;
```

The server will not allow you to create new Dolt commits (with the
[`dolt_commit()` system function](./dolt-sql-functions.md#dolt_commit)
or with the [`@@dolt_transaction_commit` system
variable](./dolt-sysvars.md#dolt_transaction_commit)) if the working
set has conflicts. You must resolve conflicts before creating a Dolt
commit.
