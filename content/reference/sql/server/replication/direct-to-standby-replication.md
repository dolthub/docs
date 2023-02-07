---
title: Direct-to-Standby Replication (Hot Standby Replication)
---

# Direct-to-Standby Replication (Hot Standby Replication)

## Configuration

Replication direct to a standby is configured through the sql-server's YAML
configuration. For example, if we have two servers, `dolt-1.db` and
`dolt-2.db`, and we want to configure them for high-availability, we will
typically configure them to replicate writes to each other.

On `dolt-1.db`, we will have a `config.yaml` like:

```yaml
cluster:
  standby_remotes:
  - name: standby
    remote_url_template: http://dolt-2.db:50051/{database}
  bootstrap_role: primary
  bootstrap_epoch: 1
  remotesapi:
    port: 50051
```

On `dolt-2.db`, we will have:

```yaml
cluster:
  standby_remotes:
  - name: standby
    remote_url_template: http://dolt-1.db:50051/{database}
  bootstrap_role: standby
  bootstrap_epoch: 1
  remotesapi:
    port: 50051
```

Some important things to note:

1) On each server, the standby remote URL points to the other server in the
   cluster.

2) `cluster.remotesapi.port` configures the port that the sql-server will
   listen on to receive replicated writes. It should match the port appearing in
   the `remote_url_template`.

3) The `cluster.bootstrap_role` between the two servers is different. This
   configuration says that when the `dolt-1.db` server comes up, it will behave
   as the primary and will be enabled for writes. `dolt-2.db`, on the other hand,
   will be a standby replica; it will be accept read requests and writes
   replicated from the primary.

The `bootstrap_role` and `bootstrap_epoch` only apply to a newly run server.
Once the server has been running on a host, it will persist its current role
and role epoch, and those will take priority over anything configured in the
bootstrap configuration.

### Bootstrap Remotes

If databases already exist when the `dolt sql-server` instance is started, they
will need to have corresponding remotes as configured in the
`cluster.standby_remotes` configuration. Any database created database through
SQL `CREATE DATABASE` will automatically have remotes created corresponding to
the `remote_url_templates`. The recommended way to run `dolt sql-server` in
cluster mode is in a newly empty directory with:

```sh
$ dolt sql-server --config server.yaml --data-dir .
```

and then to create databases through the SQL interface.

If you want to create databases before hand, you should create corresponding
remotes as well. For example, on `dolt-1.db` above, I could run:

```sh
$ mkdir appdb
$ cd appdb
$ dolt init
$ dolt remote add standby http://dolt-2.db:50051/appdb
```

to initialize a dolt directory with a default database of `appdb`, and then I
could run sql-server with:

```sh
$ dolt sql-server --config server.yaml
```

## Replication Behavior

All SQL transactions and branch HEAD updates for all dolt databases are
replicated. Newly created databases are replicated to the standby remotes.
Branch deletes are replicated.

Currently, the following things are not replicated:

1) `DROP DATABASE`. To drop a database, you will need to run the DROP DATABASE
   command on both the primary and on all standbys.

2) Users and grants. To create or alter a user or a grant, you need to run the
   corresponding SQL user and grant statements on both the primary and all the
   standbys.

## Replication Role and Epoch

When running with direct replication, each sql-server instance has a configured
role it is playing in the cluster. It is either the `primary`, which means it
accepts writes through SQL and replicates those writes to every configured
`standby_remote`, or it is a `standby`, which means it does not accept writes
over SQL but it does accept replication writes from other sql-servers. When a
server is configured to be a primary, it will not accept replication writes.
When a server is configured to be a standby, it will not attempt to replicate
its databases to its configured `standby_remotes`.

Every time a server assumes a role, it assumes it at particular configuration
epoch. This configuration epoch can only increase &mdash; attempting to assume a role
at a lower configuration epoch, or a different role at the current
configuration epoch, will fail.

A server's configured role can be manually changed by calling a stored procedure,
`dolt_assume_cluster_role`. This can be used for controlled and lossless
failover from a primary to a standby. It can also be used to promote a standby
to a primary when a primary is lost, although in that case the failover is not
guaranteed to be lossless.

To make the current primary become a standby, run the following:

```sql
CALL dolt_assume_cluster_role('standby', 2)
```

where `2` is the new configuration epoch and must be higher than the current
epoch. The behavior will be the following:

1) The server will be put into read-only mode.

2) Every running SQL connection, except for the `CALL dolt_assume_cluster_role`
   call itself, will be canceled and the connection for the queries will be
   terminated.

3) The call will block until replication of every database to each
   `standby_replica` is completed.

4) If the final replications complete successfully, the new role and new
   configuration epoch are applied. If the final replications time out or fail,
   the new role is not assumed &mdash; the database is placed back into read-write
   mode and remains a `primary` at the old epoch.

