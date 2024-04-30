---
title: Git-Like Version Control
---

Doltgres implements Git-style version control on tables instead of files. 

Doltgres adopts the Git-interface to version control. There are [commits](./commits.md),
[branches](./branch.md), [merges](./merge.md), and all the other Git concepts you are familiar
with. If you know Git, Doltgres will feel very familiar because conceptually, Doltgres is modeled on
Git.

In SQL, Git read operations are modeled as [system
tables](../../reference/sql/version-control/dolt-system-tables.md). Git write operations are modeled
as [stored procedures](../../reference/sql/version-control/dolt-sql-procedures.md). But
conceptually, all the Git concepts you are familiar with extend to SQL.

In this section we explore the following Git concepts and explain how they work in Doltgres:

1. [Commits](./commits.md)
2. [Log](./log.md)
3. [Diff](./diff.md)
4. [Branch](./branch.md)
5. [Merge](./merge.md)
6. [Conflicts](./conflicts.md)
7. [Remotes](./remotes.md)
8. [Working Set](./working-set.md)
