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

| Column      | Type                  | Collation          |
|:------------|:----------------------|:-------------------|
| database    | VARCHAR(16383)        | utf8mb4_0900_ai_ci |
| branch      | VARCHAR(16383)        | utf8mb4_0900_ai_ci |
| user        | VARCHAR(16383)        | utf8mb4_0900_bin   |
| host        | VARCHAR(16383)        | utf8mb4_0900_ai_ci |
| permissions | SET("admin", "write") | utf8mb4_0900_ai_ci |

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

Do remember that all users, even those without an entry at all, still have read access to all branches.
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

In addition to the above privileges, if a user has the `admin` permission, then that user may edit any entries in either system table that they either directly match, or their database and branch are supersets of the target entries.

### Branch Modification

All users may read any branch.
The branch permissions tables only affect modification.
When a user (connected via a client to a Dolt instance running as a server) attempts any operation that may modify either the branch or its contents (tables, staged work, etc.), then the first system table, `dolt_branch_control`, is invoked.

To find all matching entries, we start with the global set of all entries.
We first match against the database, which (hopefully) reduces the set of entries.
Next we match against the branch, reducing the set further still.
We repeat the same process for the user name and host, which gives us our final set.
Out of the remaining entries, we gather all of the permissions, and then check that the user has the required permissions to execute the desired statement.
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

As the `dolt_branch_namespace_control` is intended for controlling "namespaces", we only consider the entry set that has the longest branch expressions.
This is so that the set contains the most specific entries to the target branch name.
Because we fold all of our match expressions, we can guarantee that the longest matching expression is the smallest subset of all other possible entries that may match.

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
