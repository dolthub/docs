---
title: Using SQL
---

# Using SQL

## Background

This section provides a very brief introduction to the the Dolt SQL implementation, along with some tutorials on how to get started running SQL.

## Getting Started

To follow along with this tutorial you need to have Dolt installed. See the [installation tutorial](installation), but it's as easy as `brew install dolt` for Mac users, and we publish `.msi` files for Windows users. The Dolt binary has a SQL execution engine which will allow it to act as a relational database when combined with a repository. Before we dive in let's grab some sample data:

```text
$ dolt clone dolthub/great-players-example && cd great-players-example
cloning https://doltremoteapi.dolthub.com/dolthub/great-players-example
8 of 8 chunks complete. 0 chunks being downloaded currently.
```

With one command you have acquired a SQL database which we can use to demonstrate Dolt's SQL implementation.

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

The nice thing about a database is rather than a collection of data files, it presents itself as a coherent whole, with metadata that can be queried. Running commands one at a time doesn't take full advantage of the query interface. To do that, launch the interactive shell:

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

This is a nice interface for exploring data, but doesn't do us much good if we want to use existing data interfaces, or perhaps read this data into an existing application.

### MySQL Server

To meet the needs of users who want to read Dolt data into existing data tools and applications, we provide the ability to stand up a MySQL Server instance. To learn more about our implementation of the MySQL server standard, we go over it in some detail [here](../reference/sql). The implementation is open source. Let's fire it up:

```text
$ dolt sql-server
Starting server with Config HP="localhost:3306"|U="root"|P=""|T="30000"|R="false"|L="info"
```

Let's connect to it via a few different interfaces to reinforce the idea that a Dolt database presents a familiar database server interface to existing ODBC clients.

#### MySQL Client

If you're using a Mac, you can install a MySQL client using `brew install mysql-client`, which will in turn create a command called `mysql` that will fire up the client, and installers are available for all platforms. Let's fire it up:

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

Here the password is empty, that is the default for our MySQL Server. If you want to go beyond local experiments, that can be configured, along with many other options, in the YAML file that defines the operating parameters of the server. You can read about those in more detail [here](../reference/sql), but for now we will proceed without security.

Careful readers might also observe that we didn't connect to a specific database. Just like SQL databases we know and love, Dolt MySQL Server has a concept of a database separate from the instance of a server: \`\`\`mysql&gt; show databases; +-----------------------+ \| Database \| +-----------------------+ \| great\_players\_example \| \| information\_schema \| +-----------------------+ 2 rows in set \(0.01 sec\)

```text
The sever can also be configured the server to point at multiple Dolt databases. This enables users to use ``

For now let's focus on emphasizing the familiarity of this interface by focusing on our small example repository, which corresponds to a database in the context of a database server instance:
```

mysql&gt; use great\_players\_example; Reading table information for completion of table and column names You can turn off this feature to get a quicker startup with -A

Database changed mysql&gt; select \* from great\_players; +-------+------+ \| name \| id \| +-------+------+ \| rafa \| 1 \| \| roger \| 2 \| \| novak \| 3 \| \| andy \| 4 \| +-------+------+ 4 rows in set \(0.00 sec\)

```text
Not many applications are built on top of a SQL interpreter, though it's useful for illustrative purposes to show that this works with out of the box SQL clients.

### Python
We have created a Python API for Dolt, which includes convenience methods for interacting with our MySQL Server instance. You can read more about that [here](../../reference/python). Here we focus on using a raw MySQL connector to emphasize the familiarity of the interface. We assume you have `python` and `pip` in your path.

First off, install the connector, which should look like something like this:
```

pip install mysql-connector-python==8.0.17 Collecting mysql-connector-python==8.0.17 Using cached mysql\_connector\_python-8.0.17-cp37-cp37m-macosx\_10\_13\_x86\_64.whl \(4.2 MB\) Collecting protobuf&gt;=3.0.0 Using cached protobuf-3.11.3-cp37-cp37m-macosx\_10\_9\_x86\_64.whl \(1.3 MB\) Requirement already satisfied: setuptools in /Users/oscarbatori/anaconda3/envs/python-mysql-test/lib/python3.7/site-packages \(from protobuf&gt;=3.0.0-&gt;mysql-connector-python==8.0.17\) \(46.1.3.post20200330\) Collecting six&gt;=1.9 Using cached six-1.14.0-py2.py3-none-any.whl \(10 kB\) Installing collected packages: six, protobuf, mysql-connector-python Successfully installed mysql-connector-python-8.0.17 protobuf-3.11.3 six-1.14.0

```text
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

Here we showed several familiar ways to connect with a MySQL server instance that executes SQL queries against your Dolt data. The benefit of this is that there is a great deal of existing infrastructure for connecting to SQL databases, and by implementing the familiar MySQL, Dolt reduces to cost of adoption for users wanting the benfits for a version controlled relational database.
