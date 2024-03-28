---
title: Running the DoltgreSQL Server
---

Start the DoltgreSQL server with the sql-server command:

```bash
% doltgres sql-server
```

Or without any subcommand:

```bash
% doltgres
```

# Data location

The location of any databases created depends on the setting of the `DOLTGRES_DATA_DIR` environment
variable. For example:

```bash
% export DOLTGRES_DATA_DIR=~/dbs/
% doltgres &
% psql -h 127.0.0.1 -U doltgres -c "CREATE DATABASE newDb"
```

The `newDb` database above will be stored at the location `~/dbs/newDb`.

If you don't set this environment variable, it defaults to `~/doltgres/databases`.

You can override this location on the command line with the `--data-dir` flag:

```bash
% doltgres --data-dir /var/doltgres/dbs
```

Or you can provide it in a `config.yaml` file:

```bash
% cat config.yaml
log_level: debug

behavior:
  read_only: false
  autocommit: true

user:
  name: "doltgres"
  password: "password"

listener:
  host: localhost
  port: 5432
  read_timeout_millis: 28800000
  write_timeout_millis: 28800000

data_dir: /var/doltgres/dbs

cfg_dir: .doltcfg

% doltgres --config config.yaml
```

# Configuration options

Like `dolt`, `doltgres` accepts several configuration options both as command line parameters or via
a `config.yaml` file. The [docs for the `sql-server`
command](../../cli-reference/cli.md#dolt-sql-server) for Dolt cover most of these options. You can
also consult `doltgres --help` for a listing of all configuration options.
