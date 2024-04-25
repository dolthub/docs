---
title: Dolt Cheat Sheet
---

# Dolt Cheat Sheet

This cheat sheet briefly summarizes the main version-control features of Dolt with simple
examples. Most commands can be executed on the command line or in a SQL session. Most Dolt commands
take the same options as Git commands.

Click links in the SQL syntax to read more detailed documentation for the feature.

## Setup and init

| SQL server                                                                                                             | Dolt CLI                                | Comments                                                      |
| ---                                                                                                                    | -----                                   | --------                                                      |
| `CREATE DATABASE mydb;`                                                                                                | `dolt init`                             | Creates a new Dolt database                                   |
| `CALL [DOLT_CLONE('post-no-preference/options')](../reference/sql/version-control/dolt-sql-procedures.md#dolt_clone);` | `dolt clone post-no-preference/options` | Clones the `post-no-preference/options` database from DoltHub |

## Stage and snapshot

| SQL server                                                                                                    | Dolt CLI                     | Comments                                      |
| ---                                                                                                           | -----                        | --------                                      |
| `CALL [DOLT_ADD('myTable')](../reference/sql/version-control/dolt-sql-procedures.md#dolt_add);`               | `dolt add myTable`           | Adds a table to the staging area              |
| `CALL [DOLT_RESET()](../reference/sql/version-control/dolt-sql-procedures.md#dolt_reset);`                    | `dolt reset`                 | Removes staged tables, keeps working changes  |
| `CALL [DOLT_RESET('--hard')](../reference/sql/version-control/dolt-sql-procedures.md#dolt_reset);`            | `dolt reset --hard`          | Resets all staged and working changes to HEAD |
| `CALL [DOLT_COMMIT('-m', 'a commit')](../reference/sql/version-control/dolt-sql-procedures.md#dolt_commit);`  | `dolt commit -m 'a commit'`  | Commits staged tables as a new snapshot       |
| `CALL [DOLT_COMMIT('-Am', 'a commit')](../reference/sql/version-control/dolt-sql-procedures.md#dolt_commit);` | `dolt commit -Am 'a commit'` | Stages and commits all tables                 |

## Branch and merge 

| SQL server                                                                                                       | Dolt CLI                    | Comments                                    |
| ---                                                                                                              | -----                       | --------                                    |
| `SELECT * FROM [dolt_branches](../reference/sql/version-control/dolt-system-tables.md#dolt_branches);`           | `dolt branch`               | Lists all branches                          |
| `CALL [DOLT_BRANCH('myBranch')](../reference/sql/version-control/dolt-sql-procedures.md#dolt_branch);`           | `dolt branch myBranch`      | Creates a new branch                        |
| `CALL [DOLT_CHECKOUT('myBranch')](../reference/sql/version-control/dolt-sql-procedures.md#dolt_checkout);`       | `dolt checkout myBranch`    | Switches to another branch                  |
| `CALL [DOLT_CHECKOUT('-b', 'myBranch')](../reference/sql/version-control/dolt-sql-procedures.md#dolt_checkout);` | `dolt checkout -b myBranch` | Creates a new branch and switches to it     |
| `CALL [DOLT_MERGE('myBranch')](../reference/sql/version-control/dolt-sql-procedures.md#dolt_merge);`             | `dolt merge mybranch`       | Merges a branch into the checked out branch |

## Diffing

| SQL server                                                                                                                          | Dolt CLI                            | Comments                                                  |
| ---                                                                                                                                 | -----                               | --------                                                  |
| `SELECT * FROM [dolt_diff('HEAD', 'WORKING', 'mytable')](../reference/sql/version-control/dolt-sql-functions.md#dolt_diff);`           | `dolt diff mytable`                 | Shows the working diff for `mytable`                      |
| `SELECT * FROM [dolt_diff_stat('HEAD', 'WORKING', 'mytable')](../reference/sql/version-control/dolt-sql-functions.md#dolt_diff_stat);` | `dolt diff --stat mytable`          | Shows statistics for the diff of `mytable`                |
| `SELECT * FROM [dolt_diff('HEAD~', 'HEAD', 'mytable')](../reference/sql/version-control/dolt-sql-functions.md#dolt_diff);`             | `dolt diff HEAD~ HEAD mytable`      | Shows the diff between the last two commits for `mytable` |
| `SELECT * FROM [dolt_diff('HEAD', 'STAGED', 'mytable')](../reference/sql/version-control/dolt-sql-functions.md#dolt_diff);`            | `dolt diff --cached mytable`        | Shows the staged diff for `mytable`                       |
| `SELECT * FROM [dolt_diff('branchA', 'branchB', 'mytable')](../reference/sql/version-control/dolt-sql-functions.md#dolt_diff);`        | `dolt diff branchA branchB mytable` | Shows diff between branches two branches for `mytable`    |

