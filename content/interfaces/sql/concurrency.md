---
title: Concurrency
---

# Concurrency

Dolt supports SQL transactions using the standard transaction control
statements: `START TRANSACTION`, `COMMIT`, `ROLLBACK`, and
`SAVEPOINT`. The `@@autocommit` session variable is also supported,
and behaves identically as in MySQL. `@@autocommit` is enabled by
default using the `dolt sql` shell and the MySQL shell, but some other
clients turn it off by default (notably the [Python mysql
connector](https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysqlconnection-autocommit.html).

## Session variables

### @@dbname\_head

The session variable `dbname_head` \(Where dbname is the name of the database\) provides an interface for reading and writing the HEAD commit for a session.

```sql
# Set the head commit to a specific hash.
SET @@mydb_head = 'fe31vq5c0qj1afnghl0d9448652smlo0';

# Get the head commit
SELECT @@mydb_head;
```

### HASHOF\(\)

The HASHOF function returns the hash of a branch such as `HASHOF("master")`.

### COMMIT\(\)

The COMMIT function writes a new commit to the database and returns the hash of that commit. The argument passed to the function is the commit message. The author's name and email for this commit will be determined by the server or can be provided by the user. on the repo.

Dolt provides a manual commit mode where a user works with a detached HEAD whose value is accessible and modifiable through the session variable @@dbname\_head \(where dbname is the name of the database whose pointer you wish to read or write\). You can write new commits to the database by inserting and updating rows in the dolt\_branches table. See below for details on how this works.

See the below examples for details.

Example:

```sql
SET @@mydb_head = COMMIT('-m', 'my commit message');
```

## Options

-m, --message: Use the given `<msg>` as the commit message. Required

-a: Stages all tables with changes before committing

--allow-empty: Allow recording a commit that has the exact same data as its sole parent. This is usually a mistake, so it is disabled by default. This option bypasses that safety.

--date: Specify the date used in the commit. If not specified the current system time is used.

--author: Specify an explicit author using the standard "A U Thor author@example.com" format.

### MERGE\(\)

The MERGE function merges a branch reference into HEAD. The argument passed to the function is a reference to a branch \(its name\). The author's name and email for this commit will be determined by the server or can be provided by the user.

Example:

```sql
SET @@mydb_head = MERGE('feature-branch');
```

## Options

--author: Specify an explicit author using the standard "A U Thor author@example.com" format.

### SQUASH\(\)

The SQUASH function merges a branch's root value into the current branch's working set. With this approach the user can then commit the changes, adding only 1 commit to a branch's
history compared to the many that can orginate from a conventional merge.

The argument passed to the function is a reference to a branch \(its name\).

Example:

```sql
SET @@mydb_working = SQUASH('feature-branch');
SET @@mydb_head = COMMIT('-m', 'This is a squash merge')
```
### dolt\_branches

dolt\_branches is a system table that can be used to create, modify and delete branches in a dolt data repository via SQL.

### Putting it all together

An example showing how to make modifications and create a new feature branch from those modifications.

```sql
-- Set the current database
USE mydb;

-- Set the HEAD commit to the latest commit of the branch "master"
SET @@mydb_head = HASHOF("master");

-- Make modifications
UPDATE table
SET column = "new value"
WHERE pk = "key";

-- Create a new commit containing these modifications and set the HEAD commit for this session to that commit
SET @@mydb_head = COMMIT("-m", "modified something")

-- Create a new branch with these changes
INSERT INTO dolt_branches (name,hash)
VALUES ("new_branch", @@mydb_head);
```

An example attempting to change the value of master, but only if nobody else has modified it since we read it.

```sql
-- Set the current database for the session
USE mydb;

-- Set the HEAD commit to the latest commit to the branch "master"
SET @@mydb_head = HASHOF("master");

-- Make modifications
UPDATE table
SET column = "new value"
WHERE pk = "key";

-- Modify master if nobody else has changed it
UPDATE dolt_branches
SET hash = COMMIT("-m", "modified something")
WHERE name == "master" and hash == @@mydb_head;

-- Set the HEAD commit to the latest commit to the branch "master" which we just wrote
SET @@mydb_head = HASHOF("master");
```

An example of making changes to a feature branch and merging into master.

```sql
-- Set the current database for the session
USE mydb;

-- Set the HEAD commit to the latest commit to the branch "feature-branch"
SET @@mydb_head = HASHOF("feature-branch");

-- Make modifications
UPDATE table
SET column = "new value"
WHERE pk = "key";

-- Create the commit of the changes and insert it into the feature branch
SET @@mydb_head = COMMIT("-m", "Update the value on feature-branch");
INSERT INTO dolt_branches (name, hash)
VALUES("feature-branch", @@mydb_head);

-- Set the HEAD commit to the branch "master".
SET @@mydb_head = HASHOF("master")

-- MERGE the feature-branch into master and get a commit
SET @@mydb_head = MERGE('feature-branch');

-- Set the HEAD commit to the latest commit to the branch "master"
INSERT INTO dolt_branches (name, hash)
VALUES("master", @@mydb_head);
```
