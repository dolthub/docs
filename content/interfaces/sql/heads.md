# Working with multiple heads

Unlike other relational databases, Dolt has multiple heads, one for
each branch in the database. Multiple clients can connect to each
head, and will see other writes to the same head following the normal
SQL transactional isolation semantics (REPEATABLE_READ). In effect,
each head functions as is its own isolated database instance, with
changes only visible to other clients connected to the same head.

![A Dolt database server with multiple heads](../../.gitbook/assets/dolt-server-branches.png)

A database server has a default head, which is the checked-out branch
at the time the server was started. Each client can choose a specific
head to connect to with their connection string, or change it for
their session with various statements.

## Specify a head in the connection string

The exact connection string you need to use will vary depending on
your client.

To connect to the default head, use a connection string with the name
of the database only.

`mysql://127.0.0.1:3306/mydb`

To connect to a different branch, specify that branch name with a
slash after the database name:

`mysql://127.0.0.1:3306/mydb/feature-branch`

To connect to a specific revision of the database, use a commit hash
instead of a branch name. The database will be read-only in this case.

`mysql://127.0.0.1:3306/mydb/ia1ibijq8hq1llr7u85uivsi5lh3310p`

## Switch heads with the `USE` statement

Following the above connection string examples, you can issue `USE`
statements to switch your current head.

`USE mydb` switches to the default branch

`USE \`mydb/feature-branch\`` switches to the feature branch
given. Note that the string must be back-tick quoted, since it
contains a `/` character.

`USE \`mydb/ia1ibijq8hq1llr7u85uivsi5lh3310p\`` switches to a
read-only database at the commit hash given.

## Switch heads with the `DOLT_CHECKOUT` function

The `DOLT_CHECKOUT` SQL function provides identical functionality as
the `dolt checkout` command on the command line, and accepts the same
arguments.

`SELECT DOLT_CHECKOUT('feature-branch');` switches the session to the
`feature-branch` branch. You can also switch to a new branch, like so:

`SELECT DOLT_CHECKOUT('-b', 'new-branch');`

You can switch to a new branch with a starting commit as well:

`SELECT DOLT_CHECKOUT('-b', 'new-branch-at-commit', 'ia1ibijq8hq1llr7u85uivsi5lh3310p')`

## Switch heads with a session variable

Each session defines a system variable that controls the current
session head. For a database called `mydb` as above, this variable
will be called `@@mydb_head_ref` and be set to the current head.

```sql
mydb> select @@mydb_head_ref;
+-------------------------+
| @@SESSION.mydb_head_ref |
+-------------------------+
| refs/heads/master       |
+-------------------------+
```

To switch heads, set this session variable. Use either
`refs/heads/branchName` or just `branchName`:

`SET @@mydb_head_ref = 'feature-branch'`

# Notes on switching heads

If you have outstanding changes in your session (because you have
issued DML or DDL statements to change the data or schema), you must
`COMMIT` them or `ROLLBACK` the transaction before switching heads.

# Detached head mode

The above methods assume you want to update a head collaboratively
with many sessions via transactions, like a traditional database. But
it's also possible to operate the database in detached head mode,
where the head you are editing is local to only your session and
cannot be seen by any other session. 

Dolt supports special system variables and functions to support this
use case.

## `@@dbname\_head`

The session variable `@@dbname_head` \(Where dbname is the name of the
database\) provides an interface for reading and writing the HEAD
commit for a session, using its commit hash.

```sql
# Set the head commit to a specific hash.
SET @@mydb_head = 'fe31vq5c0qj1afnghl0d9448652smlo0';

# Get the head commit
SELECT @@mydb_head;
```

When you set your session head variable like above, you enter detached
head mode.

## `COMMIT\(\)`

The `COMMIT()` function writes a new commit to the database and
returns the hash of that commit. Unlike `DOLT_COMMIT()`, the
`COMMIT()` function does not update the current head. Rather, it
creates a dangling commit not associated with any branch or head.

To associate your session with the new commit created by this
function, assign it to the session head variable:

```sql
SET @@mydb_head = COMMIT('-m', 'my commit message');
```

Doing so causes your session to enter detached head mode.

### Options

-m, --message: Use the given `<msg>` as the commit message. Required

-a: Stages all tables with changes before committing

--allow-empty: Allow recording a commit that has the exact same data
as its sole parent. This is usually a mistake, so it is disabled by
default. This option bypasses that safety.

--date: Specify the date used in the commit. If not specified the
current system time is used.

--author: Specify an explicit author using the standard "A U Thor
author@example.com" format.

## `MERGE\(\)`

The `MERGE()` function merges a branch reference into the current
head. Unlike `DOLT_MERGE()`, the current head is not updated. Rather,
a dangling commit is created, which you must associate with your
session manually by assigning it to the session head variable:

Example:

```sql
SET @@mydb_head = MERGE('feature-branch');
```

### Options

--author: Specify an explicit author using the standard "A U Thor author@example.com" format.

## `SQUASH\(\)`

The SQUASH function merges a branch's root value into the current
branch's working set. With this approach the user can then commit the
changes, adding only 1 commit to a branch's history compared to the
many that can orginate from a conventional merge.

The argument passed to the function is a reference to a branch \(its name\).

Example:

```sql
SET @@mydb_working = SQUASH('feature-branch');
SET @@mydb_head = COMMIT('-m', 'This is a squash merge')
```

## Using detached head mode to update a branch

An example showing how to make modifications and create a new feature
branch from those modifications.

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

An example attempting to change the value of master, but only if
nobody else has modified it since we read it.

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