## Status and logs

| SQL server                                                                                                    | Dolt CLI                    | Comments                                              |
| ---                                                                                                           | -----                       | --------                                              |
| `SELECT * FROM [dolt_status](../reference/sql/version-control/dolt-system-tables.md#dolt_status);`            | `dolt status`               | Shows which tables are modified or staged             |
| `SELECT [active_branch()](../reference/sql/version-control/dolt-sql-functions.md#active_branch);`                | `dolt branch`               | Shows the checked out branch (marked with `*` on CLI) |
| `SELECT * FROM [dolt_log](../reference/sql/version-control/dolt-system-tables.md#dolt_log);`                  | `dolt log`                  | Shows the commit history for the current branch       |
| `SELECT * FROM [dolt_log('myBranch')](../reference/sql/version-control/dolt-sql-functions.md#dolt_log);`         | `dolt log myBranch`         | Shows the commit history for myBranch                 |
| `SELECT * FROM [dolt_log('branchB..branchA')](../reference/sql/version-control/dolt-sql-functions.md#dolt_log);` | `dolt log branchB..branchA` | Shows the commits on branchA that are not on branchB  |

## History

History querying is specific to the SQL server and has no command line equivalent.

| SQL server                                                                                                                                                                  | Comments                                                   |
| ---                                                                                                                                                                         | --------                                                   |
| `SELECT * FROM mytable [AS OF 'HEAD~3'](../reference/sql/version-control/querying-history.md#querying-past-snapshots-with-as-of);`                                          | Selects data from 3 commits ago                            |
| `USE [mydb/HEAD~3](../reference/sql/version-control/querying-history.md#specifying-a-revision-in-the-database-name);`                                                       | Sets this session to query data from 3 commits ago         |
| `SELECT * FROM [dolt_history_mytable](../reference/sql/version-control/dolt-system-tables.md#dolt_history_usdtablename);`                                                   | Selects every row from `mytable` at every point in history |
| `SELECT committer FROM [dolt_history_mytable](../reference/sql/version-control/dolt-system-tables.md#dolt_history_usdtablename) where id = 1 order by commit_date LIMIT 1;` | Selects who first added the row with `id = 1` to `mytable` |

## Working with remotes

| SQL server                                                                                                                    | Dolt CLI                          | Comments                                                   |
| ---                                                                                                                           | -----                             | --------                                                   |
| `CALL [DOLT_REMOTE('add', 'myRemote', 'myOrg/myRepo')](../reference/sql/version-control/dolt-sql-procedures.md#dolt_remote);` | `dolt remote add myRemote/myRepo` | Adds a new DoltHub remote                                  |
| `SELECT * FROM [dolt_remotes](../reference/sql/version-control/dolt-system-tables.md#dolt_remotes);`                          | `dolt remote`                     | Lists remotes                                              |
| `CALL [DOLT_FETCH()](../reference/sql/version-control/dolt-sql-procedures.md#dolt_fetch);`                                    | `dolt fetch`                      | Fetches all branches from the remote                       |
| `CALL [DOLT_PULL()](../reference/sql/version-control/dolt-sql-procedures.md#dolt_pull);`                                      | `dolt pull`                       | Fetch and merge commits from the remote tracking branch    |
| `CALL [DOLT_PUSH('origin', 'myBranch')](../reference/sql/version-control/dolt-sql-procedures.md#dolt_push);`                  | `dolt push origin myBranch`       | Push local commits of branch `myBranch` to remote `origin` |
| `CALL [DOLT_PUSH()](../reference/sql/version-control/dolt-sql-procedures.md#dolt_push);`                                      | `dolt push`                       | Push local commits to the remote tracking branch           |

## Advanced use cases

