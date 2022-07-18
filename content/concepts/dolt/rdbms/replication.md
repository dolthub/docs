---
title: Replication
---

# Replication

## What is Replication?

Replication is the ability for an RDBMS to synchronize a master server with one or more read replicas. In this configuration, the master database serves reads and writes while the replicas serve just reads.

## How to use Replication

Replication is used for disaster recovery and to increase read throughput by distributing read load.

For disaster recovery, if your master server goes offline, your database can still serve read traffic from its replicas. Often a manual or automated process can elect and configure a replica to be the master instance limiting downtime.

To increase read throughput, multiple replicas can be used to scale reads horizontally. If you have N replicas and your master still takes reads, each read replica serves 1/N+1 percent of the read traffic. Note, in this set up your application must be aware of the replicas. The database does not route requests automatically.  

## Differences between MySQL Replication and Dolt Replication

Dolt does not support MySQL style replication. [MySQL supports multiple types of replication](https://dev.mysql.com/doc/refman/8.0/en/replication.html), most based on the [MySQL binary log](https://dev.mysql.com/doc/refman/8.0/en/replication-howto.html). Dolt does not have a binary log.

Dolt leverages Git-style [remotes](../git/remotes.md) to facilitate replication. The master and replicas configure the same remote. On the master, you configure "push on write" and on the replicas you configure "pull on read". 

## Interaction with Dolt Version Control

Dolt uses remotes to synchronize between master and read replicas. Replication leverages Dolt's ability to produce differences between two versions of a database quickly.

## Example

### Configuring a Master

In this example I use a DoltHub remote to facilitate replication. I created an empty database on DoltHub and [configured the appropriate read and write credentials on this host](../../../introduction/getting-started/data-sharing.md#dolt-login).

```bash
$ dolt remote add origin timsehn/replication_example
$ dolt config --add --local sqlserver.global.dolt_replicate_to_remote origin
$ dolt sql -q "create table test (pk int, c1 int, primary key(pk))"
$ dolt sql -q "insert into test values (0,0)"
Query OK, 1 row affected
$ dolt sql -q "call dolt_commit('-am', 'trigger replication')"
+----------------------------------+
| hash                             |
+----------------------------------+
| 7on23n1h8k22062mbebbt0ejm3i7dakd |
+----------------------------------+
```

The changes are pushed to the remote.

![DoltHub Replication Example](../../../.gitbook/assets/replication-example.png)

## Configuring a Replica

To start a replica, you first need a clone. 

```bash
$ dolt clone timsehn/replication_example read_replica
cloning https://doltremoteapi.dolthub.com/timsehn/replication_example
28 of 28 chunks complete. 0 chunks being downloaded currently.
dolt $ cd read_replica/
```

Now, I'm going to configure my read replica to "pull on read" the `main` branch from origin.

```bash
$ dolt config --add --local sqlserver.global.dolt_read_replica_remote origin
Config successfully updated.
$ dolt config --add --local sqlserver.global.dolt_replicate_heads main
Config successfully updated.
$ dolt sql -q "select * from test"
+----+----+
| pk | c1 |
+----+----+
| 0  | 0  |
| 1  | 1  |
+----+----+
```

Now on the master.

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