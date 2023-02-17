# Configuration

A Dolt SQL server can be configured at server start time, or by setting system variables in the SQL session. The simplest way to configure server behavior is to provide a config file with the `--config` flag. Here's an example file:

```yaml
log_level: info

behavior:
  read_only: false
  autocommit: true

user:
  name: root
  password: ""

listener:
  host: localhost
  port: 3306
  max_connections: 100
  read_timeout_millis: 28800000
  write_timeout_millis: 28800000

performance:
  query_parallelism: null
```

The full list of supported fields can be found in the [docs for the sql-server command](../../cli-reference/cli.md#dolt-sql-server).

## System variables

Dolt defines system variables that you can set in your session via the `SET` syntax. Many of these can be persisted, so they remain set after a server restart.

```sql
set @@dolt_transaction_commit = 1;
```

A full list of available system variables can be found in the [docs on system variables](../version-control/dolt-sysvars.md).
