# SQL-Server with Python Clients

Any programming language or language package with a MySQL
client can also connect to Dolt. Here we will discuss Python specific
MySQL clients.

Dolt is 99% MySQL compatible, and extends [custom SQL
functions](../../reference/sql/dolt-sql-functions.md)
specific to version controlling. ([this blog is a good practical
introduction](https://www.dolthub.com/blog/2021-03-12-dolt-sql-server-concurrency/)).

The full set of MySQL commands that Dolt supports can be found
[here](../../reference/sql/sql-support/support.md).

Integration examples:

- [Great Expectations Integration](https://www.dolthub.com/blog/2021-06-15-great-expectations-plus-dolt/)

- [Kedro Integration](https://www.dolthub.com/blog/2021-06-16-kedro-dolt-plugin/)

- [Various DataFrame Integrations](https://www.dolthub.com/blog/2021-03-22-dolt-dataframes/)

## Starting a Dolt Server

Install Dolt:

```bash
$ sudo bash -c 'curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | sudo bash'
```

Create or clone a database:

```bash
$ mkdir new-databasse
$ cd new-database
$ dolt init
```

Start a server:

```bash
$ dolt sql-server -l trace --max-connections 10
```

Test connection in a different window:

```bash
$ mysql --user=root --host=0.0.0.0 -p new_database
Enter password:
mysql >
```

## Clients

### PyMySQL

PyMySQL is one of many MySQL Python client libraries. Dolt's version
control functions are exposed in SQL, and you can run every Dolt
function except `dolt clone` using its SQL equivalent.

Connecting to a Dolt database looks identical to connecting to MySQL:

```python
>>> import pymysql.cursors
>>> conn = pymysql.connect(
    host="localhost",
    user="root",
    password="",
    database="new_database",
    cursorclass=pymysql.cursors.DictCursor,
)
>>> with conn.cursor() as cur:
        cur.execute("select * from dolt_log")
        cur.fetchone()
>>> conn.commit()
{'commit_hash': 'bki1pgk63a34ouqj0mvjg5mfqtgf7jh1', 'committer': 'Max Hoffman', 'email': 'max@dolthub.com', 'date': datetime.datetime(2021, 6, 24, 20, 9, 56, 82000), 'message': 'Initialize data repository'}
```

Refer to the [`pymysql`
docs](https://pymysql.readthedocs.io/en/latest/user/examples.html)
for more information.

### SQLAlchemy

SQLAlchemy sits between Python applications an databases, letting
Python libraries support multiple database dialects with a single
SQLAlchemy integration.

Libraries that implement an SQLAlchemy integration are also
Dolt-compatible.

You would normally let SQLAlchemy generate query strings depending on
the database dialect. Below is a simple progression of the pymysql
connector with a hardcoded query:

```python
>>> from sqlalchemy import create_engine
>>> engine = create_engine("mysql+pymysql://root@localhost/new_database")
>>> with engine.begin() as conn:
...     conn.execute("select * from dolt_log limit 1").fetchone()
('bki1pgk63a34ouqj0mvjg5mfqtgf7jh1', 'Max Hoffman', 'max@dolthub.com', datetime.datetime(2021, 6, 24, 20, 9, 56, 82000), 'Initialize data repository')
```

Refer to the [`sqlalchemy`
docs](https://docs.sqlalchemy.org/en/14/dialects/mysql.html)
for more information.

### Pandas

Pandas is a data manipulation library. Pandas has a feature that moves
data between DataFrames and databases using SQLAlchemy connectors.

```python
>>> import pandas as pd
>>> from sqlalchemy import create_engine
>>> df = pd.DataFrame({"name" : ["User 1", "User 2", "User 3"]})
>>> engine = create_engine("mysql+pymysql://root@localhost/new_database")
>>> df.to_sql("users", con=engine, index=None)
>>> pd.read_sql("select * from users", engine)
     name
0  User 2
1  User 3
2  User 1
```

Refer to the [`pandas`
docs](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_sql.html)
for more details.
