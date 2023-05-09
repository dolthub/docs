---
title: Branch Permissions
---

# Branch Permissions

## What are Branch Permissions?

Branch permissions are a way of managing how users may interact with branches when running Dolt as a server (via `dolt sql-server`).
The branch permissions model is composed of two system tables: `dolt_branch_control` and `dolt_branch_namespace_control`.
The former table handles branch modification, while the latter table handles branch creation.
All operations that are not explicitly done as a client connected to a server (such as locally using the CLI) will bypass branch permissions.

## System Tables

Both system tables—`dolt_branch_control` and `dolt_branch_namespace_control`—have a similar schema.
Each column is composed of a string that represents a pattern-matching expression.

### `dolt_branch_control`

| Column      | Type                          | Collation          |
|:------------|:------------------------------|:-------------------|
| database    | VARCHAR(16383)                | utf8mb4_0900_ai_ci |
| branch      | VARCHAR(16383)                | utf8mb4_0900_ai_ci |
| user        | VARCHAR(16383)                | utf8mb4_0900_bin   |
| host        | VARCHAR(16383)                | utf8mb4_0900_ai_ci |
| permissions | SET("admin", "write", "read") | utf8mb4_0900_ai_ci |

### `dolt_branch_namespace_control`

| Column   | Type           | Collation          |
|:---------|:---------------|:-------------------|
| database | VARCHAR(16383) | utf8mb4_0900_ai_ci |
| branch   | VARCHAR(16383) | utf8mb4_0900_ai_ci |
| user     | VARCHAR(16383) | utf8mb4_0900_bin   |
| host     | VARCHAR(16383) | utf8mb4_0900_ai_ci |

### Available Permissions

| Permission | Effect                                                                                                                                                                                                                              |
|:-----------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| admin      | Grants all permissions available. In addition, grants write access to entries on both system tables, as long as the database and branch are equivalent, or they're subset of the database + branch that this permission belongs to. |
| write      | Grants the ability to write on the branch, as well as modify the branch in all possible ways (rename, delete, etc.).                                                                                                                |
| read       | Does not explicitly grant any permissions, as having the ability to read a branch is an irrevocable right for all users. This is just for the visual convenience, versus having an empty field.                                     |

Just to reiterate: remember that all users, even those without an entry at all, still have read access to all branches.
Permissions only affect modifying branches, and writing to the system tables.

### Pattern Matching

The form of pattern matching that each column implements is very similar to how `LIKE` expressions are parsed.
Most characters are interpreted as-is, with the exception of three characters.

| Character | Function                                                                                                                                                                                    |
|:----------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| _         | Matches a single character, regardless of what that character is.                                                                                                                           |
| %         | Matches zero or more characters, regardless of what those characters are.                                                                                                                   |
| \         | Escapes the next character, allowing it to be compared literally. This is only useful when attempting to match one of these special characters, as it is otherwise ignored (has no effect). |

Due to the above rules, it is possible to write two different expressions that have the exact same match characteristics.
Rather than allow duplicates, Dolt processes each expression to find its most concise equivalent (folding the expression).
There are two rules that are repeatedly applied to strings until neither applies.
The first rule replaces `%%` with `%`.
The second rule replaces `%_` with `_%`.

The first rule is very straightforward, as two consecutive "zero or more" characters will still match "zero or more" characters.
The second rule simplifies parsing, and gives a definitive ordering to the two characters.
Our pattern matcher will create a branch whenever a matching character is found after a "zero or more" character, so ensuring that the "zero or more" character is at the end means that we can reduce at least one branch (that would have come from the "single match" character).

With these two rules, we are able to find matching duplicates and prevent their insertion.
These rules also have another side-effect, in that they grant us the ability to determine if a given match expression matches a strict subset of another expression.
This is accomplished by using a match expression as the input of another expression, and then checking that the expression's length is smaller.
This is used in several ways, such as when creating new branches (to prevent adding unnecessary new entries if an existing entry already encompasses the would-be entry), and also when ensuring that a user with the `admin` permission may modify the correct entries.

## Using the Tables

The branch permissions system tables, `dolt_branch_control` and `dolt_branch_namespace_control`, are both built on top of [users and privileges](access-management.md) system.

### Default State

When the `dolt_branch_control` table is first created, the following statement executes on it: `INSERT INTO dolt_branch_control VALUES ('%', '%', '%', '%', 'write');`.
This allows all users to freely modify all branches.
They can not, however, modify the system tables.

When the `dolt_branch_namespace_control` table is first created, it is empty.
This allows all users to freely create a branch with any name.

### Editing the System Tables

The modification of both system tables are controlled by two entities: the privileges system and the `dolt_branch_control` table itself.
Any user that satisfies the privilege requirements may edit the appropriate entries in both system tables.

