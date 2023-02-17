# Merges

## Merging branches

To merge a branch into your current branch, use the [`DOLT_MERGE()` procedure](dolt-sql-procedures.md#dolt\_merge):

```sql
CALL DOLT_MERGE('feature-branch');
```

Usually, you will want to start a transaction before calling the procedure:

```sql
START TRANSACTION;
```

Merge can produce errors that need to be addressed before a transaction is committed. Opening a transaction allows these errors to be resolved by the client. If merge produces an error in `AUTOCOMMIT` mode, the transaction will be automatically rolled back and any merged tables will be reset.

The two errors that merge can produce are conflicts and constraint-violations. If either error exists post-merge, the `conflicts` column will be set to `1`:

```
+--------------+-----------+
| fast_forward | conflicts |
+--------------+-----------+
| 0            | 1         |
+--------------+-----------+
```

If no conflicts/constraint-violations were encountered, the current transaction will be completed, and a commit will be made. You can check the status of a merge using the [dolt\_merge\_status](dolt-system-tables.md#doltmergestatus) system table:

```
> SELECT * from DOLT_MERGE_STATUS;
+------------+--------+---------------+--------+-----------------+
| is_merging | source | source_commit | target | unmerged_tables |
+------------+--------+---------------+--------+-----------------+
| false      | NULL   | NULL          | NULL   | NULL            |
+------------+--------+---------------+--------+-----------------+
```

If conflicts/constraint-violations were encountered, the current transaction will be left incomplete and you should resolve them using the instructions below. Once resolved, you will need to make a dolt commit.

## Conflicts

Merging branches can create [conflicts](../../concepts/dolt/git/conflicts.md), which you must resolve before you can commit your transaction. If a merge creates conflicts, the `DOLT_MERGE()` function will return a non-zero result in the conflicts column.

Merges can generate conflicts on schema or data.

### Schema

Merges with schema conflicts cannot be resolved using SQL. The merge will fail. For instance a merge that adds the same column name with two different types will fail.

```sql
CALL DOLT_MERGE('schema-change');
Error 1105: schema conflicts for table test:
	two columns with the name 'c2'
```

### Data

Merges with data conflicts can be resolved using SQL. Conflicts must be resolved in the same SQL transaction by default. You can find which tables are in conflict by querying the `dolt_conflicts` system table:

```sql
SELECT * FROM dolt_conflicts;
+--------+---------------+
| table  | num_conflicts |
+--------+---------------+
| people |             3 |
+--------+---------------+
```

Each database table has an associated `dolt_conflicts` table, which you can `SELECT`, `UPDATE` and `DELETE` rows from to examine and resolve conflicts. For the hypothetical `people` table above, the conflict table looks like this:

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

For each column in the database table, the `conflicts` table has three columns: one for `base`, one for `ours` and one for `theirs`. These represent the three different values you might choose to resolve the conflict (either the common commit ancestor's values, the current table values, or the merged table values).

### Resolving conflicts

To commit your transaction, you must first resolve the merge conflicts by deleting every row in every `dolt_conflicts` system table. This signals to Dolt that you have resolved every merge conflict to your satisfaction. There are several different strategies you could use, which you must repeat for every table in conflict.

#### Take ours

To use the values in the current working set (rather than the merged values), simply delete from the `dolt_conflicts` table without changing anything else.

```sql
DELETE FROM dolt_conflicts_people;
```

#### Take theirs

To use the merged values, overwriting our own, `REPLACE` and `DELETE` rows from the table using the conflicts table:

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

It's also possible to modify a table through the `dolt_conflicts_$table_name` table. If you update any column prefixed with `our_`, that will update the corresponding rows in the source table. This allows the `REPLACE` statement above to be re-written as:

```sql
UPDATE dolt_conflicts_people
SET    our_first_name = their_first_name,
       our_last_name = their_last_name,
       our_age = their_age
WHERE  their_id IS NOT NULL;
```

See [dolt\_conflicts\_$tablename](dolt-system-tables.md#dolt\_conflicts\_usdtablename) for details.

#### Custom logic

It's also possible that you want your users to resolve conflicts themselves by picking which of the conflicting values to use for each row in conflict. You can build this workflow, or any other custom logic you want, with the SQL primitives above.

### Committing with merge conflicts

By default, Dolt will not allow you to commit transactions that have merge conflicts, and will automatically rollback any transaction with merge conflicts when you attempt to `COMMIT` it. However, there may be times when you need to commit merge conflicts, for example to collaborate on resolving them with other people. To allow committing merge conflicts, change this system variable to `1` for every client that needs to commit merge conflicts:

```sql
set @@dolt_allow_commit_conflicts = 1;
```

The server will not allow you to create new Dolt commits (with the [`dolt_commit()` system function](dolt-sql-functions.md#dolt\_commit) or with the [`@@dolt_transaction_commit` system variable](dolt-sysvars.md#dolt\_transaction\_commit)) if the working set has conflicts. You must resolve conflicts before creating a Dolt commit.

## Constraint violations

If any table in your database contains foreign key constraints or unique key constraints, it's possible that a merge will create constraint violations. When this occurs, the `conflicts` column will be set to `1`.

Let's walk through an example for foreign key constraints.

### Foreign Key Constraint Violations

Imagine we have a parent table and a child table with this schema:

```sql
CREATE TABLE parent (pk INT PRIMARY KEY);
CREATE TABLE child (
    pk INT PRIMARY KEY, 
    parent_fk INT, 
    FOREIGN KEY (parent_fk) REFERENCES parent (pk)
);
```

Let's create a situation where a merge adds a child to a parent that no longer exists:

```sql
INSERT INTO parent values (1);
CALL DOLT_COMMIT('-Am', 'setup');

CALL DOLT_CHECKOUT('-b', 'branch_to_merge');
INSERT INTO child values (1, 1);
CALL DOLT_COMMIT('-Am', 'add a child of parent 1');

CALL DOLT_CHECKOUT('main');
DELETE from parent where pk = 1;
CALL DOLT_COMMIT('-Am', 'delete parent 1');
```

When we merge, we see the `conflict` column has been set:

```sql
> START TRANSACTION;
> CALL DOLT_MERGE('branch_to_merge');
+--------------+-----------+
| fast_forward | conflicts |
+--------------+-----------+
| 0            | 1         |
+--------------+-----------+
```

And we can inspect what the constraint violations are using the [dolt\_constraint\_violations](dolt-system-tables.md#doltconstraintviolations) system table:

```sql
> SELECT * from dolt_constraint_violations;
+-------+----------------+
| table | num_violations |
+-------+----------------+
| child | 1              |
+-------+----------------+

> select violation_type, pk, parent_fk from dolt_constraint_violations_child;
+----------------+----+-----------+
| violation_type | pk | parent_fk |
+----------------+----+-----------+
| foreign key    | 1  | 1         |
+----------------+----+-----------+
```

Then we can fix the violation, clear it, and complete the merge:

```sql
DELETE from child where pk = 1;
DELETE from dolt_constraint_violations_child;

CALL DOLT_COMMIT('-Am', 'merge branch_to_merge into main');
```
