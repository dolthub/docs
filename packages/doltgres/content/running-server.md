---
title: Running the DoltgreSQL Server
---

Start the DoltgreSQL server by running the `doltgres` command:

```bash
% doltgres
```

# Configuration options

Like `dolt`, `doltgres` accepts several configuration options both as command line parameters or via
a `config.yaml` file. The [docs for the `sql-server`
command](https://docs.dolthub.com/cli-reference/cli#dolt-sql-server) for Dolt cover most of these options. You can
also consult `doltgres --help` for a listing of all configuration options.

# Data location

The location of any databases created depends on the setting of the `DOLTGRES_DATA_DIR` environment
variable. For example:

```bash
% export DOLTGRES_DATA_DIR=~/dbs/
% doltgres &
% psql -h 127.0.0.1 -U doltgres -c "CREATE DATABASE newDb"
```

The `newDb` database above will be stored at the location `~/dbs/newDb`. The first time you run the
`doltgres` command, a database named `doltgres` will be created for you in the data directory if it
doesn't exist.

If you don't set this environment variable, it defaults to `~/doltgres/databases`.

You can override this location on the command line with the `--data-dir` flag:

```bash
% doltgres --data-dir /var/doltgres/dbs
```

Or you can provide it in a `config.yaml` file:

```yaml
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
```

Provide the path to the `config.yaml` on the command line with the `--config` option.

```bash
% doltgres --config config.yaml
```
