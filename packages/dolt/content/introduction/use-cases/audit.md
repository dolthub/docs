---
title: Audit
---

# Problem

* Do you need to know who changed what, when, why in your SQL database?
* Do you want an immutable record of changes going back to the inception of your database?
* Is an audit team asking for this information for compliance purposes?
* Do you want to be able to query this audit log like any other table in your database?
* Do you want the data to be efficiently stored so you can trace changes back to inception?

# Dolt solves this by…

Dolt provides a built-in, queryable audit log of every cell in your database. Whenever a [Dolt commit](../../concepts/dolt/git/commits.md) is created, the user, time, and optional commit message are recorded along with the data that changed. These commits form an [immutable log of changes](../../concepts/dolt/git/log.md) to every cell in your database going back to inception. 

Dolt stores these changes efficiently by [sharing data that hasn't changed between all commits referencing that data](https://www.dolthub.com/blog/2020-05-13-dolt-commit-graph-and-structural-sharing/). Effectively, only the differences are stored between versions of the data. 

The audit log created between commits is queryable via standard SQL using custom Dolt [system tables](../../reference/sql/version-control/dolt-system-tables.md) and [functions](../../reference/sql/version-control/dolt-sql-functions.md). The results can be filtered and joined using other data in your database. 

If you're not ready to switch your primary database to Dolt to get its audit capabilities, you can run MySQL as your primary and set Dolt up as [a versioned replica](../use-cases/versioned-replica.md). You lose users and commit messages but you still get a queryable log of every cell in your database.

# Dolt replaces...

## Soft Deletes

A technique to add audit capability to an existing database is to add [soft deletes](https://www.dolthub.com/blog/2022-11-03-soft-deletes/). Soft delete is the use various techniques to mark data as inactive instead of deleting it. This is strictly worse than a version controlled database for audit purposes. With soft deletes, an operator can still modify data or the application can make mistakes. In Dolt, every write is part of the audit log. It is far more difficult for an operator to change Dolt history.

## Change Data Capture

[Change Data Capture](https://www.dolthub.com/blog/2023-03-01-change-data-capture/) is another way to add audit capability to an existing database. Some change data capture techniques are similar to [soft delete](https://www.dolthub.com/blog/2022-11-03-soft-deletes/) strategies. Modern change data capture tools consume replication logs to audit database changes. Dolt can consume the same logs in the [versioned MySQL replica use case](../use-cases/versioned-replica.md) producing a simpler and thus, more audit-friendly, change data capture solution. 

Moreover, if Dolt is your production database, there is no need for an additional change data capture system. The audit capability is a built-in feature of the production Dolt database.

# Companies Doing This

* [FJA](https://www.fja.com/)

# Case Studies

Let us know if you would like us to feature your use of Dolt for audit here.

# Other Related Articles

* [So you want an Immutable database](https://www.dolthub.com/blog/2022-03-21-immutable-database/)
* [So you want Soft Deletes?](https://www.dolthub.com/blog/2022-11-03-soft-deletes/)
* [So you want Change Data Capture](https://www.dolthub.com/blog/2023-03-01-change-data-capture/)