---
title: Dolt Python
---

# Dolt Python

* [Doltpy](./doltpy.md): For new users, experimentation and testing

* [Python SQL Clients](./sql_clients.md): For integrations and production Dolt Python.

## Summary

There are several ways to use Dolt with Python. All require
[installing the dolt command line tool](../../getting-started/installation.md).
Dolt's MySQL client/server support has the most development attention,
but Dolt's CLI commands are a simpler way to get started
with Python.

The sections below detail "sql-server" and "filesystem" interfaces for
working with Dolt in Python. Refer to the [CLI vs. server summary](../../interfaces/compare_cli.md)
for a side by side comparison of how the data interface affects
application flexibility.

More information regarding SQL-server use can be found in the [Python
SQL Client guide](./sql_clients.md).

More information regarding Dolt CLI use in Python use can be found in the [Doltpy
guides](./doltpy.md). If interested in the source code, [this
file](https://github.com/dolthub/doltcli/blob/main/doltcli/dolt.py)
is responsible for most of basic commands. Most read/write source code is
[here](https://github.com/dolthub/doltcli/blob/main/doltcli/utils.py).

### SQL-Server

Using a MySQL client driver to interact with
a Dolt sql-server is the preferred way of
using Dolt with Python. At production scale, Dolt is more practical
as a Postgres or RDS substitute with additional
versioning features.

Several existing Python client packages communicate with SQL servers
and integrate with Dolt:

- [`pymysql`](https://pymysql.readthedocs.io/en/latest/user/examples.html)

- [`sqlalchemy`](https://docs.sqlalchemy.org/en/14/dialects/mysql.html)

- [`pandas`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_sql.html)

Practical examples using Dolt sql-server:

- [Great Expectations Integration](https://www.dolthub.com/blog/2021-06-15-great-expectations-plus-dolt/)

- [Kedro Integration](https://www.dolthub.com/blog/2021-06-16-kedro-dolt-plugin/)

### Filesystem

Contrary to the SQL-Server setup, Dolt's CLI is an all-in-one package
and the easiest way to jump into experimenting. Dolt standalone contains all the
tools needed to create and mutate databases.

If so inclined, you could use
[`subprocess.Popen`](https://docs.python.org/3/library/subprocess.html)
to directly call dolt shell commands from Python:

```bash
$ python3
>>> import subprocess
>>> subprocess.run(["dolt", "clone", "max-hoffman/qm9"])
cloning https://doltremoteapi.dolthub.com/max-hoffman/qm9
50,437 of 50,437 chunks complete. 0 chunks being downloaded currently.
CompletedProcess(args=['dolt', 'clone', 'max-hoffman/qm9'], returncode=0)
```

We built wrapper librares (`doltpy`, `doltcli`) to simplify this experience in Python:

```bash
$ pip install --user doltcli
$ python
>>> import doltcli as dolt
>>> dolt.Dolt.clone("max-hoffman/qm9")
Dolt(repo_dir='/Users/max-hoffman/qm9', print_output=False)
```

Dolt's Python libraries have their own heirarchy and usage patterns.
`doltcli` is dependencyless and minimizes
package conflicts for those getting started with Dolt locally.
`doltpy` has more features to integrate with
tools in the Python ecosystem. For example, `doltpy.cli.write_pandas`
helps users import `Pandas.DataFrame` tables into Dolt:

```bash
$ pip install --user doltpy
$ python
>>> import pandas as pd
>>> import doltpy.cli as dolt
>>> from doltpy.cli.write import write_pandas
>>>
>>> df = pd.DataFrame({'name' : ['User 1', 'User 2', 'User 3']})
>>> db = dolt.Dolt.init()
>>> write_pandas(dolt=db, table="users", df=df, import_mode="create", primary_key=["name"])
>>> db.sql("select * from users where name = 'User 1'", result_format="json")
{'rows': [{'name': 'User 1'}]}
```
