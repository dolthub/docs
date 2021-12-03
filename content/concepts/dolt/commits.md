---
title: Commits
---

# Commits

## What is a Commit?

A commit signals to Dolt that you would like to save the state of the current database permanently for future reference. In practice, this stores the root hash (or reference) of the database in a graph of all the commits with a link to its parent commit. If the commit is a merge commit, the commit will have multiple parents.

![](../../.gitbook/assets/dolt-commit-graph.png)

Commit hashes are SHA-256 encoded hashes of the entire database. Commit hashes look like `t5d5inj4bpc1fltrdm9uoscjdsgebaih`. These are abbreviations of the entire has that Dolt understands. When referring to a specific commit, this is the identifier you use.  

## How to use Commits

Dolt uses commits as the basis of comparison between two versions of a database. You can ask Dolt to do things like:

* Show me the differences between these two commits
* Give me the common ancestor of these two commits
* Make my current database look like this commit
* Show me the difference between my current database and the last commit
* Show me all the commits since this database was created
* Show me who created this commit and the message they left when he or she made it

You should make a commit when you want to be able to use the current version of the database to do one of the above things.

To create a commit, you tell Dolt you want to make one on the command line or in the SQL interface. A users and commit message are required. Your user is defined in configuration. You provide a commit message via the user interface.

## Difference between Git Commits and Dolt commits

Git commits and Dolt commits are very similar in purpose and practice.

In Dolt, you can create a commit via the SQL interface. There is no analogue in Git.

## Example

### Create a commit

```
dolt commit -am "This is a commit message"
docs $ dolt commit --allow-empty -m "This is a commit"
commit bo318l76dq3bdvu1ie84d4nmv4hpi4km
Author: Tim Sehn <tim@dolthub.com>
Date:   Thu Dec 02 16:55:00 -0800 2021

	This is a commit

```

```
SQL
```