| Scope        | Privileges                                                         | Remarks                                                                                                                                                 |
|:-------------|:-------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `*.*`        | SUPER, GRANT OPTION                                                | Considered a global admin. May edit any entry in either table, including entries containing special characters.                                         |
| `*.*`        | CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, EXECUTE, GRANT OPTION | Same as above.                                                                                                                                          |
| `database.*` | CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, EXECUTE, GRANT OPTION | Considered a database admin. May edit entries only for their specific database. This also excludes all databases that contain _any_ special characters. |

It is important to note that global and database admins do **not** have an implicit permission to modify branches.
They must insert their own row if they do not match a pre-existing row on their desired database and branch.
This ensures that the table is the single source-of-truth regarding which users may modify branches.

In addition to the above privileges, if a user has the `admin` permission, then that user may edit any entries in either system table that they either directly match, or their database and branch are supersets of the target entries (unless there is a more specific rule, which is further discussed below).

### Branch Modification

All users may read any branch.
The branch permissions tables primarily affect modification.
When a user (connected via a client to a Dolt instance running as a server) attempts any operation that may modify either the branch or its contents (tables, staged work, etc.), then the first system table, `dolt_branch_control`, is invoked.

To find all matching entries, we start with the global set of all entries.
We first match against the database, which (hopefully) reduces the set of entries.
Next we match against the branch, reducing the set further still.
We repeat the same process for the user name and host, which gives us our final set.
Out of the remaining entries, we filter them down to which entries are the most specific for that branch (e.g. `ab%` vs `abcd`), gather all of the permissions from the filtered set, and then check that the user has the required permissions to execute the desired statement.
If not, an error message is thrown.

This same process is also used when attempting to modify the system tables, except that there's an additional check for the user's privileges.
If they have the necessary privileges, then we skip the step where we match entries.

### Branch Creation

The `dolt_branch_namespace_control` only applies when a new branch is being created.
Any user may freely read from any branch and also create a new branch.
They may be restricted in the name that they're able to choose, though.

The process of determining whether a user may create a branch is broken into two sections.
In the first, we start with the global set of all entries, and retain all entries that match both the database and branch.
If this set is empty, then we **allow** the branch creation.
If this set is not empty, then we continue, matching the user and host.
If this final set is empty, then we **reject** the branch creation. However, if the final set is not empty, then we allow the branch creation.

After the branch has been created, we add a new entry to `dolt_branch_control` only if that entry would not be a subset of an existing entry with an `admin` permission.
This is to reduce duplicate entries as best we can in the table.
The new entry will exactly match all of the details of its creator, meaning that no special characters will be used.
This entry will also contain the `admin` permission, as the branch creator has full permission to modify their branch, as well as allowing others to modify their branch by adding new relevant entries to the system tables.
No entry is added to `dolt_branch_namespace_control`, as branches may not have duplicate names.

### Longest Match

