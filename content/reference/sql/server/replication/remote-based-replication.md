---
title: Remote-Based Replication
---

# Remote-Based Replication 

## Configuration

Dolt relies on [system
variables](../../../concepts/dolt/sql/system-variables.md) to
configure replication. The following system variables affect
replication:

1. [`@@dolt_replicate_to_remote`](../version-control/dolt-sysvars.md#doltreplicatetoremote).
   **Required for a primary.** The primary will push to the remote named on writes.
1. [`@@dolt_read_replica_remote`](../version-control/dolt-sysvars.md#doltreadreplicaremote).
   **Required for a replica.** The replica will pull from the remote named on reads.
1. [`@@dolt_replicate_heads`](../version-control/dolt-sysvars.md#doltreplicateheads).
   **Either this variable or `@@dolt_replicate_all_heads` must be
   set.** Used to configure specific branches (ie. HEADs) to push /
   pull. Set to a comma-separted list of branches that should be
   replicated.
1. [`@@dolt_replicate_all_heads`](../version-control/dolt-sysvars.md#doltreplicateallheads).
   **Either this variable or `@@dolt_replicate_heads` must be set.**
   Replicate all branches (ie. HEADs). Defaults to 0.
1. [`@@dolt_replication_remote_url_template`](../version-control/dolt-sysvars.md#doltreplicationremoteurltemplate).
   *Optional.* Set to a URL template to configure the replication
   remote for newly created databases. Without this variable set, only
   databases that existed at server start time will replicate.
1. [`@@dolt_skip_replication_errors`](../version-control/dolt-sysvars.md#doltskipreplicationerrors).
   Makes replication errors warnings, instead of errors. Defaults to 0.
1. [`@@dolt_transaction_commit`](../../../reference/sql/version-control/dolt-sysvars.md#dolt_transaction_commit).
   Makes every transaction `COMMIT` a Dolt commit to force all writes to replicate. Default 0.
1. [`@@dolt_async_replication`](../version-control/dolt-sysvars.md#doltasyncreplication).
   Make replication asynchronous, which means that read replicas will
   be eventually consistent with the primary. Defaults to 0.

### Configuring a Primary

To set up a primary, you use the [`@@dolt_replicate_to_remote` system
variable](../version-control/dolt-sysvars.md#doltreplicatetoremote). You
set that variable to the name of the remote you would like to use for
replication. Additionally, set either `@@dolt_replicate_all_heads` or
`@@dolt_replicate_heads`.

In this example I am going to use a DoltHub remote to facilitate
replication. I created an empty database on DoltHub and [configured
the appropriate read and write credentials on this
host](../../../introduction/getting-started/data-sharing.md#dolt-login).

Then set the appropriate server variables:

```bash
$ dolt remote add origin timsehn/replication_example
$ dolt sql -q "set @@persist.dolt_replicate_to_remote = 'origin'"
```

The next time you create a Dolt commit in a running SQL server or with
a `dolt sql` command, Dolt will attempt to push the changes to the
remote.

```bash
$ dolt sql -q "create table test (pk int, c1 int, primary key(pk))"
$ dolt sql -q "insert into test values (0,0)"
Query OK, 1 row affected
$ dolt add -A
$ dolt sql -q "call dolt_commit('-m', 'trigger replication')"
+----------------------------------+
| hash                             |
+----------------------------------+
| 7on23n1h8k22062mbebbt0ejm3i7dakd |
+----------------------------------+
```

And we can see the changes are pushed to the remote.

![DoltHub Replication Example](../../../.gitbook/assets/replication-example.png)

#### Stopping Replication

To stop replication unset the configuration variable.

```
dolt sql -q "set @@persist.dolt_replicate_to_remote = ''"
```

Note, if you have a running SQL server you must restart it after
changing replication configuration.

#### Making every Transaction Commit a Dolt Commit

Often, a primary would like to replicate all transaction `COMMIT`s,
not just Dolt commits. You can make every transaction `COMMIT` a Dolt
commit by setting the [system variable](../../../concepts/dolt/sql/system-variables.md),
[`@@dolt_transaction_commit`](../../../reference/sql/version-control/dolt-sysvars.md#dolt_transaction_commit). With
this setting, you lose the ability to enter commit messages.

```bash
$ dolt sql -q "set @@persist.dolt_transaction_commit = 1"
$ dolt sql -q "insert into test values (1,1)"
Query OK, 1 row affected
 $ dolt log -n 1
commit u4shvua2st16btub8mimdd2lj7iv4sdu (HEAD -> main) 
Author: Tim Sehn <tim@dolthub.com>
Date:  Mon Jul 11 15:54:22 -0700 2022

        Transaction commit
```

And now on the remote.

![DoltHub Replication Example](../../../.gitbook/assets/replication-example-2.png)

#### Warn instead of fail on Replication Errors

Set the [`sqlserver.global.dolt_skip_replication_errors` system
variable](../version-control/dolt-sysvars.md#doltskipreplicationerrors)
to print warnings rather than error if replication is misconfigured.

Without this set, if we have a replication error, it fails the action.

```bash
$ dolt sql -q "set @@persist.dolt_replicate_to_remote = 'broken'"
$ dolt sql -q "call dolt_commit('-m', 'empty commit', '--allow-empty')"
failure loading hook; remote not found: 'broken'
replication_example $ dolt log -n 1
commit u4shvua2st16btub8mimdd2lj7iv4sdu (HEAD -> main) 
Author: Tim Sehn <tim@dolthub.com>
Date:  Mon Jul 11 15:54:22 -0700 2022

        Transaction commit
```

But if we set the `@@dolt_skip_replication_errors` variable, we get a warning instead.

```bash
$ dolt sql -q "set @@persist.dolt_skip_replication_errors = '1'"
$ dolt sql -q "call dolt_commit('-m', 'empty commit', '--allow-empty')"
failure loading hook; remote not found: 'broken'
+----------------------------------+
| hash                             |
+----------------------------------+
| jco517ifl1em82f5at2eo75el28dgglt |
+----------------------------------+
$ dolt log --n 1
commit jco517ifl1em82f5at2eo75el28dgglt (HEAD -> main) 
Author: Tim Sehn <tim@dolthub.com>
Date:  Mon Jul 11 16:02:01 -0700 2022

        empty commit
```

#### Asynchronous replication

By default, replication is synchronous. The push must complete before
the transaction commits. You can enable asynchronous replication using
the [`@@dolt_async_replication` system
variable](../version-control/dolt-sysvars.md#doltasyncreplication). This
setting will increase the speed of Dolt commits, but make read
replicas eventually consistent.

```bash
$ dolt sql -q "set @@persist.dolt_async_replication = 1"
```

### Configuring a Replica

To start a replica, you first need a clone. I'm going to call my clone
`read_replica`.

```bash
$ dolt clone timsehn/replication_example read_replica
cloning https://doltremoteapi.dolthub.com/timsehn/replication_example
28 of 28 chunks complete. 0 chunks being downloaded currently.
dolt $ cd read_replica/
```

Now, I'm going to configure my read replica to "pull on read" from
origin. To do that I use the [`@@dolt_read_replica_remote system
variable`](../version-control/dolt-sysvars.md#doltreadreplicaremote). I
also must configure which branches (ie. HEADs) I would like to
replicate using either
[`@@dolt_replicate_heads`](../version-control/dolt-sysvars.md#doltreplicateheads)
to pick specific branches or
[`@@dolt_replicate_all_heads`](../version-control/dolt-sysvars.md#doltreplicateallheads)
to replicate all branches.

```bash
$ dolt sql -q "set @@persist.dolt_read_replica_remote = 'origin'"
$ dolt sql -q "set @@persist.dolt_replicate_heads = 'main'"
$ dolt sql -q "select * from test"
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 1  |
+----+----+
```

Now on the primary.

```bash
$ dolt sql -q "insert into test values (2,2); call dolt_commit('-am', 'Inserted (2,2)');"
Query OK, 1 row affected
+----------------------------------+
| hash                             |
+----------------------------------+
| i97i9f1a3vrvd09pphiq0bbdeuf8riid |
+----------------------------------+
```

And back to the replica.

```bash
$ dolt sql -q "select * from test"
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 1  |
| 2  | 2  |
+----+----+
$ dolt log -n 1
commit i97i9f1a3vrvd09pphiq0bbdeuf8riid (HEAD -> main, origin/main) 
Author: Tim Sehn <tim@dolthub.com>
Date:  Mon Jul 11 16:48:37 -0700 2022

        Inserted (2,2)
```

#### Replicate all branches

Only one of
[`@@dolt_replicate_heads`](../version-control/dolt-sysvars.md#doltreplicateheads)
or
[`@@dolt_replicate_all_heads`](../version-control/dolt-sysvars.md#doltreplicateallheads)
can be set at a time. So I unset `@@dolt_replicate_heads` and set
`@@dolt_replicate_all_heads`.

```bash
read_replica $ dolt sql -q "set @@persist.dolt_replicate_heads = ''"
read_replica $ dolt sql -q "set @@persist.dolt_replicate_all_heads = 1"
```

Now I'm going to make a new branch on the primary and insert a new value on it.

```bash
replication_example $ dolt sql -q "call dolt_checkout('-b', 'branch1'); insert into test values (3,3); call dolt_commit('-am', 'Inserted (3,3)');"
+--------+
| status |
+--------+
| 0      |
+--------+
Query OK, 1 row affected
+----------------------------------+
| hash                             |
+----------------------------------+
| 0alihi9nll9986ossq9mc2n54j4kafhc |
+----------------------------------+
```

The read replica now has the change when I try and read the new branch.

```bash
$ dolt sql -q "call dolt_checkout('branch1'); select * from test;"
+--------+
| status |
+--------+
| 0      |
+--------+
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 1  |
| 2  | 2  |
| 3  | 3  |
+----+----+
```

### Replicating multiple databases

By running the SQL server with the `--data-dir` option, you can manage
multiple Dolt databases in the same server environment. If replication
is enabled, all databases are replicated. A remote with the name given
by `@@dolt_read_replica_remote` (for replicas) or
`@@dolt_replicate_to_remote` (for primaries) must exist for every
database in the server.

Whenever working with more than one database in a server with
replication enabled, it's recommended to set
`@@dolt_replication_remote_url_template` so that newly created
databases are replicated as well. Without this setting, newly created
databases won't begin replicating until they have an individual remote
configured and the server is restarted. With this setting, newly
created databases on a primary automatically get a remote configured
using the URL template provided and begin pushing to it.

`@@dolt_replication_remote_url_template` must be a valid Dolt remote
URL, with the replacement token `{database}` in it. Some examples:

```sql
set @@persist.dolt_replication_remote_url_template = 'file:///share/doltRemotes/{database}'; -- file based remote
set @@persist.dolt_replication_remote_url_template = 'aws://dynamo-table:s3-bucket/{database}'; -- AWS remote
set @@persist.dolt_replication_remote_url_template = 'gs://mybucket/remotes/{database}'; -- GCP remote
```

For some remotes, additional configuration for authorization may be
required in your environment. **Note**: not all remote types support
automatic database creation yet. In particular,
[DoltHub](https://dolthub.com) remotes do not yet support
automatically creating remotes for new databases.

On read replicas, setting `@@dolt_replication_remote_url_template`
will cause new databases created on the primary to be cloned to the
replica when they are first used.

### Deleting branches

Branches deleted on a primary database will also be deleted on any
read replicas.

### Failover

If the primary database processing writes fails, queries will either
need to be routed to a replica, or queue / fail until the primary
restarts. We do not have a purpose-built solution or documentation for
failover recovery yet.

In the meantime, it is possible to use push / pull replication to
maintain a standby server. If the primary server fails, the standby
and proxy would need to walk through a series of steps to create a new
primary:

1. Standby server disables read-only mode if it was used as a read
   replica previously.
1. Standby server recovers the most recent transactions, either from
   the remote middleman or a primary backup.
1. Standby sets replication varaibles to push on write.
1. Proxy layer directs write queries to the formerly standby, now
   primary server.

### Multi-Primary

We do not have specific solutions or documentation to run Dolt as an
OLTP database with multiple primaries. It is possible to connect
several write targets with a common remote middleman, but they would
need to reconcile merge conflicts in the same way an offline Dolt
database does. Providing a transactional layer to enforce multi-primary
(to avoid merge conflicts) or a way to automatically resolve merge
conflicts is necessary to run Dolt as a multi-primary database
effectively.