5) If the call is successful, the connection over which it was made will be
   tainted. It will fail all queries with an error asking the user to reconnect.

To make a current standby become a primary, run the following:

```sql
CALL dolt_assume_cluster_role('primary', 2)
```

where `2` is the new configuration epoch and must be higher than the current
epoch. The behavior will be the following:

1) The server will be put into read-write mode.

2) Every running SQL connection, except for the `CALL dolt_assume_cluster_role`
   call itself, will be canceled and the connection for the queries will be
   terminated.

3) The new role and epoch will be applied on the server.

4) The connection over which the call was made will be tainted. It will fail
   all queries with an error asking the user to reconnect.

In the configured example, if you run the first statement on `dolt-1.db` and
the second statement on `dolt-2.db`, you will have performed an oderly failover
from `dolt-1.db` to make `dolt-2.db` the new primary.

### Automatic Role Transitions

It can happen that server instances learn about new role configuration from
their peers as they attempt to replicate writes or when they receive a
replication request. In some of these cases, the server can automatically
transition to a new role based on the incoming traffic or based on what it
learns from its standby remote when it attempts to replicate. In particular,
the following can happen:

1) When a `primary` is replicating to a `standby_remote`, if it learns that the
   `standby_remote` is itself currently configured to be a `primary` at a
   configuration epoch which is higher than the replicating server, the
   replicating server will immediately transition to be a `standby` at the same
   epoch as the epoch of the `standby_remote`.

2) When a server receives a replication request, and the incoming request is
   from a configured `primary` which is at a higher configuration epoch than the
   server itself, the server will immediately transition to be a `standby` at the
   same configuration epoch as the server which is making the incoming replication
   request.

In both cases, the transition will cause all existing queries and connections
to the sql-server to be killed.

One further case can arise. If at any point, two servers communicate and they
see that they are both configured as role primary in the same configuration
epoch, that represents a fundamental misconfiguration of the cluster. The
servers will transition to a special role, `detected_broken_config`. In this
role, the servers will serve read-only traffic, will reject writes of SQL, and
will reject replication requests from other servers which may think they are
primary at the same epoch. The role is somewhat viral &mdash; if other servers
communicate with these servers and see the `detected_broken_config` role at the
same epoch, those servers will also transition to `detected_broken_config`. A
server which is in `detected_broken_config` will become a `standby` if it
receives a replication request from a primary at a higher configuration epoch.
It can also change its role based on a call to `dolt_assume_cluster_role`.

A server never automatically transitions to be a primary.

## Monitoring Replication Status

When configured with a `cluster:` stanza in its YAML configuration, the
sql-server instance will expose replication status through the SQL interface.

The current role and configuration epoch can be accessed through global session
variables.

```sql
mysql> select @@GLOBAL.dolt_cluster_role, @@GLOBAL.dolt_cluster_role_epoch;
+----------------------------+----------------------------------+
| @@GLOBAL.dolt_cluster_role | @@GLOBAL.dolt_cluster_role_epoch |
+----------------------------+----------------------------------+
| primary                    |                               15 |
+----------------------------+----------------------------------+
```

The current status of replication to the standby can be queried in a system
table of a system database, `dolt_cluster.dolt_cluster_status`.

```sql
mysql> select * from dolt_cluster.dolt_cluster_status;
+----------+----------------+---------+-------+------------------------+----------------------------+---------------+
| database | standby_remote | role    | epoch | replication_lag_millis | last_update                | current_error |
+----------+----------------+---------+-------+------------------------+----------------------------+---------------+
| appdb    | standby        | primary |    15 |                      0 | 2022-10-17 19:07:38.366702 | NULL          |
+----------+----------------+---------+-------+------------------------+----------------------------+---------------+
```

For monitoring the health of replication, we recommend alerting on:

1) No configured `primary` in the cluster.

2) NULL or growing `replication_lag_millis` on the primary.

3) Non-NULL `current_error`.

4) Any server in the cluster in role `detected_broken_config`.

## A Note on Security

As currently implemented, enabling cluster replication on a dolt sql-server
instance will expose an unauthenticated dolt remote endpoint on port
`cluster.remotesapi.port` of the sql-server host. The endpoint will perform no
peer authentication and will perform no authorization checks. Anyone with
access to that TCP port on any IP address of that host will be able to connect
to the endpoint and perform reads and writes against any database in the
sql-server, including deleting all the data in the database.

The only way to safely deploy dolt sql-server cluster replication currently is
with some form of network firewall or behind an authenticating proxy. For
example, [envoy](https://www.envoyproxy.io/) can be used to front both the
inbound and outbound traffic replication traffic, and the envoy proxies in the
cluster can authenticate each other using mTLS or some other shared secret.
