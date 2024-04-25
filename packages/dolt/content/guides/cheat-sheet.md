---
title: Dolt Cheat Sheet
---

# Dolt Cheat Sheet

This cheat sheet briefly summarizes the main version-control features of Dolt with simple
examples. Most commands can be executed on the command line or in a SQL session. Most Dolt commands
take the same options as Git commands.

Click links in the SQL syntax to read more detailed documentation for the feature.

## Setup and init

| SQL server                                       | Dolt CLI                                | Comments                                                                                                                                  |
| ---                                              | -----                                   | --------                                                                                                                                  |
| `CREATE DATABASE mydb;`                          | `dolt init`                             | Creates a new Dolt database                                                                                                               |
| `CALL DOLT_CLONE('post-no-preference/options');` | `dolt clone post-no-preference/options` | Clones the `post-no-preference/options` database from DoltHub. [Docs](../reference/sql/version-control/dolt-sql-procedures.md#dolt_clone) |

## Stage and snapshot

| SQL server                             | Dolt CLI                     | Comments                                                                                                                  |
| ---                                    | -----                        | --------                                                                                                                  |
| `CALL DOLT_ADD('myTable');`            | `dolt add myTable`           | Adds a table to the staging area. [Docs](../reference/sql/version-control/dolt-sql-procedures.md#dolt_add)                |
| `CALL DOLT_RESET();`                   | `dolt reset`                 | Removes staged tables, keeps working changes. [Docs](../reference/sql/version-control/dolt-sql-procedures.md#dolt_reset)  |
| `CALL DOLT_RESET('--hard');`           | `dolt reset --hard`          | Resets all staged and working changes to HEAD. [Docs](../reference/sql/version-control/dolt-sql-procedures.md#dolt_reset) |
| `CALL DOLT_COMMIT('-m', 'a commit');`  | `dolt commit -m 'a commit'`  | Commits staged tables as a new snapshot. [Docs](../reference/sql/version-control/dolt-sql-procedures.md#dolt_commit)      |
| `CALL DOLT_COMMIT('-Am', 'a commit');` | `dolt commit -Am 'a commit'` | Stages and commits all tables. [Docs](../reference/sql/version-control/dolt-sql-procedures.md#dolt_commit)                |

## Branch and merge 

| SQL server                              | Dolt CLI                    | Comments                                                                                                                |
| ---                                     | -----                       | --------                                                                                                                |
| `SELECT * FROM dolt_branches;`          | `dolt branch`               | Lists all branches. [Docs](../reference/sql/version-control/dolt-system-tables.md#dolt_branches)                        |
| `CALL DOLT_BRANCH('myBranch');`         | `dolt branch myBranch`      | Creates a new branch. [Docs](../reference/sql/version-control/dolt-sql-procedures.md#dolt_branch)                       |
| `CALL DOLT_CHECKOUT('myBranch');`       | `dolt checkout myBranch`    | Switches to another branch. [Docs](../reference/sql/version-control/dolt-sql-procedures.md#dolt_checkout)               |
| `CALL DOLT_CHECKOUT('-b', 'myBranch');` | `dolt checkout -b myBranch` | Creates a new branch and switches to it. [Docs](../reference/sql/version-control/dolt-sql-procedures.md#dolt_checkout)  |
| `CALL DOLT_MERGE('myBranch');`          | `dolt merge mybranch`       | Merges a branch into the checked out branch. [Docs](../reference/sql/version-control/dolt-sql-procedures.md#dolt_merge) |

## Diffing

| SQL server                                                    | Dolt CLI                            | Comments                                                                                                                            |
| ---                                                           | -----                               | --------                                                                                                                            |
| `SELECT * FROM dolt_diff('HEAD', 'WORKING', 'mytable');`      | `dolt diff mytable`                 | Shows the working diff for `mytable`. [Docs](../reference/sql/version-control/dolt-sql-functions.md#dolt_diff)                      |
| `SELECT * FROM dolt_diff_stat('HEAD', 'WORKING', 'mytable');` | `dolt diff --stat mytable`          | Shows statistics for the diff of `mytable`. [Docs](../reference/sql/version-control/dolt-sql-functions.md#dolt_diff_stat)           |
| `SELECT * FROM dolt_diff('HEAD~', 'HEAD', 'mytable');`        | `dolt diff HEAD~ HEAD mytable`      | Shows the diff between the last two commits for `mytable`. [Docs](../reference/sql/version-control/dolt-sql-functions.md#dolt_diff) |
| `SELECT * FROM dolt_diff('HEAD', 'STAGED', 'mytable');`       | `dolt diff --cached mytable`        | Shows the staged diff for `mytable`. [Docs](../reference/sql/version-control/dolt-sql-functions.md#dolt_diff)                       |
| `SELECT * FROM dolt_diff('branchA', 'branchB', 'mytable');`   | `dolt diff branchA branchB mytable` | Shows diff between branches two branches for `mytable`. [Docs](../reference/sql/version-control/dolt-sql-functions.md#dolt_diff)    |

## Status and logs

| SQL server                                    | Dolt CLI                    | Comments                                                                                                                            |
| ---                                           | -----                       | --------                                                                                                                            |
| `SELECT * FROM dolt_status;`                  | `dolt status`               | Shows which tables are modified or staged. [Docs](../reference/sql/version-control/dolt-system-tables.md#dolt_status)               |
| `SELECT active_branch();`                     | `dolt branch`               | Shows the checked out branch (marked with `*` on CLI). [Docs](../reference/sql/version-control/dolt-sql-functions.md#active_branch) |
| `SELECT * FROM dolt_log;`                     | `dolt log`                  | Shows the commit history for the current branch. [Docs](../reference/sql/version-control/dolt-system-tables.md#dolt_log)            |
| `SELECT * FROM dolt_log('myBranch');`         | `dolt log myBranch`         | Shows the commit history for myBranch. [Docs](../reference/sql/version-control/dolt-sql-functions.md#dolt_log)                      |
| `SELECT * FROM dolt_log('branchB..branchA');` | `dolt log branchB..branchA` | Shows the commits on branchA that are not on branchB. [Docs](../reference/sql/version-control/dolt-sql-functions.md#dolt_log)       |

## History

History querying is specific to the SQL server and has no command line equivalent.

| SQL server                                                                              | Comments                                                                                                                                                    |
| ---                                                                                     | --------                                                                                                                                                    |
| `SELECT * FROM mytable AS OF 'HEAD~3';`                                                 | Selects data from 3 commits ago. [Docs](../reference/sql/version-control/querying-history.md#querying-past-snapshots-with-as-of)                            |
| `USE mydb/HEAD~3;`                                                                      | Sets this session to query data from 3 commits ago. [Docs](../reference/sql/version-control/querying-history.md#specifying-a-revision-in-the-database-name) |
| `SELECT * FROM dolt_history_mytable;`                                                   | Selects every row from `mytable` at every point in history. [Docs](../reference/sql/version-control/dolt-system-tables.md#dolt_history_usdtablename)        |
| `SELECT committer FROM dolt_history_mytable where id = 1 order by commit_date LIMIT 1;` | Selects who first added the row with `id = 1` to `mytable`. [Docs](../reference/sql/version-control/dolt-system-tables.md#dolt_history_usdtablename)        |

## Working with remotes

| SQL server                                             | Dolt CLI                          | Comments                                                                                                                              |
| ---                                                    | -----                             | --------                                                                                                                              |
| `CALL DOLT_REMOTE('add', 'myRemote', 'myOrg/myRepo');` | `dolt remote add myRemote/myRepo` | Adds a new DoltHub remote. [Docs](../reference/sql/version-control/dolt-sql-procedures.md#dolt_remote)                                |
| `SELECT * FROM dolt_remotes;`                          | `dolt remote`                     | Lists remotes. [Docs](../reference/sql/version-control/dolt-system-tables.md#dolt_remotes)                                            |
| `CALL DOLT_FETCH();`                                   | `dolt fetch`                      | Fetches all branches from the remote. [Docs](../reference/sql/version-control/dolt-sql-procedures.md#dolt_fetch)                      |
| `CALL DOLT_PULL();`                                    | `dolt pull`                       | Fetch and merge commits from the remote tracking branch. [Docs](../reference/sql/version-control/dolt-sql-procedures.md#dolt_pull)    |
| `CALL DOLT_PUSH('origin', 'myBranch');`                | `dolt push origin myBranch`       | Push local commits of branch `myBranch` to remote `origin`. [Docs](../reference/sql/version-control/dolt-sql-procedures.md#dolt_push) |
| `CALL DOLT_PUSH();`                                    | `dolt push`                       | Push local commits to the remote tracking branch. [Docs](../reference/sql/version-control/dolt-sql-procedures.md#dolt_push)           |

## Advanced use cases

| SQL server                                                                | Dolt CLI                                            | Comments                                                                                                                                                                                   |
| ---                                                                       | -----                                               | --------                                                                                                                                                                                   |
| `SELECT HASHOF('main');`                                                  | `dolt show main`                                    | Shows the commit hash of a ref. [Docs](../reference/sql/version-control/dolt-sql-functions.md#hashof)                                                                                      |
| `SELECT * from dolt_blame_mytable;`                                       | `dolt blame mytable`                                | Shows who last updated every row of a table. [Docs](../reference/sql/version-control/dolt-system-tables.md#dolt_blame_usdtablename)                                                        |
| `SELECT * FROM dolt_diff('branch1...branch2');`                           | `dolt diff branch1...branch2`                       | Shows a [three-dot diff](https://www.dolthub.com/blog/2022-11-11-two-and-three-dot-diff-and-log/#three-dot-diff). [Docs](../reference/sql/version-control/dolt-sql-functions.md#dolt_diff) |
| `CALL DOLT_REVERT('gtfv1qhr5le61njimcbses9oom0de41e');`                   | `dolt revert gtfv1qhr5le61njimcbses9oom0de41e`      | Creates a new commit which reverts the changes in a prior commit. [Docs](../reference/sql/version-control/dolt-sql-procedures.md#dolt_revert)                                              |
| `SELECT * FROM DOLT_PATCH('main', 'WORKING');`                            | `dolt patch main`                                   | Creates SQL statements to apply a diff between two revisions. [Docs](../reference/sql/version-control/dolt-sql-functions.md#dolt_patch)                                                    |
| `SELECT * FROM dolt_conflicts;`                                           | `dolt conflicts cat`                                | Lists which tables have conflicts after a merge. [Docs](../reference/sql/version-control/dolt-system-tables.md#dolt_conflicts)                                                             |
| `SELECT * FROM [dolt_conflicts_mytable];`                                 | `dolt conflicts cat mytable`                        | Lists the rows in conflict for `mytable`. [Docs](../reference/sql/version-control/dolt-system-tables.md#dolt_conflicts_usdtablename)                                                       |
| `CALL DOLT_CONFLICTS_RESOLVE('--theirs', 'mytable');`                     | `dolt conflicts resolve --theirs mytable`           | Resolves conflicts in `mytable` by taking their changes. [Docs](../reference/sql/version-control/dolt-sql-procedures.md#dolt_conflicts_resolve)                                            |
| `CALL DOLT_TAG('tag1', 'myBranch');`                                      | `dolt tag tag1 mybranch`                            | Creates a new tag at the HEAD of `mybranch`. [Docs](../reference/sql/version-control/dolt-sql-procedures.md#dolt_tag)                                                                      |
| `CALL DOLT_CHERRY_PICK('qj6ouhjvtrnp1rgbvajaohmthoru2772');`              | `dolt cherry-pick qj6ouhjvtrnp1rgbvajaohmthoru2772` | Applies the changes in a commit to the current branch HEAD. [Docs](../reference/sql/version-control/dolt-sql-procedures.md#dolt_cherry_pick)                                               |
| `SELECT * FROM dolt_schema_diff('main', 'branch1', 'mytable');`           | `dolt diff --schema main branch1 `                  | Shows schema differences for a table between two commits. [Docs](../reference/sql/version-control/dolt-sql-functions.md#dolt_schema_diff)                                                  |
| `CALL DOLT_VERIFY_CONSTRAINTS();`                                         | `dolt verify-constraints`                           | Checks for constraint violations (e.g. after checks had been disabled). [Docs](../reference/sql/version-control/dolt-sql-procedures.md#dolt_verify_constraints)                            |
| `CALL DOLT_GC();`                                                         | `dolt gc`                                           | Runs garbage collection to compact the size of the database on disk. [Docs](../reference/sql/version-control/dolt-sql-procedures.md#dolt_gc)                                               |
| `CALL DOLT_REBASE('--interactive', 'main');`                              | `dolt rebase --interactive main`                    | Begins an interactive rebase session. [Docs](../reference/sql/version-control/dolt-sql-procedures.md#dolt_rebase)                                                                          |
| `SELECT * FROM dolt_reflog('mybranch');`                                  | `dolt reflog mybranch`                              | Shows the history of a ref, included deleted refs. [Docs](../reference/sql/version-control/dolt-sql-functions.md#dolt_reflog)                                                              |
| `SELECT * FROM dolt_commit_ancestors where commit_hash = HASHOF('main');` | No equivalent                                       | Shows the parent commit(s) of a commit. [Docs](../reference/sql/version-control/dolt-system-tables.md#dolt_commit_ancestors)                                                               |
| `SELECT DOLT_MERGE_BASE('main', 'feature');`                              | `dolt merge-base main feature`                      | Shows the common ancestor of two commits. [Docs](../reference/sql/version-control/dolt-sql-functions.md#dolt_merge_base)                                                                   |
| `SELECT * FROM dolt_commits;`                                             | No equivalent                                       | Shows all commits on all branches. [Docs](../reference/sql/version-control/dolt-system-tables.md#dolt_commits)                                                                             |
| `INSERT INTO dolt_ignore VALUES ("generated_*", true);`                   | No equivalent                                       | Ignores tables matching `generated*` (won't be added or committed). [Docs](../reference/sql/version-control/dolt-system-tables.md#dolt_ignore)                                             |
|                                                                           |                                                     |                                                                                                                                                                                            |
