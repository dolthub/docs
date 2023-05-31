---
title: Audit
---

# Problem

* Do you need to know who changed what, when, why in your SQL database?
* Do you want an immutable record of changes going back to the inception of your database?
* Is an audit team asking for this information for compliance purposes?
* Do you want to be able to query this audit log like any other tables in your database?
* Do you want the data to be efficiently stored so you can trace changes back to inception?

# Dolt solves this by…

Dolt provides a built-in, queryable audit log of every cell in your database. Whenever a [Dolt commit](../../concepts/dolt/git/commits.md) is created, the user, time, and optional commit message are recorded along with the data that changed. These commits form an immutable log of changes to every cell in your database going back to inception. 

Dolt stores these efficiently by [sharing data that hasn't changed between all commits referencing that data](https://www.dolthub.com/blog/2020-05-13-dolt-commit-graph-and-structural-sharing/). Effectively, only the differences are stored between versions of the data. 

The audit log created between commits is queryable via standard SQL using custom Dolt [system tables](../../reference/sql/version-control/dolt-system-tables.md) and [functions](../../reference/sql/version-control/dolt-sql-functions.md). The results can be filtered and joined using other data in your database. 

If you're not ready to switch your primary database to Dolt to get its audit capabilities, you can run MySQL as your primary and set Dolt up as [a versioned replica](../use-cases/versioned-replica.md). You lose users and commit messages but you still get a queryable log of every cell in your database.

# Companies Doing This

[FJA](https://www.fja.com/)

# Case Studies

Let us know if you would like us to feature your use of Dolt for audit here.

