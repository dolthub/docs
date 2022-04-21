---
title: Dolt SQL Functions
---

# Table of Contents

* [Dolt SQL Functions](#dolt-sql-functions)
  * [dolt\_add()](#dolt_add)
  * [dolt\_checkout()](#dolt_checkout)
  * [dolt\_commit()](#dolt_commit)
  * [dolt\_fetch()](#dolt_fetch)
  * [dolt\_merge()](#dolt_merge)
  * [dolt\_pull()](#dolt_pull)
  * [dolt\_push()](#dolt_push)
  * [dolt\_reset()](#dolt_reset)
  
* [Dolt Commit Metadata SQL Functions](#dolt-commit-metadata-sql-functions)
  * [dolt\_merge\_base()](#dolt_merge_base)
  * [hashof()](#hashof)

* [Dolt Table Functions](#dolt-table-functions)
  * [dolt_diff()](#dolt_diff)

# Dolt SQL Functions

Dolt provides SQL functions to allow access to `dolt` CLI 
commands from within a SQL session. Each function is named after the
`dolt` command line command it matches, and takes arguments in an
identical form.

For example, `dolt checkout -b feature-branch` is equivalent to
executing the following SQL statement:

```sql
SELECT DOLT_CHECKOUT('-b', 'feature-branch');
```

SQL functions are provided for all imperative CLI commands. For
commands that inspect the state of the database and print some
information, (`dolt diff`, `dolt log`, etc.) [system
tables](dolt-system-tables.md) are provided instead.

One important note: all functions modify state only for the current
session, not for all clients. So for example, whereas running `dolt
checkout feature-branch` will change the working HEAD for anyone who
subsequently runs a command from the same dolt database directory,
running `SELECT DOLT_CHECKOUT('feature-branch')` only changes the
working HEAD for that database session. The right way to think of this
is that the command line environment is effectively a session, one
that happens to be shared with whomever runs CLI commands from that
directory.


## `DOLT_ADD()`

Adds working changes to staged for this session. Works exactly like
`dolt add` on the CLI, and takes the same arguments.

After adding tables to the staged area, they can be committed with
`DOLT_COMMIT()`.

```sql
SELECT DOLT_ADD('-A');
SELECT DOLT_ADD('.');
SELECT DOLT_ADD('table1', 'table2');
```

### Options

`table`: Table\(s\) to add to the list tables staged to be
committed. The abbreviation '.' can be used to add all tables.

`-A`: Stages all tables with changes.

### Example

```sql
-- Set the current database for the session
USE mydb;

-- Make modifications
UPDATE table
SET column = "new value"
WHERE pk = "key";

-- Stage all changes.
SELECT DOLT_ADD('-a');

-- Commit the changes.
SELECT DOLT_COMMIT('-m', 'committing all changes');
```

## `DOLT_CHECKOUT()`

Switches this session to a different branch.

With table names as arguments, restores those tables to their contents
in the current HEAD.

When switching to a different branch, your session state must be
clean. `COMMIT` or `ROLLBACK` any changes before switching to a
different branch.

```sql
SELECT DOLT_CHECKOUT('-b', 'my-new-branch');
SELECT DOLT_CHECKOUT('my-existing-branch');
SELECT DOLT_CHECKOUT('my-table');
```

### Options

`-b`: Create a new branch with the given name.

### Example

```sql
-- Set the current database for the session
USE mydb;

-- Create and checkout to a new branch.
SELECT DOLT_CHECKOUT('-b', 'feature-branch');

-- Make modifications
UPDATE table
SET column = "new value"
WHERE pk = "key";

-- Stage and commit all  changes.
SELECT DOLT_COMMIT('-a', '-m', 'committing all changes');

-- Go back to main
SELECT DOLT_CHECKOUT('main');
```


## `DOLT_COMMIT()`

Commits staged tables to HEAD. Works exactly like `dolt commit` with
each value directly following the flag.

`DOLT_COMMIT()` also commits the current transaction.

```sql
SELECT DOLT_COMMIT('-a', '-m', 'This is a commit');
SELECT DOLT_COMMIT('-m', 'This is a commit');
SELECT DOLT_COMMIT('-m', 'This is a commit', '--author', 'John Doe <johndoe@example.com>');
```

### Options

`-m`, `--message`: Use the given `<msg>` as the commit message. **Required**

`-a`: Stages all tables with changes before committing

`--allow-empty`: Allow recording a commit that has the exact same data
as its sole parent. This is usually a mistake, so it is disabled by
default. This option bypasses that safety.

`--date`: Specify the date used in the commit. If not specified the
current system time is used.

`--author`: Specify an explicit author using the standard "A U Thor
author@example.com" format.

### Examples

```sql
-- Set the current database for the session
USE mydb;

-- Make modifications
UPDATE table
SET column = "new value"
WHERE pk = "key";

-- Stage all changes and commit.
SELECT DOLT_COMMIT('-a', '-m', 'This is a commit', '--author', 'John Doe <johndoe@example.com>');
```


## `DOLT_FETCH()`

Fetch refs, along with the objects necessary to complete their histories
and update remote-tracking branches. Works exactly like `dolt fetch` on
the CLI, and takes the same arguments.

```sql
SELECT DOLT_FETCH('origin', 'main');
SELECT DOLT_FETCH('origin', 'feature-branch');
SELECT DOLT_FETCH('origin', 'refs/heads/main:refs/remotes/origin/main');
```

### Options

`--force`: Update refs to remote branches with the current state of the
remote, overwriting any conflicting history

### Example

```sql
-- Get remote main
SELECT DOLT_FETCH('origin', 'main');

-- Inspect the hash of the fetched remote branch
SELECT HASHOF('origin/main');

-- Merge remote main with current branch
SELECT DOLT_MERGE('origin/main');
```


## `DOLT_MERGE()`

Incorporates changes from the named commits \(since the time their
histories diverged from the current branch\) into the current
branch. Works exactly like `dolt merge` on the CLI, and takes the same
arguments.

Any resulting merge conflicts must be resolved before the transaction
can be committed or a new Dolt commit created.

```sql
SELECT DOLT_MERGE('feature-branch'); -- Optional --squash parameter
SELECT DOLT_MERGE('feature-branch', '-no-ff', '-m', 'This is a msg for a non fast forward merge');
SELECT DOLT_MERGE('--abort');
```

### Options

`--no-ff`: Create a merge commit even when the merge resolves as a fast-forward.

`--squash`: Merges changes to the working set without updating the
commit history

`-m <msg>, --message=<msg>`: Use the given as the commit message. This
is only useful for --non-ff commits.

`--abort`: Abort the current conflict resolution process, and try to
reconstruct the pre-merge state.

When merging a branch, your session state must be clean. `COMMIT`
or`ROLLBACK` any changes, then `DOLT_COMMIT()` to create a new dolt
commit on the target branch.

If the merge causes conflicts or constraint violations, you must
resolve them using the `dolt_conflicts` system tables before the
transaction can be committed. See [Dolt system
tables](dolt-system-tables.md##dolt_conflicts_usdtablename) for
details.

### Example

```sql
-- Set the current database for the session
USE mydb;

-- Create and checkout to a new branch.
SELECT DOLT_CHECKOUT('-b', 'feature-branch');

-- Make modifications
UPDATE table
SET column = "new value"
WHERE pk = "key";

-- Stage and commit all  changes.
SELECT DOLT_COMMIT('-a', '-m', 'committing all changes');

-- Go back to main
SELECT DOLT_MERGE('feature-branch');
```


## `DOLT_RESET()`

Resets staged tables to their HEAD state. Works exactly like `dolt reset` on the CLI, and takes the same arguments.

Like other data modifications, after a reset you must `COMMIT` the
transaction for any changes to affected tables to be visible to other
clients.

```sql
SELECT DOLT_RESET('--hard');
SELECT DOLT_RESET('my-table'); -- soft reset
```

### Options

`--hard`: Resets the working tables and staged tables. Any changes to
tracked tables in the working tree since <commit> are discarded.

`--soft`: Does not touch the working tables, but removes all tables
staged to be committed. This is the default behavior.

### Example

```sql
-- Set the current database for the session
USE mydb;

-- Make modifications
UPDATE table
SET column = "new value"
WHERE pk = "key";

-- Reset the changes permanently.
SELECT DOLT_RESET('--hard');

-- Makes some more changes.
UPDATE table
SET column = "new value"
WHERE pk = "key";

-- Stage the table.
SELECT DOLT_ADD('table')

-- Unstage the table.
SELECT DOLT_RESET('table')
```

## `DOLT_PUSH()`

Updates remote refs using local refs, while sending objects necessary to
complete the given refs. Works exactly like `dolt push` on the CLI, and
takes the same arguments.

```sql
SELECT DOLT_PUSH('origin', 'main');
SELECT DOLT_PUSH('--force', 'origin', 'main');
```

### Options

`--force`: Update the remote with local history, overwriting any conflicting history in the remote.

### Example

```sql
-- Checkout new branch
SELECT DOLT_CHECKOUT('-b', 'feature-branch');

-- Add a table
CREATE TABLE test (a int primary key);

-- Create commit
SELECT DOLT_COMMIT('-a', '-m', 'create table test');

-- Push to remote
SELECT DOLT_PUSH('origin', 'feature-branch');
```


## `DOLT_PULL()`

Fetch from and integrate with another database or a local branch. In
its default mode, `dolt pull` is shorthand for `dolt fetch` followed by
`dolt merge <remote>/<branch>`. Works exactly like `dolt pull` on the
CLI, and takes the same arguments.

Any resulting merge conflicts must be resolved before the transaction
can be committed or a new Dolt commit created.

```sql
SELECT DOLT_PULL('origin');
SELECT DOLT_PULL('feature-branch', '--force');
```

### Options

`--no-ff`: Create a merge commit even when the merge resolves as a fast-forward.

`--squash`: Merges changes to the working set without updating the
commit history

`--force`: Ignores any foreign key warnings and proceeds with the commit.

When merging a branch, your session state must be clean. `COMMIT`
or`ROLLBACK` any changes, then `DOLT_COMMIT()` to create a new dolt
commit on the target branch.

If the merge causes conflicts or constraint violations, you must
resolve them using the `dolt_conflicts` system tables before the
transaction can be committed. See [Dolt system
tables](dolt-system-tables.md##dolt_conflicts_usdtablename) for
details.

### Example

```sql
-- Update local working set with remote changes
SELECT DOLT_PULL('origin');

-- View a log of new commits
SELECT * FROM dolt_log LIMIT 5;
```

# Dolt Commit Metadata SQL Functions

Dolt also provides SQL functions that have no command line equivalent.  

## `DOLT_MERGE_BASE()`

`DOLT_MERGE_BASE()` returns the hash of the common ancestor between
two branches. Given the following branch structure:

Consider the following branch structure:

```text
      A---B---C feature
     /
D---E---F---G main
```

The following would return the hash of commit `E`:

```sql
SELECT DOLT_MERGE_BASE('feature', 'main');
```

## `HASHOF()`

The HASHOF function returns the commit hash of a branch,
e.g. `HASHOF("main")`.

# Dolt Table Functions

Table functions operate like regular SQL functions, but instead of returning a single, scalar value, a
table function returns rows of data, just like a table. Dolt's table function support is currently limited
to only the `DOLT_DIFF()` function and table functions have several restrictions in how they can be used in 
queries. For example, you cannot currently alias a table function or join a table function with another table
or table function. 

## `DOLT_DIFF()`

The `DOLT_DIFF()` table function calculates the differences in a table's data at any two commits in the database.
Each row in the result set describes how a row in the underlying table has changed between the two commits,
including the row's values at to and from commits and the type of change (i.e. `added`, `modified`, or `removed`).
`DOLT_DIFF()` is an alternative to the 
[`dolt_commit_diff_$tablename` system table](dolt-system-tables.md#dolt_commit_diff_usdtablename).
You should generally prefer the system tables when possible, since they have less restrictions on use. 
However, some use cases, such as viewing a table data diff containing schema changes, can be easier to view 
with the `DOLT_DIFF` table function.  

The main difference between the results of the `DOLT_DIFF()` table function and the `dolt_commit_diff_$tablename`
system table is the schema of the returned results. `dolt_commit_diff_$tablename` generates the resulting schema
based on the table's schema at the currently checked out branch. `DOLT_DIFF()` will use the schema at the `from_commit`
for the `from_` columns and the schema at the `to_commit` for the `to_` columns. This can make it easier to view 
diffs where the schema of the underlying table has changed. 

Note that the `DOLT_DIFF()` table function currently has restrictions on how it can be used in queries. It does not
support aliasing or joining with other tables, and argument values must currently be literal values. 

### Options

```sql
DOLT_DIFF(<tablename>, <from_revision>, <to_revision>)
```
The `DOLT_DIFF()` table function takes three required arguments:
* `tablename`  —  the name of the table containing the data to diff
* `from_revision`  — the revision of the table data for the start of the diff. This may be a commit, tag, branch name, or other revision specifier (e.g. "main~").
* `to_revision`    — the revision of the table data for the end of the diff. This may be a commit, tag, branch name, or other revision specifier (e.g. "main~").

### Schema 

```text
+------------------+----------+
| field            | type     |
+------------------+----------+
| from_commit      | TEXT     |
| from_commit_date | DATETIME |
| to_commit        | TEXT     |
| to_commit_date   | DATETIME |
| diff_type        | TEXT     |
| other cols       |          |
+------------------+----------+
```

The remaining columns are dependent on the schema of the user table as it existed at the `from_commit` and at 
the `to_commit`. For every column `X` in your table at the `from_commit` revision, there is a column in the result 
set named `from_X`. Likewise, for every column `Y` in your table at the `to_commit` revision, there is a column
in the result set named `to_Y`. This is the major difference between the `DOLT_DIFF()` table function and the
`dolt_commit_diff_$tablename` system table – `DOLT_DIFF()` uses the two schemas at the `to_commit` and 
`from_commit` revisions to form the to and from columns of the result set, while `dolt_commit_diff_$tablename` uses
only the table schema of the currently checked out branch to form the to and from columns of the result set.   

### Example 

Consider a table named `inventory` in a database with two branches: `main` and `feature_branch`. We can use the
`DOLT_DIFF()` function to calculate a diff of the table data from the `main` branch to the `feature_branch` branch
to see how our data has changed on the feature branch. 

Here is the schema of `inventory` at the tip of `main`:
```text
+----------+------+
| field    | type |
+----------+------+
| pk       | int  |
| name     | text |
| quantity | int  |
+----------+------+
```

Here is the schema of `inventory` at the tip of `feature_branch`:
```text
+----------+------+
| field    | type |
+----------+------+
| pk       | int  |
| name     | text |
| color    | text |
| size     | int  |
+----------+------+
```

Based on the schemas at the two revision above, the resulting schema from `DOLT_DIFF()` will be:
```text
+------------------+----------+
| field            | type     |
+------------------+----------+
| from_pk          | int      |
| from_name        | text     |
| from_quantity    | int      |
| from_commit      | TEXT     |
| from_commit_date | DATETIME |
| to_pk            | int      |
| to_name          | text     |
| to_color         | text     |
| to_size          | int      |
| to_commit        | TEXT     |
| to_commit_date   | DATETIME |
| diff_type        | text     |
+------------------+----------+
```

To calculate the diff and view the results, we run the following query: 

```sql
SELECT * FROM DOLT_DIFF("inventory", "main", "feature_branch")
```

The results from `DOLT_DIFF()` show how the data has changed going from `main` to `feature_branch`:
```text
+---------+-------+---------+----------+----------------+-----------------------------------+-----------+---------+---------------+-------------+-----------------------------------+-----------+
| to_name | to_pk | to_size | to_color | to_commit      | to_commit_date                    | from_name | from_pk | from_quantity | from_commit | from_commit_date                  | diff_type |
+---------+-------+---------+----------+----------------+-----------------------------------+-----------+---------+---------------+-------------+-----------------------------------+-----------+
| shirt   | 1     | 15      | false    | feature_branch | 2022-03-23 18:57:38.476 +0000 UTC | shirt     | 1       | 70            | main        | 2022-03-23 18:51:48.333 +0000 UTC | modified  |
| shoes   | 2     | 9       | brown    | feature_branch | 2022-03-23 18:57:38.476 +0000 UTC | shoes     | 2       | 200           | main        | 2022-03-23 18:51:48.333 +0000 UTC | modified  |
| pants   | 3     | 30      | blue     | feature_branch | 2022-03-23 18:57:38.476 +0000 UTC | pants     | 3       | 150           | main        | 2022-03-23 18:51:48.333 +0000 UTC | modified  |
| hat     | 4     | 6       | grey     | feature_branch | 2022-03-23 18:57:38.476 +0000 UTC | NULL      | NULL    | NULL          | main        | 2022-03-23 18:51:48.333 +0000 UTC | added     |
+---------+-------+---------+----------+----------------+-----------------------------------+-----------+---------+---------------+-------------+-----------------------------------+-----------+
```

