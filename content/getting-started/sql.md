---
title: Using SQL
---

## Background

This section provides a very brief introduction to the the Dolt SQL implementation, along with some tutorials on how to get started running SQL.

## Getting Started

To follow along with this tutorial you need to have Dolt installed. See the [installation tutorial](installation), but it's as easy as `brew install dolt` for Mac users, and we publish `.msi` files for Windows users. Before we dive in let's grab some sample data using Dolt's Git-like `clone` operation:

```text
$ dolt clone dolthub/great-players-example && cd great-players-example
cloning https://doltremoteapi.dolthub.com/dolthub/great-players-example
8 of 8 chunks complete. 0 chunks being downloaded currently.
```

### CLI

There are two options for accessing a SQL interface via the Dolt command line. The most basic option is to run a single command and pass in a query:

```text
$ dolt sql -q 'show tables'
+---------------+
| Table         |
+---------------+
| great_players |
+---------------+
```

And then let's take a look at the actual data:

```text
$ dolt sql -q 'select * from great_players'
+-------+----+
| name  | id |
+-------+----+
| rafa  | 1  |
| roger | 2  |
| novak | 3  |
| andy  | 4  |
+-------+----+
```

We can launch a SQL shell to get a more interactive feel:

```text
$ dolt sql
# Welcome to the DoltSQL shell.
# Statements must be terminated with ';'.
# "exit" or "quit" (or Ctrl-D) to exit.
great_players_example> show tables;
+---------------+
| Table         |
+---------------+
| great_players |
+---------------+
great_players_example> select * from great_players;
+-------+----+
| name  | id |
+-------+----+
| rafa  | 1  |
| roger | 2  |
| novak | 3  |
| andy  | 4  |
+-------+----+
```

This is a nice interface for exploring data, but for a database to be useful it has to accept connections from clients, not just provide a shell.

### Dolt SQL Server

The Dolt SQL Server can be launched from the command line:

```text
$ dolt sql-server
Starting server with Config HP="localhost:3306"|U="root"|P=""|T="30000"|R="false"|L="info"
```

In the following sections we show that you can connect to this Dolt SQL Server using MySQL clients, and other familiar database clients.

#### MySQL Client

If you're using macOS, you can install a MySQL client using `brew install mysql-client`. Other platforms provide similarly simple installation options. They call put a `mysql` command on your path, which will launch a client process that attempts to connect to a server.

Let's connect to the Dolt SQL Server we just started:

```text
$ mysql -h 127.0.0.1 -P 3306 -u root -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 1
Server version: 5.7.9-Vitess

Copyright (c) 2000, 2019, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
```

Here the password is empty, that is the default for our Dolt SQL Server. If you want to go beyond local experiments a YAML file can be provided with configurations needed for a production instance. You can read about those in more detail [here](../reference/sql), but for now we will proceed without security.

We didn't specify a database when connecting, but we can use the `show databases` command to see which database our Dolt SQL Server instance has mounted:

```text
mysql> show databases;
+-----------------------+
| Database              |
+-----------------------+
| great_players_example |
| information_schema    |
+-----------------------+
2 rows in set (0.00 sec)
```


Let's select a database so we can execute some queries:

```text
mysql> use great_players
ERROR 1105 (HY000): unknown error: database not found: great_players
mysql> use great_players_example
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
```

Shell clients for SQL databases are good for testing connections and exploring data, but they aren't useful for building applications. For that we need higher level programming language. In the next section we show how to use Python MySQL connectors to write scripts that interact with Dolt.

### Python
We have created a Python API for Dolt, which includes convenience methods for interacting with Dolt SQL Server. You can read more about that API [here](../../reference/python). In this example we use the off the shelf Python connector to emphasize compatibility with MySQL wire protocol.

First off, install the connector, which should look like something like this:
```text
pip install mysql-connector-python
Collecting mysql-connector-python
  Downloading https://files.pythonhosted.org/packages/3d/d6/e9834b6c28442a250ea6e6aa67de3878ed81ccd3c205fbe18eb0e635f212/mysql_connector_python-8.0.23-cp37-cp37m-macosx_10_14_x86_64.whl (4.9MB)
     |████████████████████████████████| 4.9MB 4.8MB/s
Requirement already satisfied: protobuf>=3.0.0 in ./anaconda3/lib/python3.7/site-packages (from mysql-connector-python) (3.10.0)
Requirement already satisfied: setuptools in ./anaconda3/lib/python3.7/site-packages (from protobuf>=3.0.0->mysql-connector-python) (41.0.1)
Requirement already satisfied: six>=1.9 in ./anaconda3/lib/python3.7/site-packages (from protobuf>=3.0.0->mysql-connector-python) (1.12.0)
ERROR: doltpy 2.0.2 has requirement mysql-connector-python==8.0.21, but you'll have mysql-connector-python 8.0.23 which is incompatible.
Installing collected packages: mysql-connector-python
Successfully installed mysql-connector-python-8.0.23
```

Now let's create a small script example:
```python
from mysql import connector

conn = connector.connect(host='127.0.0.1',
                         user='root',
                         database='great_players_example',
                         port=3306)
cursor = conn.cursor()
cursor.execute('select * from great_players')
for tup in [tup for tup in cursor]:
  print(tup)
```

Which produces something like:

```text
('rafa', '1')
('roger', '2')
('novak', '3')
('andy', '4')
```

As a reminder, Doltpy provides some convenience methods for interacting with local Dolt databases.

## Conclusion

In this section we showed how to connect with Dolt SQL Server using off the shelf MySQL connectors to take advantage of Dolt's compatibility with the MySQL dialect.
