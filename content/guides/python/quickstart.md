# Python Quickstart

Refer to [Python guides](../guides/python/README.md) to learn more.

## CLI:

```bash
$ sudo bash -c 'curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | sudo bash'
$ pip install --user doltcli
$ python
>>> import doltcli as dolt
>>> db = dolt.Dolt.clone("max-hoffman/qm9")
>>> db
Dolt(repo_dir='/Users/max-hoffman/qm9', print_output=False)
>>> db.sql("select id, elements from qm9_features limit 1", result_format="json")
{'rows': [{'id': 'gdb_17152', 'elements': [7, 6, 6, 6, 6, 6, 8, 6, 1, 1, 1, 1, 1]}]}
```

## Server

Start server:

```bash
$ sudo bash -c 'curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | sudo bash'
$ dolt clone max-hoffman/qm9
cloning https://doltremoteapi.dolthub.com/max-hoffman/qm9
50,437 of 50,437 chunks complete. 0 chunks being downloaded currently.
$ cd qm9
$ dolt sql-server -l trace --max-connections 10
```

Connect to server with client:

```python
$ python
>>> from sqlalchemy import create_engine
>>> engine = create_engine("mysql+pymysql://root@localhost/qm9")
>>> with engine.begin() as connection:
...     conn.execute("select id, elements from qm9_features limit 1").fetchone()
('gdb_107528', '[8, 6, 6, 6, 6, 6, 6, 6, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1]')
```
