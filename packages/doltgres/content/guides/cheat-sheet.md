---
title: Doltgres Cheat Sheet
---

# Doltgres Cheat Sheet

This cheat sheet briefly summarizes the main version-control features of Doltgres with simple
examples.

Click links in the comments section to read docs for the feature.

## Setup and init

| SQL                                                | Comments                                                                                                                            |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `CREATE DATABASE mydb;`                            | Creates a new Dolt database                                                                                                         |
| `SELECT DOLT_CLONE('post-no-preference/options');` | [Clones the `post-no-preference/options` database from DoltHub](../reference/sql/version-control/dolt-sql-procedures.md#dolt_clone) |

## Stage and snapshot

| SQL                                      | Comments                                                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `SELECT DOLT_ADD('myTable');`            | [Adds a table to the staging area](../reference/sql/version-control/dolt-sql-procedures.md#dolt_add)                |
| `SELECT DOLT_RESET();`                   | [Removes staged tables, keeps working changes](../reference/sql/version-control/dolt-sql-procedures.md#dolt_reset)  |
| `SELECT DOLT_RESET('--hard');`           | [Resets all staged and working changes to HEAD](../reference/sql/version-control/dolt-sql-procedures.md#dolt_reset) |
| `SELECT DOLT_COMMIT('-m', 'a commit');`  | [Commits staged tables as a new snapshot](../reference/sql/version-control/dolt-sql-procedures.md#dolt_commit)      |
| `SELECT DOLT_COMMIT('-Am', 'a commit');` | [Stages and commits all tables](../reference/sql/version-control/dolt-sql-procedures.md#dolt_commit)                |

## Branch and merge

| SQL                                       | Comments                                                                                                          |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `SELECT * FROM dolt_branches;`            | [Lists all branches](../reference/sql/version-control/dolt-system-tables.md#dolt_branches)                        |
| `SELECT DOLT_BRANCH('myBranch');`         | [Creates a new branch](../reference/sql/version-control/dolt-sql-procedures.md#dolt_branch)                       |
| `SELECT DOLT_CHECKOUT('myBranch');`       | [Switches to another branch](../reference/sql/version-control/dolt-sql-procedures.md#dolt_checkout)               |
| `SELECT DOLT_CHECKOUT('-b', 'myBranch');` | [Creates a new branch and switches to it](../reference/sql/version-control/dolt-sql-procedures.md#dolt_checkout)  |
| `SELECT DOLT_MERGE('myBranch');`          | [Merges a branch into the checked out branch](../reference/sql/version-control/dolt-sql-procedures.md#dolt_merge) |

## Diffing

| SQL                                                           | Comments                                                                                                                      |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `SELECT * FROM dolt_diff('HEAD', 'WORKING', 'mytable');`      | [Shows the working diff for `mytable`](../reference/sql/version-control/dolt-sql-functions.md#dolt_diff)                      |
| `SELECT * FROM dolt_diff_stat('HEAD', 'WORKING', 'mytable');` | [Shows statistics for the diff of `mytable`](../reference/sql/version-control/dolt-sql-functions.md#dolt_diff_stat)           |
| `SELECT * FROM dolt_diff('HEAD~', 'HEAD', 'mytable');`        | [Shows the diff between the last two commits for `mytable`](../reference/sql/version-control/dolt-sql-functions.md#dolt_diff) |
| `SELECT * FROM dolt_diff('HEAD', 'STAGED', 'mytable');`       | [Shows the staged diff for `mytable`](../reference/sql/version-control/dolt-sql-functions.md#dolt_diff)                       |
| `SELECT * FROM dolt_diff('branchA', 'branchB', 'mytable');`   | [Shows diff between branches two branches for `mytable`](../reference/sql/version-control/dolt-sql-functions.md#dolt_diff)    |

## Status and logs

| SQL                                           | Comments                                                                                                                |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `SELECT * FROM dolt_status;`                  | [Shows which tables are modified or staged](../reference/sql/version-control/dolt-system-tables.md#dolt_status)         |
| `SELECT active_branch();`                     | [Shows the checked out branch](../reference/sql/version-control/dolt-sql-functions.md#active_branch)                    |
| `SELECT * FROM dolt_log;`                     | [Shows the commit history for the current branch](../reference/sql/version-control/dolt-system-tables.md#dolt_log)      |
| `SELECT * FROM dolt_log('myBranch');`         | [Shows the commit history for myBranch](../reference/sql/version-control/dolt-sql-functions.md#dolt_log)                |
| `SELECT * FROM dolt_log('branchB..branchA');` | [Shows the commits on branchA that are not on branchB](../reference/sql/version-control/dolt-sql-functions.md#dolt_log) |

## History

| SQL                                                                                     | Comments                                                                                                                                              |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SELECT * FROM mytable AS OF 'HEAD~3';`                                                 | [Selects data from 3 commits ago](../reference/sql/version-control/querying-history.md#querying-past-snapshots-with-as-of)                            |
| `USE mydb/HEAD~3;`                                                                      | [Sets this session to query data from 3 commits ago](../reference/sql/version-control/querying-history.md#specifying-a-revision-in-the-database-name) |
| `SELECT * FROM dolt_history_mytable;`                                                   | [Selects every row from `mytable` at every point in history](../reference/sql/version-control/dolt-system-tables.md#dolt_history_usdtablename)        |
| `SELECT committer FROM dolt_history_mytable where id = 1 order by commit_date LIMIT 1;` | [Selects who first added the row with `id = 1` to `mytable`](../reference/sql/version-control/dolt-system-tables.md#dolt_history_usdtablename)        |

## Working with remotes

| SQL                                                      | Comments                                                                                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `SELECT DOLT_REMOTE('add', 'myRemote', 'myOrg/myRepo');` | [Adds a new DoltHub remote](../reference/sql/version-control/dolt-sql-procedures.md#dolt_remote)                                |
| `SELECT * FROM dolt_remotes;`                            | [Lists remotes](../reference/sql/version-control/dolt-system-tables.md#dolt_remotes)                                            |
| `SELECT DOLT_FETCH();`                                   | [Fetches all branches from the remote](../reference/sql/version-control/dolt-sql-procedures.md#dolt_fetch)                      |
| `SELECT DOLT_PULL();`                                    | [Fetch and merge commits from the remote tracking branch](../reference/sql/version-control/dolt-sql-procedures.md#dolt_pull)    |
| `SELECT DOLT_PUSH('origin', 'myBranch');`                | [Push local commits of branch `myBranch` to remote `origin`](../reference/sql/version-control/dolt-sql-procedures.md#dolt_push) |
| `SELECT DOLT_PUSH();`                                    | [Push local commits to the remote tracking branch](../reference/sql/version-control/dolt-sql-procedures.md#dolt_push)           |

## Advanced use cases

| SQL                                                                       | Comments                                                                                                                                                  |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SELECT HASHOF('main');`                                                  | [Shows the commit hash of a ref](../reference/sql/version-control/dolt-sql-functions.md#hashof)                                                           |
| `SELECT * from dolt_blame_mytable;`                                       | [Shows who last updated every row of a table](../reference/sql/version-control/dolt-system-tables.md#dolt_blame_usdtablename)                             |
| `SELECT * FROM dolt_diff('branch1...branch2');`                           | [Shows a three-dot diff](../reference/sql/version-control/dolt-sql-functions.md#dolt_diff)                                                                |
| `SELECT DOLT_REVERT('gtfv1qhr5le61njimcbses9oom0de41e');`                 | [Creates a new commit which reverts the changes in a prior commit](../reference/sql/version-control/dolt-sql-procedures.md#dolt_revert)                   |
| `SELECT * FROM DOLT_PATCH('main', 'WORKING');`                            | [Creates SQL statements to apply a diff between two revisions](../reference/sql/version-control/dolt-sql-functions.md#dolt_patch)                         |
| `SELECT * FROM dolt_conflicts;`                                           | [Lists which tables have conflicts after a merge](../reference/sql/version-control/dolt-system-tables.md#dolt_conflicts)                                  |
| `SELECT * FROM [dolt_conflicts_mytable];`                                 | [Lists the rows in conflict for `mytable`](../reference/sql/version-control/dolt-system-tables.md#dolt_conflicts_usdtablename)                            |
| `SELECT DOLT_CONFLICTS_RESOLVE('--theirs', 'mytable');`                   | [Resolves conflicts in `mytable` by taking their changes](../reference/sql/version-control/dolt-sql-procedures.md#dolt_conflicts_resolve)                 |
| `SELECT DOLT_TAG('tag1', 'myBranch');`                                    | [Creates a new tag at the HEAD of `mybranch`](../reference/sql/version-control/dolt-sql-procedures.md#dolt_tag)                                           |
| `SELECT DOLT_CHERRY_PICK('qj6ouhjvtrnp1rgbvajaohmthoru2772');`            | [Applies the changes in a commit to the current branch HEAD](../reference/sql/version-control/dolt-sql-procedures.md#dolt_cherry_pick)                    |
| `SELECT * FROM dolt_schema_diff('main', 'branch1', 'mytable');`           | [Shows schema differences for a table between two commits](../reference/sql/version-control/dolt-sql-functions.md#dolt_schema_diff)                       |
| `SELECT DOLT_VERIFY_CONSTRAINTS();`                                       | [Checks for constraint violations (e.g. after checks had been disabled)](../reference/sql/version-control/dolt-sql-procedures.md#dolt_verify_constraints) |
| `SELECT DOLT_GC();`                                                       | [Runs garbage collection to compact the size of the database on disk](../reference/sql/version-control/dolt-sql-procedures.md#dolt_gc)                    |
| `SELECT DOLT_REBASE('--interactive', 'main');`                            | [Begins an interactive rebase session](../reference/sql/version-control/dolt-sql-procedures.md#dolt_rebase)                                               |
| `SELECT * FROM dolt_reflog('mybranch');`                                  | [Shows the history of a ref, included deleted refs](../reference/sql/version-control/dolt-sql-functions.md#dolt_reflog)                                   |
| `SELECT * FROM dolt_commit_ancestors where commit_hash = HASHOF('main');` | [Shows the parent commit(s) of a commit](../reference/sql/version-control/dolt-system-tables.md#dolt_commit_ancestors)                                    |
| `SELECT DOLT_MERGE_BASE('main', 'feature');`                              | [Shows the common ancestor of two commits](../reference/sql/version-control/dolt-sql-functions.md#dolt_merge_base)                                        |
| `SELECT * FROM dolt_commits;`                                             | [Shows all commits on all branches](../reference/sql/version-control/dolt-system-tables.md#dolt_commits)                                                  |
| `INSERT INTO dolt_ignore VALUES ('generated_*', true);`                   | [Ignores tables matching `generated*` (won't be added or committed)](../reference/sql/version-control/dolt-system-tables.md#dolt_ignore)                  |
