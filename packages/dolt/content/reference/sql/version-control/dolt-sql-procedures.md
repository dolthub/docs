---
title: Dolt SQL Procedures
---

# Table of Contents

- [Dolt SQL Procedures](#dolt-sql-procedures)
  - [dolt_add()](#dolt_add)
  - [dolt_backup()](#dolt_backup)
  - [dolt_branch()](#dolt_branch)
  - [dolt_checkout()](#dolt_checkout)
  - [dolt_cherry_pick()](#dolt_cherry_pick)
  - [dolt_clean()](#dolt_clean)
  - [dolt_clone()](#dolt_clone)
  - [dolt_commit()](#dolt_commit)
  - [dolt_conflicts_resolve()](#dolt_conflicts_resolve)
  - [dolt_fetch()](#dolt_fetch)
  - [dolt_gc()](#dolt_gc)
  - [dolt_merge()](#dolt_merge)
  - [dolt_pull()](#dolt_pull)
  - [dolt_purge_dropped_databases()](#dolt_purge_dropped_databases)
  - [dolt_push()](#dolt_push)
  - [dolt_rebase()](#dolt_rebase)
  - [dolt_remote()](#dolt_remote)
  - [dolt_reset()](#dolt_reset)
  - [dolt_revert()](#dolt_revert)
  - [dolt_tag()](#dolt_tag)
  - [dolt_undrop()](#dolt_undrop)
  - [dolt_verify_constraints()](#dolt_verify_constraints)
- [Access Control](#access-control)
# Dolt SQL Procedures

Dolt provides native stored procedures to allow access to `dolt` CLI
commands from within a SQL session. Each procedure is named after the
`dolt` command line command it matches, and takes arguments in an
identical form.

For example, `dolt checkout -b feature-branch` is equivalent to
executing the following SQL statement:

```sql
CALL DOLT_CHECKOUT('-b', 'feature-branch');
```

SQL procedures are provided for all imperative CLI commands. For
commands that inspect the state of the database and print some
information, (`dolt diff`, `dolt log`, etc.) [system
tables](dolt-system-tables.md) are provided instead.

One important note: all procedures modify state only for the current
session, not for all clients. So for example, whereas running `dolt checkout feature-branch` will change the working HEAD for anyone who
subsequently runs a command from the same dolt database directory,
running `CALL DOLT_CHECKOUT('feature-branch')` only changes the
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
CALL DOLT_ADD('-A');
CALL DOLT_ADD('.');
CALL DOLT_ADD('table1', 'table2');
```

### Options

`table`: Table\(s\) to add to the list tables staged to be
committed. The abbreviation '.' can be used to add all tables.

`-A`: Stages all tables with changes.

### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

### Example

```sql
-- Set the current database for the session
USE mydb;

-- Make modifications
UPDATE table
SET column = "new value"
WHERE pk = "key";

-- Stage all changes.
CALL DOLT_ADD('-A');

-- Commit the changes.
CALL DOLT_COMMIT('-m', 'committing all changes');
```

## `DOLT_BACKUP()`

Sync with a configured backup. Other backup commands not supported
via SQL yet.

```sql
CALL DOLT_BACKUP('sync', 'name');
```

### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

### Example

```sql
-- Set the current database for the session
USE mydb;

-- Upload the current database contents to the named backup
CALL dolt_backup('sync', 'my-backup')
```

## `DOLT_BRANCH()`

Create, delete, and rename branches.

To list branches, use the [`DOLT_BRANCHES` system table](dolt-system-tables.md#dolt_branches), instead of the `DOLT_BRANCH()` stored procedure.

To look up the current branch, use the [`@@<dbname>_head_ref` system variable](dolt-sysvars.md#dbname_head_ref), or the `active_branch()` SQL function, as shown in the examples section below.

WARNING: In a multi-session server environment, Dolt will prevent you from deleting or renaming a branch in use in another session. You can force renaming or deletion by passing the `--force` option, but be aware that active clients on other sessions will no longer be able to execute statements after their active branch is removed and will need to end their session and reconnect.

```sql
-- Create a new branch from the current HEAD
CALL DOLT_BRANCH('myNewBranch');

-- Create a new branch from start point of tip of feature1 branch.
CALL DOLT_BRANCH('myNewBranch', 'feature1');

-- Create a new branch by copying an existing branch
-- Will fail if feature1 branch already exists
CALL DOLT_BRANCH('-c', 'main', 'feature1');

-- Create or replace a branch by copying an existing branch
-- '-f' forces the copy, even if feature1 branch already exists
CALL DOLT_BRANCH('-c', '-f', 'main', 'feature1');

-- Delete a branch
CALL DOLT_BRANCH('-d', 'branchToDelete');

-- Rename a branch
CALL DOLT_BRANCH('-m', 'currentBranchName', 'newBranchName')
```

{% hint style="info" %}

### Notes

Branch names have a few restrictions which are similar to the constraints Git puts on branch names. Dolt's branches are a little more restrictive, as [ASCII](https://en.wikipedia.org/wiki/ASCII) characters are required. Rules are as follows:

- All characters must be ASCII (7 Bit)
- May not start with '.' (period)
- May not contain '..' (two periods)
- May not contain '@{'
- May not contain ASCII control characters
- May not contain characters: ':', '?', '\[', '\\', '^', '~', '*'
- May not contain whitespace (spaces, tabs, newlines)
- May not end with '/'
- May not end with '.lock'
- May not be HEAD (case insensitive)
- May not be indistinguishable from a commit hash. 32 characters, where all characters are 0-9 or a-z (case sensitive)


The `dolt_branch()` procedure implicitly commits the current transaction and begins a new one.

{% endhint %}

### Options

`-c`, `--copy`: Create a copy of a branch. Must be followed by the name of the source branch to copy and the name of the new branch to create. Without the `--force` option, the copy will fail if the new branch already exists.

`-m`, `--move`: Move/rename a branch. Must be followed by the current name of an existing branch and a new name for that branch. Without the `--force` option, renaming a branch in use on another server session will fail. Be aware that forcibly renaming or deleting a branch in use in another session will require that session to disconnect and reconnect before it can execute statements again.

`-d`, `--delete`: Delete a branch. Must be followed by the name of an existing branch to delete. Without the `--force` option, deleting a branch in use on another server session will fail. Be aware that forcibly renaming or deleting a branch in use in another session will require that session to disconnect and reconnect before it can execute statements again.

`-f`, `--force`: When used with the `--copy` option, allows for recreating a branch from another branch, even if the branch already exists. When used with the `--move` or `--delete` options, force will allow you to rename or delete branches in use in other active server sessions, but be aware that this will require those other sessions to disconnect and reconnect before they can execute statements again.

`-D`: Shortcut for `--delete --force`.

### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

### Examples

```sql
-- List the available branches
SELECT * FROM DOLT_BRANCHES;
+--------+----------------------------------+
| name   | hash                             |
+--------+----------------------------------+
| backup | nsqtc86d54kafkuf0a24s4hqircvg68g |
| main   | dvtsgnlg7n9squriob3nq6kve6gnhkf2 |
+--------+----------------------------------+

-- Create a new branch for development work from the tip of head and switch to it
CALL DOLT_BRANCH('myNewFeature');
CALL DOLT_CHECKOUT('myNewFeature');

-- View your current branch
select active_branch();
+----------------+
| active_branch  |
+----------------+
| myNewFeature   |
+----------------+

-- Create a new branch from an existing branch
CALL DOLT_BRANCH('-c', 'backup', 'bugfix-3482');

-- Rename a branch
CALL DOLT_BRANCH('-m', 'bugfix-3482', 'critical-bugfix-3482');

-- Delete a branch
CALL DOLT_BRANCH('-d', 'old-unused-branch');
```

## `DOLT_CHECKOUT()`

Switches this session to a different branch.

With table names as arguments, restores those tables to their contents
in the current HEAD.

Note, unlike the Git command-line, if you have a modified working set, those changes remain on the
branch you modified after a `DOLT_CHECKOUT()`. Uncommitted changes in the working set do not
transfer to the checked out branch as on the command line. We modified this behavior in the SQL
context because multiple users may be connected to the same branch. Having one user bring changes
from various other branches with them when they switch branches is too disruptive in the
multi-tenant SQL context.

```sql
CALL DOLT_CHECKOUT('-b', 'my-new-branch');
CALL DOLT_CHECKOUT('my-existing-branch');
CALL DOLT_CHECKOUT('my-table');
```

{% hint style="info" %}

### Notes

`DOLT_CHECKOUT()` with a branch argument has two side effects on your session state:

1. The session's current database, as returned by `SELECT DATABASE()`, is now the unqualified
   database name.
2. For the remainder of this session, references to the unqualified name of this database will
   resolve to the branch checked out.

See the comments after the statements below for an example of this behavior, and also read [Using
Branches](./branches.md)

{% endhint %}

```sql
set autocommit = on;
use mydb/branch1; -- current db is now `mydb/branch1`
insert into t1 values (1); -- modifying the `branch1` branch
call dolt_checkout('branch2'); -- current db is now `mydb`
insert into t1 values (2); -- modifying the `branch2` branch
use mydb/branch3; -- current db is now `mydb/branch3`
insert into mydb.t1 values (3); -- modifying the `branch2` branch
```

### Options

`-b`: Create a new branch with the given name.

`-B`: Similar to `-b`, but will move a branch if it already exists.

`-t`: When creating a new branch, set up 'upstream' configuration.

### Output Schema

```text
+---------+------+-----------------------------+
| Field   | Type | Description                 |
+---------+------+-----------------------------+
| status  | int  | 0 if successful, 1 if not   |
| message | text | success/failure information |
+---------+------+-----------------------------+
```

### Example

```sql
-- Set the current database for the session
USE mydb;

-- Create and checkout to a new branch.
CALL DOLT_CHECKOUT('-b', 'feature-branch');

-- Make modifications
UPDATE table
SET column = "new value"
WHERE pk = "key";

-- Stage and commit all  changes.
CALL DOLT_COMMIT('-a', '-m', 'committing all changes');

-- Go back to main
CALL DOLT_CHECKOUT('main');
```

## `DOLT_CHERRY_PICK()`

Apply the changes introduced by an existing commit.

Apply changes from existing commit and creates a new commit from the current HEAD.

Works exactly like [`dolt cherry-pick` command](../../cli/cli.md#dolt-cherry-pick) on the CLI,
and has the same notes and limitations.

```sql
CALL DOLT_CHERRY_PICK('my-existing-branch~2');
CALL DOLT_CHERRY_PICK('qj6ouhjvtrnp1rgbvajaohmthoru2772');
```

### Options

No options for this procedure.

### Output Schema

```text
+-----------------------+------+---------------------------------+
| Field                 | Type | Description                     |
+-----------------------+------+---------------------------------+
| hash                  | text | hash of the applied commit      |
| data_conflicts        | int  | number of data conflicts        |
| schema_conflicts      | int  | number of schema conflicts      |
| constraint_violations | int  | number of constraint violations |
+-----------------------+------+---------------------------------+
```

### Example

For the below example consider the following set up of `main` and `mybranch` branches:

```sql
-- Checkout main branch
CALL DOLT_CHECKOUT('main');

-- View a log of commits
SELECT commit_hash, message FROM dolt_log;
+----------------------------------+----------------------------+
| commit_hash                      | message                    |
+----------------------------------+----------------------------+
| 7e2q0hibo2m2af874i4e7isgnum74j4m | create a new table         |
| omuqq67att6vfnka94drdallu4983gnr | Initialize data repository |
+----------------------------------+----------------------------+
2 rows in set (0.00 sec)

-- View the table
SELECT * FROM mytable;
Empty set (0.00 sec)

-- Checkout new branch
CALL DOLT_CHECKOUT('mybranch');

-- View a log of commits
SELECT commit_hash, message FROM dolt_log;
+----------------------------------+----------------------------+
| commit_hash                      | message                    |
+----------------------------------+----------------------------+
| 577isdjbq1951k2q4dqhli06jlauo51p | add 3, 4, 5 to the table   |
| k318tpmqn4l97ofpaerato9c3m70lc14 | add 1, 2 to the table      |
| 7e2q0hibo2m2af874i4e7isgnum74j4m | create a new table         |
| omuqq67att6vfnka94drdallu4983gnr | Initialize data repository |
+----------------------------------+----------------------------+
4 rows in set (0.00 sec)

-- View the table
SELECT * FROM mytable;
+---+
| a |
+---+
| 1 |
| 2 |
| 3 |
| 4 |
| 5 |
+---+
5 rows in set (0.00 sec)
```

We want to cherry-pick only the change introduced in commit hash `'k318tpmqn4l97ofpaerato9c3m70lc14'`, which inserts `1` and `2` to the table. Specifying `'mybranch~1'` instead of the commit hash also works.

```sql
-- Checkout main branch
CALL DOLT_CHECKOUT('main');

-- Cherry-pick the commit
CALL DOLT_CHERRY_PICK('k318tpmqn4l97ofpaerato9c3m70lc14');
+----------------------------------+
| hash                             |
+----------------------------------+
| mh518gdgbsut8m705b7b5rie9neq9uaj |
+----------------------------------+
1 row in set (0.02 sec)

mydb> SELECT * FROM mytable;
+---+
| a |
+---+
| 1 |
| 2 |
+---+
2 rows in set (0.00 sec)

mydb> SELECT commit_hash, message FROM dolt_log;
+----------------------------------+----------------------------+
| commit_hash                      | message                    |
+----------------------------------+----------------------------+
| mh518gdgbsut8m705b7b5rie9neq9uaj | add 1, 2 to the table      |
| 7e2q0hibo2m2af874i4e7isgnum74j4m | create a new table         |
| omuqq67att6vfnka94drdallu4983gnr | Initialize data repository |
+----------------------------------+----------------------------+
3 rows in set (0.00 sec)
```

## `DOLT_CLEAN()`

Deletes untracked tables in the working set.

Deletes only specified untracked tables if table names passed as
arguments.

With `--dry-run` flag, tests whether removing untracked tables will
return with zero status.

```sql
CALL DOLT_CLEAN();
CALL DOLT_CLEAN('untracked-table');
CALL DOLT_CLEAN('--dry-run');
```

### Options

`--dry-run`: Test removing untracked tables from working set.

### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

### Example

```sql
-- Create three new tables
create table tracked (x int primary key);
create table committed (x int primary key);
create table untracked (x int primary key);

-- Commit the first table
call dolt_add('committed');
call dolt_commit('-m', 'commit a table');
+----------------------------------+
| hash                             |
+----------------------------------+
| n7gle7jv6aqf72stbdicees6iduhuoo9 |
+----------------------------------+

-- Track the second table
call dolt_add('tracked');

-- Observe database status
select * from dolt_status;
+------------+--------+-----------+
| table_name | staged | status    |
+------------+--------+-----------+
| tracked    | true   | new table |
| untracked  | false  | new table |
+------------+--------+-----------+

-- Clear untracked tables
call dolt_clean('untracked');

-- Observe final status
select * from dolt_status;
+------------+--------+-----------+
| table_name | staged | status    |
+------------+--------+-----------+
| tracked    | true   | new table |
+------------+--------+-----------+

-- Committed and tracked tables are preserved
show tables;
+----------------+
| Tables_in_tmp3 |
+----------------+
| committed      |
| tracked        |
+----------------+
```

## `DOLT_CLONE()`

Clones an existing Dolt database into a new database within the current Dolt environment. The existing database must be specified as an argument, either as a file URL that points to an existing Dolt database on disk, or a `doltremote` URL for remote hosted database (e.g. a database hosted on DoltHub or DoltLab), or a `<org>/<database>` (e.g. `dolthub/us-jails`) as a shorthand for a database hosted on DoltHub. An additional argument can optionally be supplied to specify the name of the new, cloned database, otherwise the current name of the existing database will be used.

NOTE: When cloning from a file URL, you must currently include the `.dolt/noms` subdirectories. For more details see the GitHub tracking issue, [dolt#1860](https://github.com/dolthub/dolt/issues/1860).

```sql
CALL DOLT_CLONE('file:///myDatabasesDir/database/.dolt/noms');
CALL DOLT_CLONE('dolthub/us-jails', 'myCustomDbName');
```

### Options

`--remote`: Name of the remote to be added to the new, cloned database. The default is 'origin'.

`-b`, `--branch`: The branch to be cloned. If not specified all branches will be cloned.

`--depth`: Clone a single branch and limit history to the given commit depth.

### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

### Examples

```sql
-- Clone the dolthub/us-jails database from DoltHub using the <org>/<database> notation.
CALL DOLT_CLONE('dolthub/us-jails');
-- Use the new, cloned database
-- NOTE: backticks are required for database names with hyphens
USE `us-jails`;
SHOW TABLES;
+-----------------------------+
| Tables_in_us-jails          |
+-----------------------------+
| incidents                   |
| inmate_population_snapshots |
| jails                       |
+-----------------------------+

-- Clone the dolthub/museum-collections database, this time using a doltremoteapi URL, cloning
-- only a single branch, customizing the remote name, and providing a custom database name.
CALL DOLT_CLONE('-branch', 'prod', '-remote', 'dolthub',
                'https://doltremoteapi.dolthub.com/dolthub/ge-taxi-demo', 'taxis');

-- Verify that only the prod branch was cloned
USE taxis;
SELECT * FROM DOLT_BRANCHES;
+------+----------------------------------+------------------+------------------------+-------------------------+------------------------------+
| name | hash                             | latest_committer | latest_committer_email | latest_commit_date      | latest_commit_message        |
+------+----------------------------------+------------------+------------------------+-------------------------+------------------------------+
| prod | 1s61u4rbbd26u0tlpdhb46cuejd1dogj | oscarbatori      | oscarbatori@gmail.com  | 2021-06-14 17:52:58.702 | Added first cut of trip data |
+------+----------------------------------+------------------+------------------------+-------------------------+------------------------------+

-- Verify that the default remote for this new, cloned database is named "dolthub" (not "origin")
SELECT * FROM DOLT_REMOTES;
+---------+--------------------------------------------------------+-----------------------------------------+--------+
| name    | url                                                    | fetch_specs                             | params |
+---------+--------------------------------------------------------+-----------------------------------------+--------+
| dolthub | https://doltremoteapi.dolthub.com/dolthub/ge-taxi-demo | ["refs/heads/*:refs/remotes/dolthub/*"] | {}     |
+---------+--------------------------------------------------------+-----------------------------------------+--------+

```

## `DOLT_COMMIT()`

Commits staged tables to HEAD. Works exactly like `dolt commit` with
each value directly following the flag.

`DOLT_COMMIT()` also commits the current transaction.

```sql
CALL DOLT_COMMIT('-a', '-m', 'This is a commit');
CALL DOLT_COMMIT('-m', 'This is a commit');
CALL DOLT_COMMIT('-m', 'This is a commit', '--author', 'John Doe <johndoe@example.com>');
```

### Options

`-m`, `--message`: Use the given `<msg>` as the commit message. **Required**

`-a`, `--all`: Stages all modified tables (but not newly created tables) before committing.

`-A`, `--ALL`: Stages all tables (including new tables) before committing.

`--allow-empty`: Allow recording a commit that has the exact same data
as its sole parent. This is usually a mistake, so it is disabled by
default. This option bypasses that safety.

`--skip-empty`: Record a commit only if there are changes to be committed. The commit operation will be a no-op, instead of an error, if there are no changes staged to commit. An error will be thrown if `--skip-empty` is used with `--allow-empty`.

`--date`: Specify the date used in the commit. If not specified the
current system time is used.

`--author`: Specify an explicit author using the standard "A U Thor
author@example.com" format.

### Output Schema

```text
+-------+------+----------------------------+
| Field | Type | Description                |
+-------+------+----------------------------+
| hash  | text | hash of the commit created |
+-------+------+----------------------------+
```

### Examples

```sql
-- Set the current database for the session
USE mydb;

-- Make modifications
UPDATE table
SET column = "new value"
WHERE pk = "key";

-- Stage all changes and commit.
CALL DOLT_COMMIT('-a', '-m', 'This is a commit', '--author', 'John Doe <johndoe@example.com>');
```

## `DOLT_CONFLICTS_RESOLVE()`

When a merge finds conflicting changes, it documents them in the dolt_conflicts table.
A conflict is between two versions: ours (the rows at the destination branch head) and theirs
(the rows at the source branch head).
`dolt conflicts resolve` will automatically resolve the conflicts by taking either
the ours or theirs versions for each row.

```sql
CALL DOLT_CONFLICTS_RESOLVE('--ours', <table>);
CALL DOLT_CONFLICTS_RESOLVE('--theirs', <table>);
```

### Options

`<table>`: List of tables to be resolved. '.' can be used to resolve all tables.

`--ours`: For all conflicts, take the version from our branch and resolve the conflict.

`--theirs`: For all conflicts, take the version from their branch and resolve the conflict.

### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

### Examples

```sql
-- Set the current database for the session
USE mydb;

-- Attempt merge
CALL DOLT_MERGE('feature-branch');

-- Check for conflicts
SELECT * FROM dolt_conflicts;

-- Resolve conflicts for tables t1 and t2 with rows from our branch.
CALL DOLT_CONFLICTS_RESOLVE('--ours', 't1', 't2');
```

## `DOLT_FETCH()`

Fetch refs, along with the objects necessary to complete their histories
and update remote-tracking branches. Works exactly like `dolt fetch` on
the CLI, and takes the same arguments.

```sql
CALL DOLT_FETCH('origin', 'main');
CALL DOLT_FETCH('origin', 'feature-branch');
CALL DOLT_FETCH('origin', 'refs/heads/main:refs/remotes/origin/main');
CALL DOLT_FETCH('origin', NULL);
CALL DOLT_FETCH('origin');
```

### Options

No options for this procedure.

### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

### Example

```sql
-- Get remote main
CALL DOLT_FETCH('origin', 'main');

-- Inspect the hash of the fetched remote branch
SELECT HASHOF('origin/main');

-- Merge remote main with current branch
CALL DOLT_MERGE('origin/main');
```

### Notes
Dropping the second argument, or passing NULL, will result is using the default refspec.


## `DOLT_GC()`

Cleans up unreferenced data from the database. Running the `dolt_gc` procedure on a Dolt
sql-server will block all writes while garbage collection is in progress.

```sql
CALL DOLT_GC();
CALL DOLT_GC('--shallow');
```
### Options

`--shallow` Performs a faster but less thorough garbage collection.

### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

### Notes

To prevent concurrent writes potentially referencing garbage collected chunks, running 
`call dolt_gc()` will break all open connections to the running server. In flight 
queries on those connections may fail and must be retried. Re-establishing connections 
after they are broken is safe.

At the end of the run, the connection which ran call dolt_gc() will be left open in order 
to deliver the results of the operation itself. The connection will be left in a terminally 
broken state where any attempt to run a query on it will result in the following error:

```
ERROR 1105 (HY000): this connection was established when this server performed an online 
garbage collection. this connection can no longer be used. please reconnect.
```

The connection should be closed. In some connection pools it can be awkward to cause a 
single connection to actually close. If you need to run call dolt_gc() programmatically, 
one work around is to use a separate connection pool with a size of 1 which can be 
closed after the run is successful.

## `DOLT_MERGE()`

Incorporates changes from the named commits \(since the time their
histories diverged from the current branch\) into the current
branch. Works exactly like `dolt merge` on the CLI, and takes the same
arguments.

Any resulting merge conflicts must be resolved before the transaction
can be committed or a new Dolt commit created. `DOLT_MERGE()` creates
a new commit for any successful merge with auto-generated commit
message if not defined.

```sql
CALL DOLT_MERGE('feature-branch'); -- Optional --squash parameter
CALL DOLT_MERGE('feature-branch', '--no-ff', '-m', 'This is a msg for a non fast forward merge');
CALL DOLT_MERGE('--abort');
```

{% hint style="info" %}

### Notes

- The `dolt_merge()` procedure implicitly commits the current transaction and begins a new one.

{% endhint %}

### Options

`--no-ff`: Create a merge commit even when the merge resolves as a fast-forward.

`--squash`: Merges changes to the working set without updating the
commit history

`-m <msg>, --message=<msg>`: Use the given as the commit message. This
is only useful for --non-ff commits.

`--abort`: Abort the current conflict resolution process, and try to
reconstruct the pre-merge state.

`--author`: Specify an explicit author using the standard `A U Thor
<author@example.com>` format.

When merging a branch, your session state must be clean. `COMMIT`
or`ROLLBACK` any changes, then `DOLT_COMMIT()` to create a new dolt
commit on the target branch.

If the merge causes conflicts or constraint violations, you must
resolve them using the `dolt_conflicts` system tables before the
transaction can be committed. See [Dolt system
tables](dolt-system-tables.md##dolt_conflicts_usdtablename) for
details.

### Output Schema

```text
+--------------+------+--------------------------------------+
| Field        | Type | Description                          |
+--------------+------+--------------------------------------+
| hash         | text | hash of the merge commit             |
| fast_forward | int  | whether the merge was a fast forward |
| conflicts    | int  | number of conflicts created          |
| message      | text | optional informational message       |
+--------------+------+--------------------------------------+
```

### Example

```sql
-- Set the current database for the session
USE mydb;

-- Create and checkout to a new branch.
CALL DOLT_CHECKOUT('-b', 'feature-branch');

-- Make modifications
UPDATE table
SET column = "new value"
WHERE pk = "key";

-- Stage and commit all  changes.
CALL DOLT_COMMIT('-a', '-m', 'committing all changes');

-- Go back to main
CALL DOLT_MERGE('feature-branch', '--author', 'John Doe <johndoe@example.com>');
```

## `DOLT_PULL()`

Fetch from and integrate with another database or a local branch. In
its default mode, `dolt pull` is shorthand for `dolt fetch` followed by
`dolt merge <remote>/<branch>`. Works exactly like `dolt pull` on the
CLI, and takes the same arguments.

Any resulting merge conflicts must be resolved before the transaction
can be committed or a new Dolt commit created.

```sql
CALL DOLT_PULL('origin');
CALL DOLT_PULL('origin', 'some-branch');
CALL DOLT_PULL('feature-branch', '--force');
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

### Output Schema

```text
+--------------+------+-------------------------------------+
| Field        | Type | Description                         |
+--------------+------+-------------------------------------+
| fast_forward | int  | whether the pull was a fast forward |
| conflicts    | int  | number of conflicts created         |
| message      | text | optional informational message      |
+--------------+------+-------------------------------------+
```

### Example

```sql
-- Update local working set with remote changes
-- Note: this requires upstream tracking information to be set in order for
--       Dolt to know what remote branch to merge
CALL DOLT_PULL('origin');

-- Update local working set with remote changes from an explicit branch
CALL DOLT_PULL('origin', 'some-branch');

-- View a log of new commits
SELECT * FROM dolt_log LIMIT 5;
```


## `DOLT_PURGE_DROPPED_DATABASES()`

Permanently deletes any dropped databases that are being held in a temporary holding area. When a Dolt database is 
dropped, it is moved to a temporary holding area where the [`dolt_undrop()` stored procedure](#dolt_undrop) can restore
it. The `dolt_purge_dropped_databases()` stored procedure clears this holding area and permanently deletes any data
from those databases. This action is not reversible, so callers should be cautious about using it. The main benefit
of using this function is to reclaim disk space used by the temporary holding area. Because this is a destructive
operation, callers must have `SUPER` privileges in order to execute it. 

### Example

```sql
-- Create a database and populate a table in the working set 
CREATE DATABASE database1;
use database1;
create table t(pk int primary key);

-- Dropping the database will move it to a temporary holding area 
DROP DATABASE database1;

-- At this point, the database can be restored by calling dolt_undrop('database1'), but
-- instead, we permanently delete it by calling dolt_purge_dropped_databases().
CALL dolt_purge_dropped_databases(); 
```

## `DOLT_PUSH()`

Updates remote refs using local refs, while sending objects necessary to
complete the given refs. Works exactly like `dolt push` on the CLI, and
takes the same arguments.

```sql
CALL DOLT_PUSH('origin', 'main');
CALL DOLT_PUSH('--force', 'origin', 'main');
```

### Options

`--force`: Update the remote with local history, overwriting any conflicting history in the remote.

### Output Schema

```text
+---------+------+--------------------------------+
| Field   | Type | Description                    |
+---------+------+--------------------------------+
| status  | int  | 0 if successful, 1 if not      |
| message | text | optional informational message |
+---------+------+--------------------------------+
```

### Example

```sql
-- Checkout new branch
CALL DOLT_CHECKOUT('-b', 'feature-branch');

-- Add a table
CREATE TABLE test (a int primary key);

-- Create commit
CALL DOLT_COMMIT('-a', '-m', 'create table test');

-- Push to remote
CALL DOLT_PUSH('origin', 'feature-branch');
```


## `DOLT_REBASE()`

Rewrites commit history for the current branch by replaying commits, allowing the commits to be reordered, squashed, or dropped. The commits included in the rebase plan are the commits reachable by the current branch, but NOT reachable from the branch specified as the argument when starting a rebase (also known as the upstream branch). This is the same as Git and Dolt's ["two dot log" syntax](https://www.dolthub.com/blog/2022-11-11-two-and-three-dot-diff-and-log/#two-dot-log), or |upstreamBranch|..|currentBranch|. 

For example, consider the commit graph below, where a `feature` branch has branched off of a `main` branch, and both branches have added commits:
```sql
A → B → C → D → E → F  main
         ↘
           G → H → I  feature
```

If we rebase from the `feature` branch using the `main` branch as our upstream, the default rebase plan will include commits `G`, `H`, and `I`, since those commits are reachable from our current branch, but NOT reachable from the upstream branch. By default, the changes from those same commits will be reapplied, in the same order, to the tip of the upstream branch `main`. The resulting commit graph will then look like:
```sql
A → B → C → D → E → F  main
                     ↘
                       G' → H' → I'  feature
```

Rebasing is useful to clean and organize your commit history, especially before merging a feature branch back to a shared branch. For example, you can drop commits that contain debugging or test changes, or squash or fixup small commits into a single commit, or reorder commits so that related changes are adjacent in the new commit history. 

```sql
CALL DOLT_REBASE('--interactive', 'main');
CALL DOLT_REBASE('-i', 'main');
CALL DOLT_REBASE('--continue');
CALL DOLT_REBASE('--abort');
```

### Limitations
Currently only interactive rebases are supported, and there is no support for resolving conflicts that arise while executing a rebase plan. If applying a commit creates a conflict, the rebase will be automatically aborted.

### Options

`--interactive` or `-i`: Start an interactive rebase. Currently only interactive rebases are supported, so this option is required.

`--continue`: Continue an interactive rebase after adjusting the rebase plan stored in `dolt_rebase`.

`--abort`: Abort a rebase in progress. 

### Output Schema

```text
+---------+------+-----------------------------+
| Field   | Type | Description                 |
+---------+------+-----------------------------+
| status  | int  | 0 if successful, 1 if not   |
| message | text | success/failure information |
+---------+------+-----------------------------+
```

### Example

```sql
-- create a simple table
create table t (pk int primary key);
call dolt_commit('-Am', 'creating table t');

-- create a new branch that we'll add more commits to later
call dolt_branch('branch1');

-- create another commit on the main branch, right after where branch1 branched off
insert into t values (0);
call dolt_commit('-am', 'inserting row 0');

-- switch to branch1 and create three more commits that each insert one row 
call dolt_checkout('branch1');
insert into t values (1);
call dolt_commit('-am', 'inserting row 1');
insert into t values (2);
call dolt_commit('-am', 'inserting row 2');
insert into t values (3);
call dolt_commit('-am', 'inserting row 3');

-- check out what our commit history on branch1 looks like before we rebase
select commit_hash, message from dolt_log;
+----------------------------------+----------------------------+
| commit_hash                      | message                    |
+----------------------------------+----------------------------+
| tsq01op7b48ij6dfa2tst60vbfm9rcus | inserting row 3            |
| uou7dibe86e9939pu8fdtjdce5pt7v1c | inserting row 2            |
| 3umkjmqeeep5ho7nn0iggfinajoo1l6q | inserting row 1            |
| 35gfll6o322aq9uffdqin1dqmq7q3vek | creating table t           |
| do1tp9u39vsja3c8umshv9p6fernr0lt | Inіtіalizе dаta repоsitоry |
+----------------------------------+----------------------------+

-- start an interactive rebase and check out the default rebase plan; this will rebase 
-- all the new commits on this branch and move them to the tip of the main branch  
call dolt_rebase('-i', 'main');
select * from dolt_rebase order by rebase_order;
+--------------+--------+----------------------------------+-----------------+
| rebase_order | action | commit_hash                      | commit_message  |
+--------------+--------+----------------------------------+-----------------+
| 1.00         | pick   | 3umkjmqeeep5ho7nn0iggfinajoo1l6q | inserting row 1 |
| 2.00         | pick   | uou7dibe86e9939pu8fdtjdce5pt7v1c | inserting row 2 |
| 3.00         | pick   | tsq01op7b48ij6dfa2tst60vbfm9rcus | inserting row 3 |
+--------------+--------+----------------------------------+-----------------+

-- adjust the rebase plan to reword the first commit, drop the commit that inserted row 2,
-- and combine the third commit into the previous commit  
update dolt_rebase set action='reword', commit_message='insert rows' where rebase_order=1;
update dolt_rebase set action='drop' where rebase_order=2;
update dolt_rebase set action='fixup' where rebase_order=3;

-- continue rebasing now that we've adjusted the rebase plan 
call dolt_rebase('--continue');

-- check out the history
select commit_hash, message from dolt_log;
+----------------------------------+----------------------------+
| commit_hash                      | message                    |
+----------------------------------+----------------------------+
| 8jc1dpj25fv6f2kn3bd47uokc8hs1vp0 | insert rows                |
| hb9fnqnrsd5ghq3fgag0kiq6nvpsasvo | inserting row 0            |
| 35gfll6o322aq9uffdqin1dqmq7q3vek | creating table t           |
| do1tp9u39vsja3c8umshv9p6fernr0lt | Inіtіalizе dаta repоsitоry |
+----------------------------------+----------------------------+
```


## `DOLT_REMOTE()`

Adds a remote for a database at given url, or removes an existing remote with its remote-tracking branches
and configuration settings. Similar to [`dolt remote` command](../../cli/cli.md#dolt-remote) on the CLI, with the
exception of cloud provider flags. To list existing remotes, use the
[`dolt_remotes` system table](./dolt-system-tables.md#dolt_remotes).

```sql
CALL DOLT_REMOTE('add','remote_name','remote_url');
CALL DOLT_REMOTE('remove','existing_remote_name');
```

### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

### Example

```sql
-- Add a HTTP remote
CALL DOLT_REMOTE('add','origin','https://doltremoteapi.dolthub.com/Dolthub/museum-collections');

-- Add a HTTP remote with shorthand notation for the URL
CALL DOLT_REMOTE('add','origin1','Dolthub/museum-collections');

-- Add a filesystem based remote
CALL DOLT_REMOTE('add','origin2','file:///Users/jennifer/datasets/museum-collections');

-- List remotes to check.
SELECT * FROM dolt_remotes;
+---------+--------------------------------------------------------------+-----------------------------------------+--------+
| name    | url                                                          | fetch_specs                             | params |
+---------+--------------------------------------------------------------+-----------------------------------------+--------+
| origin  | https://doltremoteapi.dolthub.com/Dolthub/museum-collections | ["refs/heads/*:refs/remotes/origin/*"]  | {}     |
| origin1 | https://doltremoteapi.dolthub.com/Dolthub/museum-collections | ["refs/heads/*:refs/remotes/origin1/*"] | {}     |
| origin2 | file:///Users/jennifer/datasets/museum-collections           | ["refs/heads/*:refs/remotes/origin2/*"] | {}     |
+---------+--------------------------------------------------------------+-----------------------------------------+--------+

-- Remove a remote
CALL DOLT_REMOTE('remove','origin1');

-- List remotes to check.
SELECT * FROM dolt_remotes;
+---------+--------------------------------------------------------------+-----------------------------------------+--------+
| name    | url                                                          | fetch_specs                             | params |
+---------+--------------------------------------------------------------+-----------------------------------------+--------+
| origin  | https://doltremoteapi.dolthub.com/Dolthub/museum-collections | ["refs/heads/*:refs/remotes/origin/*"]  | {}     |
| origin2 | file:///Users/jennifer/datasets/museum-collections           | ["refs/heads/*:refs/remotes/origin2/*"] | {}     |
+---------+--------------------------------------------------------------+-----------------------------------------+--------+
```

## `DOLT_RESET()`

Default mode resets staged tables to their HEAD state. Can also be used to reset a database to a specific commit. Works exactly like `dolt reset` on the CLI, and takes the same arguments.

Like other data modifications, after a reset you must `COMMIT` the
transaction for any changes to affected tables to be visible to other
clients.

```sql
CALL DOLT_RESET('--hard', 'featureBranch');
CALL DOLT_RESET('--hard', 'commitHash123abc');
CALL DOLT_RESET('myTable'); -- soft reset
```

{% hint style="info" %}

### Notes

- With the `--hard` option, the `dolt_reset()` procedure implicitly commits the current transaction
  and begins a new one.

{% endhint %}

### Options

`--hard`: Resets the working tables and staged tables. Any changes to
tracked tables in the working tree since <commit> are discarded.

`--soft`: Does not touch the working tables, but removes all tables
staged to be committed. This is the default behavior.

### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

### Example

```sql
-- Set the current database for the session
USE mydb;

-- Make modifications
UPDATE table
SET column = "new value"
WHERE pk = "key";

-- Reset the changes permanently.
CALL DOLT_RESET('--hard');

-- Makes some more changes.
UPDATE table
SET column = "new value"
WHERE pk = "key";

-- Stage the table.
CALL DOLT_ADD('table')

-- Unstage the table.
CALL DOLT_RESET('table')
```

## `DOLT_REVERT()`

Reverts the changes introduced in a commit, or set of commits. Creates a new commit from the current HEAD that reverses
the changes in all the specified commits. If multiple commits are given, they are applied in the order given.

```sql
CALL DOLT_REVERT('gtfv1qhr5le61njimcbses9oom0de41e');
CALL DOLT_REVERT('HEAD~2');
CALL DOLT_REVERT('HEAD', '--author=reverter@rev.ert');
```

### Options

`--author=<author>`: Specify an explicit author using the standard `A U Thor <author@example.com>` format.

### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

### Example

```sql
-- Create a table and add data in multiple commits
CREATE TABLE t1(pk INT PRIMARY KEY, c VARCHAR(255));
CALL dolt_add("t1")
CALL dolt_commit("-m", "Creating table t1");
INSERT INTO t1 VALUES(1, "a"), (2, "b"), (3, "c");
CALL dolt_commit("-am", "Adding some data");
insert into t1 VALUES(10, "aa"), (20, "bb"), (30, "cc");
CALL dolt_commit("-am", "Adding some more data");

-- Examine the changes made in the commit immediately before the current HEAD commit
SELECT to_pk, to_c, to_commit, diff_type FROM dolt_diff_t1 WHERE to_commit=hashof("HEAD~1");
+-------+------+----------------------------------+-----------+
| to_pk | to_c | to_commit                        | diff_type |
+-------+------+----------------------------------+-----------+
| 1     | a    | fc4fks6jutcnee9ka6458nmuot7rl1r2 | added     |
| 2     | b    | fc4fks6jutcnee9ka6458nmuot7rl1r2 | added     |
| 3     | c    | fc4fks6jutcnee9ka6458nmuot7rl1r2 | added     |
+-------+------+----------------------------------+-----------+

-- Revert the commit immediately before the current HEAD commit
CALL dolt_revert("HEAD~1");

-- Check out the new commit created by dolt_revert
SELECT commit_hash, message FROM dolt_log limit 1;
+----------------------------------+---------------------------+
| commit_hash                      | message                   |
+----------------------------------+---------------------------+
| vbevrdghj3in3napcgdsch0mq7f8en4v | Revert "Adding some data" |
+----------------------------------+---------------------------+

-- View the exact changes made by the revert commit
SELECT from_pk, from_c, to_commit, diff_type FROM dolt_diff_t1 WHERE to_commit=hashof("HEAD");
+---------+--------+----------------------------------+-----------+
| from_pk | from_c | to_commit                        | diff_type |
+---------+--------+----------------------------------+-----------+
| 1       | a      | vbevrdghj3in3napcgdsch0mq7f8en4v | removed   |
| 2       | b      | vbevrdghj3in3napcgdsch0mq7f8en4v | removed   |
| 3       | c      | vbevrdghj3in3napcgdsch0mq7f8en4v | removed   |
+---------+--------+----------------------------------+-----------+
```

## `DOLT_TAG()`

Creates a new tag that points at specified commit ref, or deletes an existing tag. Works exactly like
[`dolt tag` command](../../cli/cli.md#dolt-tag) on the CLI, and takes the same arguments except for listing tags.
To list existing tags, use [`dolt_tags` system table](./dolt-system-tables.md#dolt_tags).

```sql
CALL DOLT_TAG('tag_name', 'commit_ref');
CALL DOLT_TAG('-m', 'message', 'tag_name', 'commit_ref');
CALL DOLT_TAG('-m', 'message', '--author', 'John Doe <johndoe@example.com>', 'tag_name', 'commit_ref');
CALL DOLT_TAG('-d', 'tag_name');
```

### Options

`-m`: Use the given message as the tag message.

`-d`: Delete a tag.

`--author`: Specify an explicit author using the standard "A U Thor
author@example.com" format.

### Output Schema

```text
+--------+------+---------------------------+
| Field  | Type | Description               |
+--------+------+---------------------------+
| status | int  | 0 if successful, 1 if not |
+--------+------+---------------------------+
```

### Example

```sql
-- Set the current database for the session
USE mydb;

-- Make modifications
UPDATE table
SET column = "new value"
WHERE pk = "key";

-- Stage and commit all changes.
CALL DOLT_COMMIT('-am', 'committing all changes');

-- Create a tag for the HEAD commit.
CALL DOLT_TAG('v1','head','-m','creating v1 tag');
```

## `DOLT_UNDROP()`

Restores a dropped database. See the [`dolt_purge_dropped_databases()` stored procedure](#dolt_purge_dropped_databases) for info on how to permanently remove dropped databases. 

```sql
CALL DOLT_UNDROP(<database_name>);
```

### Options

`dolt_undrop()` takes a single argument – the name of the dropped database to restore. When called without any arguments,
`dolt_undrop()` returns an error message that contains a list of all dropped databases that are available to be restored.

### Example

```sql
-- Create a database and populate a table in the working set 
CREATE DATABASE database1;
use database1;
create table t(pk int primary key);

-- Dropping the database will move it to a temporary holding area 
DROP DATABASE database1;
     
-- calling dolt_undrop() with no arguments will return an error message that
-- lists the dropped database that are available to be restored
CALL dolt_undrop();

-- Use dolt_undrop() to restore it 
CALL dolt_undrop('database1');
SELECT * FROM database1.t;
```

## `DOLT_VERIFY_CONSTRAINTS()`

Verifies that working set changes (inserts, updates, and/or deletes) satisfy the
defined table constraints. If any constraints are violated they are written to the
[DOLT_CONSTRAINT_VIOLATIONS](./dolt-system-tables.md#doltconstraintviolations) table.

`DOLT_VERIFY_CONSTRAINTS` by default does not detect constraints for row changes
that have been previously committed. The `--all` option can be specified if you
wish to validate all rows in the database. If `FOREIGN_KEY_CHECKS` has been disabled in prior commits,
you may want to use the `--all` option to ensure that the current state is
consistent and no violated constraints are missed.

### Arguments and Options

`<table>`: The table(s) to check constraints on. If omitted, checks all tables.

`-a`, `--all`:
Verifies constraints against every row.

`-o`, `--output-only`:
Disables writing results to the
[DOLT_CONSTRAINT_VIOLATIONS](./dolt-system-tables.md#doltconstraintviolations)
system table.

### Output Schema

```text
+------------+------+-----------------------------------------+
| Field      | Type | Description                             |
+------------+------+-----------------------------------------+
| violations | int  | 1 if violations were found, otherwise 0 |
+------------+------+-----------------------------------------+
```

### Example

For the below examples consider the following schema:

```sql
CREATE TABLE parent (
  pk int PRIMARY KEY
);

CREATE TABLE child (
  pk int PRIMARY KEY,
  parent_fk int,
  FOREIGN KEY (parent_fk) REFERENCES parent(pk)
);
```

A simple case:

```sql
-- enable dolt_force_transaction_commit so that we can inspect the
-- violation in our working set
SET dolt_force_transaction_commit = ON;
SET FOREIGN_KEY_CHECKS = OFF;
INSERT INTO PARENT VALUES (1);
-- Violates child's foreign key constraint
INSERT INTO CHILD VALUES (1, -1);

CALL DOLT_VERIFY_CONSTRAINTS();
/*
+------------+
| violations |
+------------+
| 1          |
+------------+
*/

SELECT * from dolt_constraint_violations;
/*
+-------+----------------+
| table | num_violations |
+-------+----------------+
| child | 1              |
+-------+----------------+
*/

SELECT violation_type, pk, parent_fk from dolt_constraint_violations_child;
/*
+----------------+----+-----------+
| violation_type | pk | parent_fk |
+----------------+----+-----------+
| foreign key    | 1  | -1        |
+----------------+----+-----------+
*/
```

Using `--all` to verify all rows:

```sql
SET DOLT_FORCE_TRANSACTION_COMMIT = ON;
SET FOREIGN_KEY_CHECKS = OFF;
INSERT INTO PARENT VALUES (1);
INSERT INTO CHILD VALUES (1, -1);
CALL DOLT_COMMIT('-am', 'violating rows');

CALL DOLT_VERIFY_CONSTRAINTS();
/*
No violations are returned since there are no changes in the working set.

+------------+
| violations |
+------------+
| 0          |
+------------+
*/

SELECT * from dolt_constraints_violations_child;
/*
+----------------+----+-----------+----------------+
| violation_type | pk | parent_fk | violation_info |
+----------------+----+-----------+----------------+
+----------------+----+-----------+----------------+
*/

CALL DOLT_VERIFY_CONSTRAINTS('--all');
/*
When all rows are considered, constraint violations are found.

+------------+
| violations |
+------------+
| 1          |
+------------+
*/

SELECT * from dolt_constraint_violations_child;
/*
+----------------+----+-----------+
| violation_type | pk | parent_fk |
+----------------+----+-----------+
| foreign key    | 1  | -1        |
+----------------+----+-----------+
*/
```

Checking specific tables only:

```sql
SET DOLT_FORCE_TRANSACTION_COMMIT = ON;
SET FOREIGN_KEY_CHECKS = OFF;
INSERT INTO PARENT VALUES (1);
INSERT INTO CHILD VALUES (1, -1);

CALL DOLT_VERIFY_CONSTRAINTS('parent');
/*
+------------+
| violations |
+------------+
| 0          |
+------------+
*/

CALL DOLT_VERIFY_CONSTRAINTS('child');
/*
+------------+
| violations |
+------------+
| 1          |
+------------+
*/

SELECT * from dolt_constraint_violations_child;
/*
+----------------+----+-----------+
| violation_type | pk | parent_fk |
+----------------+----+-----------+
| foreign key    | 1  | -1        |
+----------------+----+-----------+
*/
```

# Access Control
Dolt stored procedures are access controlled using the GRANT permissions system. MySQL database permissions trickle down to tables and procedures, someone who has Execute permission on a database would have Execute permission on all procedures related to that database. Dolt deviates moderately from this behavior for sensitive operations. See [Administrative Procedures](#administrative-procedures) below.

Users who need common Dolt capability such as adding and committing to a branch will need Execute permission granted on the database in question. As a privileged user, you can grant access with the following command:

```sql
mydb> GRANT EXECUTE ON mydb.* TO pat@localhost
```

This will give the user, `pat`, the ability run all stored procedures on the database. This includes Dolt procedures as well as user defined procedures. If you need to use fine grained permissions, you can grant them individually:

```sql
mydb> GRANT EXECUTE ON PROCEDURE mydb.dolt_commit TO pat@localhost
```

If you need to remove access for a particular capability, REVOKE as follows:

```sql
mydb> REVOKE EXECUTE ON PROCEDURE mydb.dolt_commit FROM pat@localhost
mydb> REVOKE EXECUTE ON mydb.* FROM pat@localhost
```

## Administrative Procedures
The follow procedures are considered administrative, and as a result users are required to have explicit grants to use them.

* dolt_backup
* dolt_clone
* dolt_fetch
* dolt_undrop
* dolt_purge_dropped_databases
* dolt_gc
* dolt_pull
* dolt_push
* dolt_remote

For example, if a service account requires the ability to start `dolt_gc`, then it must have specific permissions to do so:

```sql
database> GRANT EXECUTE ON PROCEDURE mydb.dolt_gc TO service_account@localhost
```

`dolt_push()`, `dolt_fetch()`, and `dolt_pull()` are considered administrative operations currently because they all use a shared credential to talk to remote servers. User level access to remotes, and the ability to store user level credentials for them is on our [roadmap](https://github.com/dolthub/dolt/issues/6639).

The root user, or any other user with super privileges is allowed to call all procedures.
