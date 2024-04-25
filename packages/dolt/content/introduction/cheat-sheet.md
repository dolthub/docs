---
title: Dolt Cheat Sheet
---

# Dolt Cheat Sheet

This cheat sheet briefly summarizes the main version-control features of Dolt with simple
examples. Most commands can be executed on the command line or in a SQL session. Most Dolt commands
take the same options as Git commands.

## Setup and init

| SQL server                                      | Dolt CLI                                | Comments                                                      |
| ---                                             | -----                                   | --------                                                      |
| `CREATE DATABASE mydb`                          | `dolt init`                             | Creates a new Dolt database                                   |
| `CALL DOLT_CLONE('post-no-preference/options')` | `dolt clone post-no-preference/options` | Clones the `post-no-preference/options` database from DoltHub |

## Stage and snapshot

| SQL server                            | Dolt CLI                     | Comments                                      |
| ---                                   | -----                        | --------                                      |
| `CALL DOLT_ADD('myTable')`            | `dolt add myTable`           | Adds a table to the staging area              |
| `CALL DOLT_RESET()`                   | `dolt reset`                 | Removes staged tables, keeps working changes  |
| `CALL DOLT_RESET('--hard')`           | `dolt reset --hard`          | Resets all staged and working changes to HEAD |
| `CALL DOLT_COMMIT('-m', 'a commit')`  | `dolt commit -m 'a commit'`  | Commits staged tables as a new snapshot       |
| `CALL DOLT_COMMIT('-Am', 'a commit')` | `dolt commit -Am 'a commit'` | Stages and commits all tables                 |

## Branch and merge 

| SQL server                                     | Dolt CLI                    | Comments                                    |
| ---                                            | -----                       | --------                                    |
| `SELECT * FROM dolt_branches`                  | `dolt branch`               | Lists all branches                          |
| `CALL DOLT_BRANCH('myBranch')`                 | `dolt branch myBranch`      | Creates a new branch                        |
| `CALL DOLT_CHECKOUT('myBranch')`               | `dolt checkout myBranch`    | Switches to another branch                  |
| `CALL DOLT_CHECKOUT('-b', 'myBranch')`         | `dolt checkout -b myBranch` | Creates a new branch and switches to it     |
| `CALL DOLT_MERGE('myBranch')`                  | `dolt merge mybranch`       | Merges a branch into the checked out branch |

## Diffing

| SQL server                                                   | Dolt CLI                            | Comments                                                  |
| ---                                                          | -----                               | --------                                                  |
| `SELECT * FROM dolt_diff('HEAD', 'WORKING', 'mytable')`      | `dolt diff mytable`                 | Shows the working diff for `mytable`                      |
| `SELECT * FROM dolt_diff_stat('HEAD', 'WORKING', 'mytable')` | `dolt diff --summary mytable`       | Shows statistics for the diff of `mytable`                |
| `SELECT * FROM dolt_diff('HEAD~', 'HEAD', 'mytable')`        | `dolt diff HEAD~ HEAD mytable`      | Shows the diff between the last two commits for `mytable` |
| `SELECT * FROM dolt_diff('HEAD', 'STAGED', 'mytable')`       | `dolt diff --cached mytable`        | Shows the staged diff for `mytable`                       |
| `SELECT * FROM dolt_diff('branchA', 'branchB', 'mytable')`   | `dolt diff branchA branchB mytable` | Shows diff between branches two branches for `mytable`    |

## Status and logs

| SQL server                                   | Dolt CLI                    | Comments                                              |
| ---                                          | -----                       | --------                                              |
| `SELECT * FROM dolt_status`                  | `dolt status`               | Shows which tables are modified or staged             |
| `SELECT active_branch()`                     | `dolt branch`               | Shows the checked out branch (marked with `*` on CLI) |
| `SELECT * FROM dolt_log`                     | `dolt log`                  | Shows the commit history for the current branch       |
| `SELECT * FROM dolt_log('myBranch')`         | `dolt log myBranch`         | Shows the commit history for myBranch                 |
| `SELECT * FROM dolt_log('branchB..branchA')` | `dolt log branchB..branchA` | Shows the commits on branchA that are not on branchB  |

## History

History querying is specific to the SQL server and has no command line equivalent.

| SQL server                                                                             | Comments                                                   |
| ---                                                                                    | --------                                                   |
| `SELECT * FROM mytable AS OF 'HEAD~3'`                                                 | Selects data from 3 commits ago                            |
| `USE mydb/HEAD~3`                                                                      | Sets this session to query data from 3 commits ago         |
| `SELECT * FROM dolt_history_mytable`                                                   | Selects every row from `mytable` at every point in history |
| `SELECT committer FROM dolt_history_mytable where id = 1 order by commit_date LIMIT 1` | Selects who first added the row with `id = 1` to `mytable` |