| SQL server                                                                                                                                                | Dolt CLI                                            | Comments                                                                                                         |
| ---                                                                                                                                                       | -----                                               | --------                                                                                                         |
| `SELECT [HASHOF('main')](../reference/sql/version-control/dolt-sql-functions.md#hashof);`                                                                 | `dolt show main`                                    | Shows the commit hash of a ref                                                                                   |
| `SELECT * from [dolt_blame_mytable](../reference/sql/version-control/dolt-system-tables.md#dolt_blame_usdtablename);`                                     | `dolt blame mytable`                                | Shows who last updated every row of a table                                                                      |
| `SELECT * FROM [dolt_diff('branch1...branch2')](../reference/sql/version-control/dolt-sql-functions.md#dolt_diff);`                                       | `dolt diff branch1...branch2`                       | Shows a [three-dot diff](https://www.dolthub.com/blog/2022-11-11-two-and-three-dot-diff-and-log/#three-dot-diff) |
| `CALL [DOLT_REVERT('gtfv1qhr5le61njimcbses9oom0de41e')](../reference/sql/version-control/dolt-sql-procedures.md#dolt_revert);`                            | `dolt revert gtfv1qhr5le61njimcbses9oom0de41e`      | Creates a new commit which reverts the changes in a prior commit                                                 |
| `SELECT * FROM [DOLT_PATCH('main', 'WORKING')](../reference/sql/version-control/dolt-sql-functions.md#dolt_patch);`                                       | `dolt patch main`                                   | Creates SQL statements to apply a diff between two revisions                                                     |
| `SELECT * FROM [dolt_conflicts](../reference/sql/version-control/dolt-system-tables.md#dolt_conflicts);`                                                  | `dolt conflicts cat`                                | Lists which tables have conflicts after a merge                                                                  |
| `SELECT * FROM [dolt_conflicts_mytable](../reference/sql/version-control/dolt-system-tables.md#dolt_conflicts_usdtablename);`                             | `dolt conflicts cat mytable`                        | Lists the rows in conflict for `mytable`                                                                         |
| `CALL [DOLT_CONFLICTS_RESOLVE('--theirs', 'mytable')](../reference/sql/version-control/dolt-sql-procedures.md#dolt_conflicts_resolve);`                   | `dolt conflicts resolve --theirs mytable`           | Resolves conflicts in `mytable` by taking their changes                                                          |
| `CALL [DOLT_TAG('tag1', 'myBranch')](../reference/sql/version-control/dolt-sql-procedures.md#dolt_tag);`                                                  | `dolt tag tag1 mybranch`                            | Creates a new tag at the HEAD of `mybranch`                                                                      |
| `CALL [DOLT_CHERRY_PICK('qj6ouhjvtrnp1rgbvajaohmthoru2772')](../reference/sql/version-control/dolt-sql-procedures.md#dolt_cherry_pick);`                  | `dolt cherry-pick qj6ouhjvtrnp1rgbvajaohmthoru2772` | Applies the changes in a commit to the current branch HEAD                                                       |
| `SELECT * FROM [dolt_schema_diff('main', 'branch1', 'mytable')](../reference/sql/version-control/dolt-sql-functions.md#dolt_schema_diff);`                | `dolt diff --schema main branch1 `                  | Shows schema differences for a table between two commits                                                         |
| `CALL [DOLT_VERIFY_CONSTRAINTS()](../reference/sql/version-control/dolt-sql-procedures.md#dolt_verify_constraints);`                                      | `dolt verify-constraints`                           | Checks for constraint violations (e.g. after checks had been disabled)                                           |
| `CALL [DOLT_GC()](../reference/sql/version-control/dolt-sql-procedures.md#dolt_gc);`                                                                      | `dolt gc`                                           | Runs garbage collection to compact the size of the database on disk                                              |
| `CALL [DOLT_REBASE('--interactive', 'main')](../reference/sql/version-control/dolt-sql-procedures.md#dolt_rebase);`                                       | `dolt rebase --interactive main`                    | Begins an interactive rebase session                                                                             |
| `SELECT * FROM [dolt_reflog('mybranch')](../reference/sql/version-control/dolt-sql-functions.md#dolt_reflog);`                                            | `dolt reflog mybranch`                              | Shows the history of a ref, included deleted refs                                                                |
| `SELECT * FROM [dolt_commit_ancestors](../reference/sql/version-control/dolt-system-tables.md#dolt_commit_ancestors) where commit_hash = HASHOF('main');` | No equivalent                                       | Shows the parent commit(s) of a commit                                                                           |
| `SELECT [DOLT_MERGE_BASE('main', 'feature')](../reference/sql/version-control/dolt-sql-functions.md#dolt_merge_base);`                                    | `dolt merge-base main feature`                      | Shows the common ancestor of two commits                                                                         |
| `SELECT * FROM [dolt_commits](../reference/sql/version-control/dolt-system-tables.md#dolt_commits);`                                                      | No equivalent                                       | Shows all commits on all branches                                                                                |
| `INSERT INTO [dolt_ignore](../reference/sql/version-control/dolt-system-tables.md#dolt_ignore) VALUES ("generated_*", true);`                             | No equivalent                                       | Ignores tables matching `generated*` (won't be added or committed)                                               |
|                                                                                                                                                           |                                                     |                                                                                                                  |
