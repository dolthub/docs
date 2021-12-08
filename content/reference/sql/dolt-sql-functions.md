---
title: Dolt SQL Functions
---

# Dolt SQL Functions

Dolt provides SQL functions to allow access to command line `dolt`
commands from within a SQL session. Each function is named after the
`dolt` command line command it matches, and takes arguments in an
identical form.

For example, `dolt checkout -b feature-branch` is equivalent to
executing the following SQL statement:

```sql
SELECT DOLT_CHECKOUT('-b', 'feature-branch');
```

SQL functions are provided for all imperative CLI commands. For
commands that inspect the state of the repository and print some
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

-- Go back to master
SELECT DOLT_CHECKOUT('master');
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

-- Go back to master
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
SELECT DOLT_PUSH('origin', 'master');
SELECT DOLT_PUSH('--force', 'origin', 'master');
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

## `DOLT_FETCH()`

Fetch refs, along with the objects necessary to complete their histories
and update remote-tracking branches. Works exactly like `dolt fetch` on
the CLI, and takes the same arguments.

```sql
SELECT DOLT_FETCH('origin', 'master');
SELECT DOLT_FETCH('origin', 'feature-branch');
SELECT DOLT_FETCH('origin', 'refs/heads/master:refs/remotes/origin/master');
```

### Options

`--force`: Update refs to remote branches with the current state of the
remote, overwriting any conflicting history

### Example

```sql
-- Get remote master
SELECT DOLT_FETCH('origin', 'master');

-- Inspect the hash of the fetched remote branch
SELECT HASHOF('origin/master');

-- Merge remote master with current branch
SELECT DOLT_MERGE('origin/master');
```

## `DOLT_PULL()`

Fetch from and integrate with another repository or a local branch. In
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

# Other Dolt SQL functions

Dolt also provides various SQL functions for dolt-specific
functionality in SQL that have no command line equivalent.

## `DOLT_MERGE_BASE()`

`DOLT_MERGE_BASE()` returns the hash of the common ancestor between
two branches. Given the following branch structure:

Consider the following branch structure:

```text
      A---B---C feature
     /
D---E---F---G master
```

The following would return the hash of commit `E`:

```sql
SELECT DOLT_MERGE_BASE('feature', 'master');
```

## `HASHOF()`

The HASHOF function returns the commit hash of a branch,
e.g. `HASHOF("master")`.

## Functions for working with detached heads

Dolt also defines several functions useful for working in detached
head mode. See [that section](../branches.md#detached-head-mode) for
details.
