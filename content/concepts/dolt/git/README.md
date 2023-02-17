# Git

Dolt implements Git-style version control on tables instead of files.

Dolt adopts the Git-interface to version control. There are [commits](commits.md), [branches](branch.md), [merges](merge.md), and all the other Git concepts you are familiar with. If you know Git, Dolt will feel very familiar because conceptually, Dolt is modeled on Git.

On the command-line, these concepts are exposed as a replica of the Git command line. Where you would type `git log`, you now type `dolt log`. Where you would type `git add`, you type `dolt add`. The replication extends to the command arguments.

In SQL, Dolt becomes a bit more complicated because no Git-equivalent to SQL exists. Git read operations are modeled as [system tables](../../../sql-reference/version-control/dolt-system-tables.md). Git write operations are modeled as [stored procedures](../../../sql-reference/version-control/dolt-sql-procedures.md). But conceptually, all the Git concepts you are familiar with extend to SQL.

In this section we explore the following Git concepts and explain how they work in Dolt:

1. [Commits](commits.md)
2. [Log](log.md)
3. [Diff](diff.md)
4. [Branch](branch.md)
5. [Merge](merge.md)
6. [Conflicts](conflicts.md)
7. [Remotes](remotes.md)
8. [Working Set](working-set.md)