## Working with remotes

| SQL server                                            | Dolt CLI                          | Comments                                                   |
| ---                                                   | -----                             | --------                                                   |
| `CALL DOLT_REMOTE('add', 'myRemote', 'myOrg/myRepo')` | `dolt remote add myRemote/myRepo` | Adds a new DoltHub remote                                  |
| `SELECT * FROM dolt_remotes`                          | `dolt remote`                     | Lists remotes                                              |
| `CALL DOLT_FETCH()`                                   | `dolt fetch`                      | Fetches all branches from the remote                       |
| `CALL DOLT_PULL()`                                    | `dolt pull`                       | Fetch and merge commits from the remote tracking branch    |
| `CALL DOLT_PUSH('origin', 'myBranch')`                | `dolt push origin myBranch`       | Push local commits of branch `myBranch` to remote `origin` |
| `CALL DOLT_PUSH()`                                    | `dolt push`                       | Push local commits to the remote tracking branch            |

## Advanced use cases

| SQL server                                                               | Dolt CLI                                            | Comments                                                                                                         |
| ---                                                                      | -----                                               | --------                                                                                                         |
| `SELECT HASHOF('main')`                                                  | `dolt show main`                                    | Shows the commit hash of a ref                                                                                   |
| `SELECT * FROM dolt_diff('branch1...branch2')`                           | `dolt diff branch1...branch2`                       | Shows a [three-dot diff](https://www.dolthub.com/blog/2022-11-11-two-and-three-dot-diff-and-log/#three-dot-diff) |
| `CALL DOLT_REVERT('gtfv1qhr5le61njimcbses9oom0de41e')`                   | `dolt revert gtfv1qhr5le61njimcbses9oom0de41e`      | Creates a new commit which reverts the changes in a prior commit                                                 |
| `SELECT * FROM DOLT_PATCH('main', 'WORKING')`                            | `dolt patch main`                                   | Creates SQL statements to apply a diff between two revisions                                                     |
| `SELECT * FROM dolt_conflicts`                                           | `dolt conflicts cat`                                | Lists which tables have conflicts after a merge                                                                  |
| `SELECT * FROM dolt_conflicts_mytable`                                   | `dolt conflicts cat mytable`                        | Lists the rows in conflict for `mytable`                                                                         |
| `CALL DOLT_CONFLICTS_RESOLVE('--theirs', 'mytable')`                     | `dolt conflicts resolve --theirs mytable`           | Resolves conflicts in `mytable` by taking their changes                                                          |
| `CALL DOLT_TAG('tag1', 'myBranch');`                                     | `dolt tag tag1 mybranch`                            | Creates a new tag at the HEAD of `mybranch`                                                                      |
| `CALL DOLT_CHERRY_PICK('qj6ouhjvtrnp1rgbvajaohmthoru2772');`             | `dolt cherry-pick qj6ouhjvtrnp1rgbvajaohmthoru2772` | Applies the changes in a commit to the current branch HEAD                                                       |
| `SELECT * FROM dolt_schema_diff('main', 'branch1', 'mytable')`           | `dolt diff --schema main branch1 `                  | Shows schema differences for a table between two commits                                                         |
| `CALL DOLT_VERIFY_CONSTRAINTS()`                                         | `dolt verify-constraints`                           | Checks for constraint violations (e.g. after checks had been disabled)                                           |
| `CALL DOLT_GC()`                                                         | `dolt gc`                                           | Runs garbage collection to compact the size of the database on disk                                              |
| `CALL DOLT_REBASE('--interactive', 'main')`                              | `dolt rebase --interactive main`                    | Begins an interactive rebase session                                                                             |
| `SELECT * FROM dolt_reflog(mybranch')`                                   | `dolt reflog mybranch`                              | Shows the history of a ref, included deleted refs                                                                |
| `SELECT * FROM dolt_commit_ancestors where commit_hash = HASHOF('main')` | No equivalent                                       | Shows the parent commit(s) of a commit                                                                           |
| `SELECT * DOLT_MERGE_BASE('main', 'feature')`                                 | No equivalent                                       | Shows the common ancestor of two commits                                                                         |
| `SELECT * FROM dolt_commits`                                             | No equivalent                                       | Shows all commits on all branches                                                                                |
| `INSERT INTO dolt_ignore VALUES ("generated_*", true),`                  | No equivalent                                       | Ignores tables matching `generated*` (won't be added or committed)                                               |
