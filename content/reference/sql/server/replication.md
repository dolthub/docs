---
title: Replication
---

# Replication

## Read Replication

Replicating data between servers can increase your application's read query
throughput. If a read replica fails, your application is
still available. If a replication source fails, that is a bigger
problem that requires a [failover](#failover) solution.

Dolt supports simple read replication with two caveats:

- A remote is a replication middleman.

- Individual transactions are _not_ replicated, only commits.

In summary, we support replicating a source database by pushing
on commit, and pulling to replicas on read. The stability of the middleman is
required to maintain the thread of communication between a primary server
and its replicas.

Refer to the [read replication
blog](https://www.dolthub.com/blog/2021-10-20-read-replication/) for a
walkthrough.

## Configuration

### Persisting system variables

Configs can be set in the CLI (limited to `--local` scope for now):

```bash
dolt config --add --local sqlserver.global.dolt_replicate_to_remote <name>
dolt config --add --local sqlserver.global.dolt_read_replica_remote <name>
```

Configs can be set equivalently in an SQL session:

```SQL
SET PERSIST @@GLOBAL.dolt_replicate_to_remote = '<name>'
SET PERSIST @@GLOBAL.dolt_read_replica_remote = '<name>'
```

_Note: after changing replication configuration options, the Dolt server process
needs to be restarted before replication changes will take effect._ 

### Push (on write) from sources

To push on write, a valid remote middleman must be configured:

```bash
dolt sql -q "SET PERSIST @@GLOBAL.dolt_replicate_to_remote = 'origin'"
```

There are two ways to trigger pushing to a remote middleman: a Dolt commit,
or a branch head update. A standalone `COMMIT` or head set will not
trigger replication:

```SQL
SELECT DOLT_COMMIT('-am', 'message')

UPDATE dolt_branches SET hash = COMMIT('-m', 'message') WHERE name = 'main' AND hash = @@database_name_head
```

### Pull (on read) to replica

Read replicas are instantiated with a remote:

```bash
dolt sql -q "SET PERSIST @@GLOBAL.dolt_read_replica_remote = 'origin'"
```

A complete replication setup requires a pull spec with either 1) a set
of heads, or 2) all heads (but not both):

```bash
dolt sql -q "SET PERSIST @@GLOBAL.dolt_replicate_heads = 'main,feature1'"
dolt sql -q "SET PERSIST @@GLOBAL.dolt_replicate_all_heads = 1'"
```

On the replica end, pulling is triggered by an SQL `START TRANSACTION`.
The first query in a session automatically starts a transaction. Setting
`autocommit = 1`, which begins every query with a transaction, is
encouraged on read replicas for convenience.

### Auto-fetching

Dolt supports auto-fetching branches on demand for read replication in
certain circumstances:

1. Clients that connect to a missing branch:

`mysql://127.0.0.1:3306/mydb/feature-branch`

2. `USE`ing a missing branch:

```SQL
USE `mydb/feature-branch`
```

In either case, a read replica will pull the indicated branch from
the remote middleman. If the branch is not on the replica, a new remote
tracking branch, head branch, and working set will be created.

Read more about different head settings [here](./branches.md).

### Quiet Warnings

Set `sqlserver.global.dolt_skip_replication_errors = true` to print warnings
rather than error if replication is misconfigured.

![Read replication](../../.gitbook/assets/dolt-read-replication.png)

## Failover

If the primary database processing writes
fails, queries will either need to be routed to a standby server, or
queue/fail until the primary restarts. We do not have a purpose-built
solution or documentation for failover recovery yet.

In the meantime, it is possible to use push/pull replication to maintain
a standby server. If the primary server fails, the standby and proxy
would need to walk through a series of steps to create a new primary:

- Standby server disables read-only mode if it was used as a read
  replica previously.

- Standby server recovers the most recent transactions, either from the
  remote middleman or a primary backup.

- Standby sets the replication source configuration to push on write.

- Proxy layer directs write queries to the formerly standby, now primary
  server.

## Multi-Master

We do not have specific solutions or documentation to run Dolt as
an OLTP database with multiple masters. It is possible to connect several
write target with a common remote middleman, but they would need to reconcile
merge conflicts in the same way an offline Dolt database does. Providing
a transactional layer to enforce multi-master (to avoid merge conflicts)
or a way to automatically resolve merge conflicts is necessary to run
Dolt as a multi-master database effectively.
