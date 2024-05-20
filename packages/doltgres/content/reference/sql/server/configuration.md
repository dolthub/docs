---
title: Configuration
---

# Configuration

A Doltgres SQL server can be configured at server start time, or by
setting system variables in the SQL session. The simplest way to
configure server behavior is to provide a config file with the
`--config` flag. Here's an example file:

```yaml
log_level: info

behavior:
  read_only: false

user:
  name: root
  password: password

listener:
  host: localhost
  port: 5432
  read_timeout_millis: 28800000
  write_timeout_millis: 28800000
  
data_dir: /var/doltgres/dbs

cfg_dir: .doltcfg
```

The full list of supported fields can be found by running `doltgres --help`.

<!-- TODO: Flesh this out with the full list of config settings, since we don't have CLI ref to fall
    back on like dolt does -->

## System variables

Doltgres defines system variables that you can set in your session via the
`SET` syntax. Many of these can be persisted, so they remain set after
a server restart.

```sql
set dolt_transaction_commit 1;
```

A full list of available system variables can be found in the [docs on
system variables](../version-control/dolt-sysvars.md).
