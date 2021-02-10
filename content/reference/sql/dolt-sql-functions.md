---
title: Dolt SQL Functions
---

### `DOLT_COMMIT()`

#### Description

Commits staged tables to HEAD. Works exactly like `dolt commit` with each value directly following the flag. Note that you must always support the message flag with the intended message right after.

By default, when running in server mode with dolt sql-server, dolt does not automatically update the working set of your repository with data updates unless @@autocommit is set to 1. You can also issue manual COMMIT statements to flush the working set to disk. See the section on [concurrency](https://www.dolthub.com/docs/reference/sql/#concurrency).

```sql
SELECT DOLT_COMMIT('-a', '-m', 'This is a commit');
SELECT DOLT_COMMIT('-m', 'This is a commit');
SELECT DOLT_COMMIT('-m', 'This is a commit', '--author', 'John Doe <johndoe@example.com>');
```

#### Options

`-m`, `--message`: Use the given `<msg>` as the commit message. **Required**

`-a`: Stages all tables with changes before committing

`--allow-empty`: Allow recording a commit that has the exact same data as its sole parent. This is usually a mistake, so it is disabled by default. This option bypasses that safety.

`--date`: Specify the date used in the commit. If not specified the current system time is used.

`--author`: Specify an explicit author using the standard "A U Thor [author@example.com](mailto:author@example.com)" format.

#### Example

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
