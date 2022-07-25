---
title: Dolt SQL Procedures
---

# Table of Contents

* [Dolt SQL Procedures](#dolt-sql-procedures)
  * [dolt\_add()](#dolt_add)
  * [dolt\_backup()](#dolt_backup)
  * [dolt\_branch()](#dolt_branch)
  * [dolt\_checkout()](#dolt_checkout)
  * [dolt\_clean()](#dolt_clean)
  * [dolt\_clone()](#dolt_clone)
  * [dolt\_commit()](#dolt_commit)
  * [dolt\_fetch()](#dolt_fetch)
  * [dolt\_merge()](#dolt_merge)
  * [dolt\_pull()](#dolt_pull)
  * [dolt\_push()](#dolt_push)
  * [dolt\_remote()](#dolt_remote)
  * [dolt\_reset()](#dolt_reset)
  * [dolt\_revert()](#dolt_revert)
  * [dolt\_tag()](#dolt_tag)
  * [dolt\_verify\_constraints()](#dolt_verify_constraints)

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
session, not for all clients. So for example, whereas running `dolt
checkout feature-branch` will change the working HEAD for anyone who
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

### Example

```sql
-- Set the current database for the session
USE mydb;

-- Make modifications
UPDATE table
SET column = "new value"
WHERE pk = "key";

-- Stage all changes.
CALL DOLT_ADD('-a');

-- Commit the changes.
CALL DOLT_COMMIT('-m', 'committing all changes');
```

## `DOLT_BACKUP()`

Sync with a configured backup. Other backup commands not supported
via SQL yet.

```sql
CALL DOLT_BACKUP('sync', 'name');
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

### Options

`-c`, `--copy`: Create a copy of a branch. Must be followed by the name of the source branch to copy and the name of the new branch to create. Without the `--force` option, the copy will fail if the new branch already exists.  

`-m`, `--move`: Move/rename a branch. Must be followed by the current name of an existing branch and a new name for that branch. Without the `--force` option, renaming a branch in use on another server session will fail. Be aware that forcibly renaming or deleting a branch in use in another session will require that session to disconnect and reconnect before it can execute statements again.   

`-d`, `--delete`: Delete a branch. Must be followed by the name of an existing branch to delete. Without the `--force` option, deleting a branch in use on another server session will fail. Be aware that forcibly renaming or deleting a branch in use in another session will require that session to disconnect and reconnect before it can execute statements again.

`-f`, `--force`: When used with the `--copy` option, allows for recreating a branch from another branch, even if the branch already exists. When used with the `--move` or `--delete` options, force will allow you to rename or delete branches in use in other active server sessions, but be aware that this will require those other sessions to disconnect and reconnect before they can execute statements again.

`-D`: Shortcut for `--delete --force`.

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

When switching to a different branch, your session state must be
clean. `COMMIT` or `ROLLBACK` any changes before switching to a
different branch.

Note, unlike the Git command-line, if you have a modified working set, 
those changes remain on the branch you modified after a DOLT_CHECKOUT(). 
The working set does not transfer to the new checked out branch. We 
modified this behavior because Dolt assumes multiple users of a branch
in SQL context. Having one user change the state of other users 
working set was deemed undesirable behavior.

```sql
CALL DOLT_CHECKOUT('-b', 'my-new-branch');
CALL DOLT_CHECKOUT('my-existing-branch');
CALL DOLT_CHECKOUT('my-table');
```

### Options

`-b`: Create a new branch with the given name.

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
`--aws-region`: The cloud provider region associated with the remote database being cloned.
`--aws-creds-type`: The credential type when cloning a remote database from AWS. Valid options are role, env, and file.
`--aws-creds-file`: The AWS credentials file for use when cloning a remote database from AWS.
`--aws-creds-profile`: The AWS profile name holding the credentials to use when cloning a remote database from AWS.

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
CALL DOLT_COMMIT('-a', '-m', 'This is a commit', '--author', 'John Doe <johndoe@example.com>');
```


## `DOLT_FETCH()`

Fetch refs, along with the objects necessary to complete their histories
and update remote-tracking branches. Works exactly like `dolt fetch` on
the CLI, and takes the same arguments.

```sql
CALL DOLT_FETCH('origin', 'main');
CALL DOLT_FETCH('origin', 'feature-branch');
CALL DOLT_FETCH('origin', 'refs/heads/main:refs/remotes/origin/main');
```

### Options

`--force`: Update refs to remote branches with the current state of the
remote, overwriting any conflicting history

### Example

```sql
-- Get remote main
CALL DOLT_FETCH('origin', 'main');

-- Inspect the hash of the fetched remote branch
SELECT HASHOF('origin/main');

-- Merge remote main with current branch
CALL DOLT_MERGE('origin/main');
```


## `DOLT_MERGE()`

Incorporates changes from the named commits \(since the time their
histories diverged from the current branch\) into the current
branch. Works exactly like `dolt merge` on the CLI, and takes the same
arguments.

Any resulting merge conflicts must be resolved before the transaction
can be committed or a new Dolt commit created.

```sql
CALL DOLT_MERGE('feature-branch'); -- Optional --squash parameter
CALL DOLT_MERGE('feature-branch', '-no-ff', '-m', 'This is a msg for a non fast forward merge');
CALL DOLT_MERGE('--abort');
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
CALL DOLT_CHECKOUT('-b', 'feature-branch');

-- Make modifications
UPDATE table
SET column = "new value"
WHERE pk = "key";

-- Stage and commit all  changes.
CALL DOLT_COMMIT('-a', '-m', 'committing all changes');

-- Go back to main
CALL DOLT_MERGE('feature-branch');
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


## `DOLT_REMOTE()`

Adds a remote for a database at given url, or removes an existing remote with its remote-tracking branches 
and configuration settings. Works exactly like [`dolt remote` command](../../cli.md#dolt-remote) on the CLI, and takes 
the same arguments except for listing remotes. To list existing remotes, use the
[`dolt_remotes` system table](./dolt-system-tables.md#dolt_remotes).

```sql
CALL DOLT_REMOTE('add','remote_name','remote_url');
CALL DOLT_REMOTE('remove','existing_remote_name');
```

### Options

`--aws-region=<region>`: Specify a cloud provider region associated with this remote.

`--aws-creds-type=<creds-type>`: Specify a credential type.  Valid options are role, env, and file.

`--aws-creds-file=<file>`: Specify an AWS credentials file.

`--aws-creds-profile=<profile>`: Specify an AWS profile to use.

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

### Example

```sql
-- Create a table and add data in multiple commits
CREATE TABLE t1(pk INT PRIMARY KEY, c VARCHAR(255));
CALL dolt_commit("-am", "Creating table t1");
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


## `DOLT_PULL()`

Fetch from and integrate with another database or a local branch. In
its default mode, `dolt pull` is shorthand for `dolt fetch` followed by
`dolt merge <remote>/<branch>`. Works exactly like `dolt pull` on the
CLI, and takes the same arguments.

Any resulting merge conflicts must be resolved before the transaction
can be committed or a new Dolt commit created.

```sql
CALL DOLT_PULL('origin');
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

### Example

```sql
-- Update local working set with remote changes
CALL DOLT_PULL('origin');

-- View a log of new commits
SELECT * FROM dolt_log LIMIT 5;
```


## `DOLT_TAG()`

Creates a new tag that points at specified commit ref, or deletes an existing tag. Works exactly like
[`dolt tag` command](../../cli.md#dolt-tag) on the CLI, and takes the same arguments except for listing tags. 
To list existing tags, use [`dolt_tags` system table](./dolt-system-tables.md#dolt_tags).

```sql

CALL DOLT_TAG('tag_name','commit_ref');
CALL DOLT_TAG('-m','message','tag_name','commit_ref');
CALL DOLT_TAG('-d','tag_name');
```

### Options

`-m`: Use the given message as the tag message.

`-d`: Delete a tag.

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


## `DOLT_VERIFY_CONSTRAINTS()`

Verifies that working set changes (inserts, updates, and/or deletes) satisfy the
defined table constraints. Currently, the command only verifies foreign key
constraints. If any constraints are violated they are written to the
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
