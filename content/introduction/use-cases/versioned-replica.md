---
title: Versioned MySQL Replica
---

# Problem

* Is your production MySQL vulnerable to data loss? 
* If an operator runs a bad query, script, or deployment can your production MySQL can be down for hours or days as you recover data from backups or logs?
* Are you worried your backups aren't working?
* Does internal audit want and immutable log of what changes on your MySQL instance?
* Do you want the ability to copy and sync your production MySQL database for analytics, development, or debugging?

# Dolt solves this by…

Because Dolt is [MySQL-compatible](../../reference/sql/benchmarks/correctness.md), you can set Dolt up as [a versioned replica](../getting-started/versioned-mysql-replica.md) of your MySQL primary. Every transaction commit on your primary becomes a [Dolt commit](../../concepts/dolt/git/commits.md) on the Dolt replica. 

On your Dolt replica, you get full, immutable, queryable audit log of every cell in your database. If an auditor wants guarantees that a cell in your database has not been modified, you can use Dolt to prove it. [Diffs](../../concepts/dolt/git/diff.md) can be produced for every transaction.

If an operator makes a bad query, runs a bad script, or makes a bad deployment, you have an additional tool beyond backups and logs to restore production data. Find the bad transactions using Dolt's audit capabilities. Rollback the bad individual transactions. [Produce a SQL patch](../../reference/sql/version-control/dolt-sql-functions.md#dolt_patch) and apply that back to your primary. If there are conflicting writes, Dolt will surface those for you and you can decide how to proceed. A Dolt replica becomes an essential part of your disaster recovery plan, shortening some outages by hours or days or recovering lost production data.

Moreover, Dolt can be added to your serving path as a read-only MySQL replica, so you know that it is always in sync with your primary. Your disaster recovery instance can serve production traffic so you always know it's working.

Additionally, a Dolt replica can be easily cloned (ie. copied) to a developer's machine for debugging purposes. See a data issue in production? Debug locally on your laptop safely.

# Companies Doing this

[NoCD](https://www.treatmyocd.com/)

# Case Studies

Let us know if you would like us to feature your use of Dolt as a versioned MySQL replica here.

# Related Articles

[Dolt Binlog Replication Preview](https://www.dolthub.com/blog/2023-02-17-binlog-replication-preview/)
[Getting Started: Versioned MySQL Replica](https://www.dolthub.com/blog/2023-03-15-getting-started-versioned-mysql-replica/)
[Versioned MySQL Replicas on Hosted Dolt](https://www.dolthub.com/blog/2023-04-05-versioned-mysql-replicas-on-hosted-dolt/)