For both `dolt_branch_control` and `dolt_branch_namespace_control`, we only consider the entry set that has the longest matching expressions.
This is so that the set contains the most specific entries to the target branch and user.
Because we [fold all of our match expressions](#pattern-matching), we can guarantee that all longer matches are a subset of shorter matches.
For example, `ab%` is shorter than `abc%`, and consequently `abcd` is a subset of `ab%`.
This does leave the case where matches of equivalent length may still be a superset/subset combo (such as `abc_` and `abcd`), however we treat them as having an equivalent specificity.

### Additional Branch Creation Considerations

It is worth noting that operations such as renaming a branch also require the correct permissions on `dolt_branch_control`, or the correct privileges to be an admin.
This is because a rename may be viewed as a copy and delete, therefore it is modifying the original branch.

To turn `dolt_branch_namespace_control` into a blacklist (just like `dolt_branch_control`), then run the following statement:
```sql
INSERT INTO dolt_branch_namespace_control VALUES ('%', '%', '', '');
```
This will add an entry that will match every possible branch, but will never match a user as a user will never have an empty user and host.
Due to the longest match rule, this entry will be ignored when a valid match is found.

## Storage

All data related to branch permissions is stored in the file `branch_control.db` under the dolt configuration directory (defaults to `.doltcfg`).
The rules for selecting a `branch_control.db` file [are the same as for the privileges file](access-management.md).

## Binlog

Currently, all operations are written to a binlog that is stored alongside the system tables.
There are no ways of accessing the binlog for now, but in the future support will be added.
The binlog is intended for correcting mistakes, as well as providing history on how the system tables have changed.

## Examples

The following examples are a small snippet that shows branch permissions in action.
It is assumed that this document has been read in full, as concepts that are explained in previous sections are not explained in-depth.
The [setup section](#setup) is run before each example, therefore remember to have a dedicated terminal window for [setup](#setup) if you want to try any of these examples yourself.
All examples other than [setup](#setup) will exclusively use the second terminal window.
In addition, all examples will use Dolt's built-in client, accessible using `dolt sql-client`.
It is not required to use that client, as it is just a standard MySQL client.
Feel free to use your desired MySQL client.

### Setup

This handles the creation of the directory, along with starting the server.
As we are running these examples locally, we will use two terminal windows.
The first window will contain the server, which we are starting here.
It is worth noting that the examples use the default host and port of `localhost:3306`.
If these are already in use for your system, then you may supply the arguments `--host="<your_host_here>"` and `--port=<your_port_here>` to change them.
`dolt sql-client` also takes these same arguments.

As explained in the [default state section](#default-state), we automatically add a row to the `dolt_branch_control` table that allows all users to modify all branches by default.
For these examples, we remove that default row.
This allows us to demonstrate the desired functionality a bit more easily.

By supplying the argument `--user=root`, we add a password-less user named `root` that has every global privilege.
This makes it very easy to get your database set up, and we will be taking advantage of this user in these examples.
We also, however, want a user that does _not_ have every privilege, and is more representative of a standard user.
We name that user `testuser` in the examples.
Although it appears that we grant them every global privilege, this is not the case, as they are still missing the `GRANT OPTION` privilege.
This means that they are not considered an admin, however we do not have to worry about assigning privileges to allow for basic table operations.
[You may read more about this behavior in an earlier section.](#editing-the-system-tables)

```
$ mkdir example

$ cd example

$ dolt init
Successfully initialized dolt data repository.

$ dolt sql -q "DELETE FROM dolt_branch_control;"
Query OK, 0 rows affected (0.00 sec)

$ dolt sql -q "CREATE USER testuser@localhost;"
Query OK, 0 rows affected (0.00 sec)

$ dolt sql -q "GRANT ALL ON *.* TO testuser@localhost;"
Query OK, 0 rows affected (0.00 sec)

$ dolt sql-server --user=root
Starting server with Config HP="localhost:3306"|T="28800000"|R="false"|L="info"
```

### The `write` Permission

Please refer to the [setup section](#setup) before continuing this example.
This example shows the `write` permission in action.
We add the `write` permission to the `testuser` user, which allows that user to modify the contents of our `main` (default) branch, while the `root` user does not have the permission and cannot make any modifications.

```
$ dolt sql-client --user=root
# Welcome to the Dolt MySQL client.
# Statements must be terminated with ';'.
# "exit" or "quit" (or Ctrl-D) to exit.
mysql> USE example;
mysql> INSERT INTO dolt_branch_control VALUES ('%', 'main', 'testuser', '%', 'write');
mysql> CREATE TABLE test (pk BIGINT PRIMARY KEY);
Error 1105: `root`@`%` does not have the correct permissions on branch `main`
mysql> exit;

$ dolt sql-client --user=testuser
# Welcome to the Dolt MySQL client.
# Statements must be terminated with ';'.
# "exit" or "quit" (or Ctrl-D) to exit.
mysql> USE example;
mysql> CREATE TABLE test (pk BIGINT PRIMARY KEY);
mysql> exit;
```

### The `admin` Permission

Please refer to the [setup section](#setup) before continuing this example.
This example shows the `admin` permission in action.
`admin` functions similarly to the `write` permission, however it also allows the user to `INSERT`/`UPDATE`/`DELETE` entries that match the database and branch (or the resulting set of potential matches from the database and branch match expressions are a subset of the one that contains the `admin` permission).
We show this by demonstrating that `testuser` cannot modify the `main` (default) branch at first, nor can they modify the `dolt_branch_control` and `dolt_branch_namespace_control` tables.
We then switch to `root` (who is a [global admin](#editing-the-system-tables)) and give `testuser` an `admin` permission over the `main%` branch.
The [special "zero or more" character](#pattern-matching) means that they may add additional entries of `main`, as well as other branches that begin with `main`.
The users added are all fake, and are just used to demonstrate the capability.
We end by showing that this only applies to the exact match expression, as the very similar `_main` branch name is still off-limits.

```
$ dolt sql-client --user=testuser
# Welcome to the Dolt MySQL client.
# Statements must be terminated with ';'.
# "exit" or "quit" (or Ctrl-D) to exit.
mysql> USE example;
mysql> CREATE TABLE test (pk BIGINT PRIMARY KEY);
Error 1105: `testuser`@`localhost` does not have the correct permissions on branch `main`
mysql> INSERT INTO dolt_branch_control VALUES ('example', 'main', 'newuser', '%', 'write');
Error 1105: `testuser`@`localhost` cannot add the row ["example", "main", "newuser", "%", "write"]
mysql> INSERT INTO dolt_branch_namespace_control VALUES ('example', 'main', 'newuser', '%');
Error 1105: `testuser`@`localhost` cannot add the row ["example", "main", "newuser", "%"]
mysql> exit;

$ dolt sql-client --user=root
# Welcome to the Dolt MySQL client.
# Statements must be terminated with ';'.
# "exit" or "quit" (or Ctrl-D) to exit.
mysql> USE example;
mysql> INSERT INTO dolt_branch_control VALUES ('example', 'main%', 'testuser', '%', 'admin');
mysql> exit;

$ dolt sql-client --user=testuser
# Welcome to the Dolt MySQL client.
# Statements must be terminated with ';'.
# "exit" or "quit" (or Ctrl-D) to exit.
mysql> USE example;
mysql> CREATE TABLE test (pk BIGINT PRIMARY KEY);
mysql> INSERT INTO dolt_branch_control VALUES ('example', 'main', 'newuser', '%', 'write');
mysql> INSERT INTO dolt_branch_control VALUES ('example', 'main_new', 'otheruser', '%', 'write');
mysql> INSERT INTO dolt_branch_control VALUES ('example', '_main', 'someuser', '%', 'write');
Error 1105: `testuser`@`localhost` cannot add the row ["example", "_main", "someuser", "%", "write"]
mysql> INSERT INTO dolt_branch_namespace_control VALUES ('example', 'main1', 'theuser', '%');
mysql> INSERT INTO dolt_branch_namespace_control VALUES ('example', '_main', 'anotheruser', '%');
Error 1105: `testuser`@`localhost` cannot add the row ["example", "_main", "anotheruser", "%"]
mysql> exit;
```

### Restricting Branch Names
Please refer to the [setup section](#setup) before continuing this example.
This example shows how to [restrict which users are able to use branch names](#branch-creation) with the `main` prefix.
To do this, we insert a `main%` entry into the `dolt_branch_namespace_control` table, assigning the `testuser` user.
We create another entry with `mainroot%` as the branch name, and assign that to `root`.
This means that `root` is able to create any branches with names that **do not** start with `main`, but is unable to create branches that **do** start with `main`.
The exception being `mainroot`, which while having `main` as a prefix, it is considered [the longest match](#longest-match), and therefore takes precedence over the `main%` entry.
Consequently, `testuser` cannot use `mainroot` as a prefix, as [the longest match](#longest-match) overrides their `main%` entry.

```
$ dolt sql-client --user=root
# Welcome to the Dolt MySQL client.
# Statements must be terminated with ';'.
# "exit" or "quit" (or Ctrl-D) to exit.
mysql> USE example;
mysql> INSERT INTO dolt_branch_namespace_control VALUES ('%', 'main%', 'testuser', '%');
mysql> INSERT INTO dolt_branch_namespace_control VALUES ('%', 'mainroot%', 'root', '%');
mysql> CALL DOLT_BRANCH('does_not_start_with_main');
+--------+
| status |
+--------+
| 0      |
+--------+
1 row in set (0.00 sec)

mysql> CALL DOLT_BRANCH('main1');
Error 1105: `root`@`%` cannot create a branch named `main1`
mysql> CALL DOLT_BRANCH('mainroot');
+--------+
| status |
+--------+
| 0      |
+--------+
1 row in set (0.00 sec)

mysql> exit;

$ dolt sql-client --user=testuser
# Welcome to the Dolt MySQL client.
# Statements must be terminated with ';'.
# "exit" or "quit" (or Ctrl-D) to exit.
mysql> USE example;
mysql> CALL DOLT_BRANCH('main1');
+--------+
| status |
+--------+
| 0      |
+--------+
1 row in set (0.00 sec)

mysql> CALL DOLT_BRANCH('mainroot1');
Error 1105: `testuser`@`localhost` cannot create a branch named `mainroot1`
mysql> exit;
```

### Multiple Databases

Please refer to the [setup section](#setup) before continuing this example.
This example simply shows how an entry in each system table is scoped to a database.
Our pre-existing database is `example`, as Dolt uses the directory's name for its database name.
Therefore, we create another database named `newdb`, which the user `root` will not have any permissions on.

```
dolt sql-client --user=root
# Welcome to the Dolt MySQL client.
# Statements must be terminated with ';'.
# "exit" or "quit" (or Ctrl-D) to exit.
mysql> USE example;
mysql> CREATE TABLE test (pk BIGINT PRIMARY KEY);
Error 1105: `root`@`%` does not have the correct permissions on branch `main`
mysql> INSERT INTO dolt_branch_control VALUES ('example', '%', 'root', '%', 'write');
mysql> CREATE TABLE test (pk BIGINT PRIMARY KEY);
mysql> DROP TABLE test;
mysql> CREATE DATABASE newdb;
mysql> USE newdb;
mysql> CREATE TABLE test2 (pk BIGINT PRIMARY KEY);
Error 1105: `root`@`%` does not have the correct permissions on branch `main`
mysql> exit;
```
