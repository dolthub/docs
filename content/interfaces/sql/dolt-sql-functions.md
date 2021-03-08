---
title: Dolt SQL Functions
---

# Dolt SQL Functions

Dolt provides SQL functions to allow access to command line `dolt`
commands from within a SQL session. Each command is named after the
`dolt` command line command it matches, and takes arguments in an
identical form. 

For example, `dolt commit -m 'Added a table'` is equivalent to
executing the following SQL statement:

```sql
SELECT DOLT_COMMIT('-m', 'Added a table');
```

SQL functions are provided for all imperative CLI commands. For
commands that inspect the state of the repository and print some
information, (`dolt diff`, `dolt log`, etc.) [system
tables](dolt-system-tables) are provided instead.

### DOLT_COMMIT\(\)

### Description

Commits staged tables to HEAD. Works exactly like `dolt commit` with each value directly following the flag. Note that you must always support the message flag with the intended message right after.

By default, when running in server mode with dolt sql-server, dolt does not automatically update the working set of your repository with data updates unless @@autocommit is set to 1. You can also issue manual COMMIT statements to flush the working set to disk. See the section on [concurrency](https://www.dolthub.com/docs/reference/sql/#concurrency).

```sql
SELECT DOLT_COMMIT('-a', '-m', 'This is a commit');
SELECT DOLT_COMMIT('-m', 'This is a commit');
SELECT DOLT_COMMIT('-m', 'This is a commit', '--author', 'John Doe <johndoe@example.com>');
```

### Options

`-m`, `--message`: Use the given `<msg>` as the commit message. **Required**

`-a`: Stages all tables with changes before committing

`--allow-empty`: Allow recording a commit that has the exact same data as its sole parent. This is usually a mistake, so it is disabled by default. This option bypasses that safety.

`--date`: Specify the date used in the commit. If not specified the current system time is used.

`--author`: Specify an explicit author using the standard "A U Thor [author@example.com](mailto:author@example.com)" format.

### Example

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

### DOLT_ADD\(\)

### Description

Adds working changes to staged. Works exactly like `dolt add` with each value directly following the flag.

By default, when running in server mode with dolt sql-server, dolt does not automatically update the working set of your repository with data updates unless @@autocommit is set to 1. Hence, this method will only work in autocommit mode.

```sql
SELECT DOLT_ADD('-A');
SELECT DOLT_ADD('.');
SELECT DOLT_ADD('<table1>', '<table2>');
```

### Options

`table`: Working table(s) to add to the list tables staged to be committed. The abbreviation '.' can be used to add all tables.

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
SELECT DOLT_COMMIT('-m', 'commiting all changes');
```

### DOLT_CHECKOUT\(\)

### Description

Updates tables in the working set to match the staged versions. If no paths are given, DOLT_CHECKOUT will also update HEAD to set the specified branch as the current branch. Works exactly like `dolt checkout` with each value directly following the flag. 

By default, when running in server mode with dolt sql-server, dolt does not automatically update the working set of your repository with data updates unless @@autocommit is set to 1. Hence, this method will only work in autocommit mode.

```sql
SELECT DOLT_CHECKOUT('-b', 'my-new-branch');
SELECT DOLT_CHECKOUT('my-existing-branch');
SELECT DOLT_CHECKOUT('my-table-in-HEAD');
```

### Options

`-b`: Create a new branch with your desired name.

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
SELECT DOLT_COMMIT('-a', '-m', 'commiting all changes');

-- Go back to master
SELECT DOLT_CHECKOUT('master');
```

### DOLT_MERGE\(\)

### Description

Incorporates changes from the named commits (since the time their histories diverged from the current branch) into the current branch. Works exactly like `dolt merge`.

By default, when running in server mode with dolt sql-server, dolt does not automatically update the working set of your repository with data updates unless @@autocommit is set to 1. Hence, this method will only work in autocommit mode.

```sql
SELECT DOLT_MERGE('feature-branch'); -- Optional --squash parameter
SELECT DOLT_MERGE('feature-branch', '-no-ff', '-m', 'This is a msg for a non fast forward merge');
SELECT DOLT_MERGE('--abort');
```

### Options

`--no-ff`: Create a merge commit even when the merge resolves as a fast-forward.

`--squash`: Merges changes to the working set without updating the commit history

`-m <msg>, --message=<msg>`: Use the given <msg> as the commit message. This is only useful for --non-ff commits.

`--abort`: Abort the current conflict resolution process, and try to reconstruct the pre-merge state.

If there were uncommitted working set changes present when the merge started, `DOLT_MERGE('--abort')` will be unable to reconstruct these changes. It is therefore recommended to always commit or stash your changes
before running dolt merge.

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
SELECT DOLT_COMMIT('-a', '-m', 'commiting all changes');

-- Go back to master
SELECT DOLT_MERGE('feature-branch');
```

### DOLT_RESET\(\)

### Description

Resets staged tables to their HEAD state. Works exactly like `dolt reset`.

By default, when running in server mode with dolt sql-server, dolt does not automatically update the working set of your repository with data updates unless @@autocommit is set to 1. Hence, this method will only work in autocommit mode.

```sql
SELECT DOLT_RESET('--hard');
SELECT DOLT_RESET('my-table'); -- soft reset
```

### Options

`--hard`:  Resets the working tables and staged tables. Any changes to tracked tables in the working tree since <commit> are discarded.

`--soft`: Does not touch the working tables, but removes all tables staged to be committed. This is the default behavior.

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

