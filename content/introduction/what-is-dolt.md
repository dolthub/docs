---
title: What is Dolt?
---

# What is Dolt?

![](../.gitbook/assets/dolt-logo.png)

Dolt is the first and only SQL database that you can fork, clone, branch, merge, push and pull just like a Git repository. 

Dolt is a [version controlled SQL database](https://www.dolthub.com/blog/2021-09-17-database-version-control/). Connect to Dolt just like any MySQL database to run queries or update the data using SQL commands. 

Dolt is [Git for data](https://www.dolthub.com/blog/2020-03-06-so-you-want-git-for-data/). Use the command line interface to import CSV files, commit your changes, push them to a remote, or merge your teammate's changes.

Dolt implements the Git command line and associated operations on table rows instead of files. Data and schema are modified in the working set using SQL. When you want to permanently store a version of the working set, you make a commit. In SQL, dolt implements Git read operations (ie. diff, log) as system tables and write operations (ie. commit, merge) as functions. Dolt produces cell-wise diffs and merges, making data debugging between versions tractable. That makes Dolt the only SQL database that has branches and merges. You can run Dolt offline, treating data and schema like source code. Or you can run Dolt online, like you would PostgreSQL or MySQL.

We also built [DoltHub](https://www.dolthub.com), a place to share Dolt databases. We host public data for free!