---
title: Reading from Dolt
---

# Reading

## Introduction

This tutorial covers how to read from Dolt databases using three different interfaces, the command line interface \(CLI\), SQL, and Python \(using Doltpy\). In the [installation tutorial](installation.md) we covered installing Dolt, which provides the CLI and SQL. We also covered installing Doltpy, which provides the Python tools for interacting with Dolt that we will use.

## Clone an Example Database

Before looking at the different interfaces, let's grab a public database from [DoltHub](../dolthub/getting-started.md). Dolt implements Git-like clone operations, so it's easy enough:

```text
$ dolt clone dolthub/ip-to-country && cd ip-to-country
cloning https://doltremoteapi.dolthub.com/dolthub/ip-to-country
23,716 of 23,716 chunks complete. 0 chunks being downloaded currently.
```

You now have a Dolt dataset locally in a directory `ip-to-country` that the `clone` command created. You should see the following:

```text
$ ls -ltra
total 0
drwxr-xr-x  6 oscarbatori  staff   192B May  3 17:20 ../
drwxr-xr-x  3 oscarbatori  staff    96B May  3 17:20 ./
drwxr-xr-x  6 oscarbatori  staff   192B May  3 17:21 .dolt/
```

We can immediately begin exploring this data by launching a SQL interpreter:

```text
$ dolt sql
# Welcome to the DoltSQL shell.
# Statements must be terminated with ';'.
# "exit" or "quit" (or Ctrl-D) to exit.
ip_to_country> show tables;
+---------------+
| Table         |
+---------------+
| IPv4ToCountry |
| IPv6ToCountry |
+---------------+
ip_to_country> describe IPv4tocountry;
+--------------------+----------+------+-----+---------+-------+
| Field              | Type     | Null | Key | Default | Extra |
+--------------------+----------+------+-----+---------+-------+
| IPFrom             | BIGINT   | NO   | PRI |         |       |
| IpTo               | BIGINT   | NO   | PRI |         |       |
| Registry           | LONGTEXT | YES  |     |         |       |
| AssignedDate       | BIGINT   | YES  |     |         |       |
| CountryCode2Letter | LONGTEXT | YES  |     |         |       |
| CountryCode3Letter | LONGTEXT | YES  |     |         |       |
| Country            | LONGTEXT | YES  |     |         |       |
+--------------------+----------+------+-----+---------+-------+
```

You should now skip ahead to whichever API you want to use for reading data from Dolt.

## CLI

Let's suppose we want to get a CSV with the counts of the IP mappings by country:

```text
$ dolt sql -q 'select Country,count(*) from IPv4ToCountry group by Country order by count(*) desc' -r csv > results.csv
$ head results.csv
Country,COUNT(*)
United States,56561
Brazil,10977
Russian Federation,10871
Germany,9332
China,8528
Canada,8163
United Kingdom,8116
Australia,7979
India,6165
```

This example illustrates the core value of Dolt as a data distribution format: Dolt delivered a functioning SQL database with just a _single command_, and we were able to generate an analysis instantly.

We can expose this query interface via a SQL server in a familiar manner, that is a server process that compiles and executes SQL statements. We now cover how to stand up Dolt's SQL server.

## SQL

In the previous section we acquired a Dolt database and used the Dolt CLI to execute some SQL against that database. Here we use a stock MySQL client to interact with Dolt. If you're using Homebrew it's easy enough to install:

```text
$ brew install mysql-client
Updating Homebrew...
==> Auto-updated Homebrew!
.
.
.
==> Downloading https://homebrew.bintray.com/bottles/mysql-client-8.0.19.mojave.bottle.tar.gz
==> Downloading from https://akamai.bintray.com/c8/c8d2434da809237c64cd3dd4139a2bd148b6773fca040c001cc7af468354e761?__gda__=exp=1590007034~hmac=ae2a06b14b4eef499282b0f2e473bde458d83b3f8d61218565e3b468af5b5171&response-content-disposition=attachment%3Bfilena
######################################################################## 100.0%
.
.
.
```

See the MySQL [documentation](https://dev.mysql.com/downloads/mysql/) for details on installation on other platforms.

To use a MySQL client, we need a server. We can use the CLI to fire up Dolt SQL Server:

```text
$ dolt sql-server --log-level info
Starting server with Config HP="localhost:3306"|U="root"|P=""|T="30000"|R="false"|L="info"
```

Note that we have to run this command from directory that your Dolt database was initialized in \(or moved to\). The name of the database will be the name of the directory, mapped to legal database names. Let's go ahead and connect. We are using default username `root` and empty password, but both of these values can be configured:

```text
$ mysql -h 127.0.0.1 -u root
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 21
Server version: 5.7.9-Vitess

Copyright (c) 2000, 2019, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| ip_to_country      |
+--------------------+
2 rows in set (0.00 sec)

mysql> use ip_to_country;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> show tables;
+---------------+
| Table         |
+---------------+
| IPv4ToCountry |
| IPv6ToCountry |
+---------------+
2 rows in set (0.00 sec)
```

Dolt SQL Server can make your Dolt database into a familiar MySQL-like database that can be connected to using existing tools.

## Python

Doltpy is a Python API for Dolt. If you haven't installed Doltpy, then refer to the [installation tutorial](installation.md) for details, but if you're using `pip` it's simple:

```text
$ pip install doltpy
.
.
.
```

The first thing we need is a reference to a `doltpy.cli.Dolt` object which wraps the Dolt database we cloned. That's easy enough:

```python
from doltpy.cli import Dolt
dolt = Dolt('dolthub/ip-to-country')
```

Reading a table to a `pandas.DataFrame` object is straightforward:

```python
from doltpy.cli.read import read_pandas
df = read_pandas(dolt, 'IPv4ToCountry')
```

This produces the expected `pandas.DataFrame`, printed below using iPython:

```text
>>> print(df)
            IPFrom        IpTo Registry  AssignedDate CountryCode2Letter CountryCode3Letter    Country
0                0    16777215     iana     410227200                 ZZ                ZZZ   Reserved
1         16777216    16777471    apnic    1313020800                 AU                AUS  Australia
2         16777472    16777727    apnic    1302739200                 CN                CHN      China
3         16777728    16778239    apnic    1302739200                 CN                CHN      China
4         16778240    16779263    apnic    1302566400                 AU                AUS  Australia
...            ...         ...      ...           ...                ...                ...        ...
212179  4211081216  4227858431     iana     410227200                 ZZ                ZZZ   Reserved
212180  4227858432  4244635647     iana     410227200                 ZZ                ZZZ   Reserved
212181  4244635648  4261412863     iana     410227200                 ZZ                ZZZ   Reserved
212182  4261412864  4278190079     iana     410227200                 ZZ                ZZZ   Reserved
212183  4278190080  4294967295     iana     410227200                 ZZ                ZZZ   Reserved

[212184 rows x 7 columns]
```

We can execute SQL queries via Dolt if we would like to push our data preparation down into our database layer:

```python
from doltpy.cli.read import read_pandas_sql
query = '''
  select
    Country, count(*)
  from
    IPv4ToCountry
  group by
    Country
  order by
    count(*) desc
'''
read_pandas_sql(dolt, query)
df.to_csv('results.csv')
```

The functionality available via the Dolt CLI and SQL interfaces can be accessed via Doltpy. This makes it easy to integrate Dolt into existing data engineering workflows using Python.

## R

Dolt's SQL server can be connected to using any MySQL connector. In the case of R, this means we can use the `RMySQL` package to connect to the Dolt database and then use familiar R interfaces. Let's again clone the dataset of interest:

```text
$ dolt clone dolthub/ip-to-country && cd ip-to-country
cloning https://doltremoteapi.dolthub.com/dolthub/ip-to-country
23,716 of 23,716 chunks complete. 0 chunks being downloaded currently.
```

Now we need to start the Dolt SQL Server instance:

```text
$ dolt sql-server
Starting server with Config HP="localhost:3306"|U="root"|P=""|T="30000"|R="false"|L="info"
```

Let's jump into the R, first let's install the required package and load the DBI package:

```text
install.packages("RMySQL")
library(RMySQL)
library(DBI)
```

We can no instantiate a connection object and start checking out the data:

```text
con <- dbConnect(MySQL(),
                 dbname = 'ip_to_country',
                 host = '127.0.0.1',
                 port = 3306,
                 user = 'root')
                 > dbListTables(con)
[1] "IPv4ToCountry"      "IPv6ToCountry"
```

You can now proceed to do your data analysis using the familiar database interfaces provided by the DBI package without worrying too much about Dolt at all.

## Summary

We examined four different interfaces for examining data stored in a Dolt database. In each case we obtained the data using the `dolt clone` command, which mimics the Git command that has made acquiring code so easy. The data that arrived via the command line could be immediately worked with via a SQL interface.

This illustrates the core value proposition of Dolt as a distribution format. Dolt provides seamless data distribution, and a familiar query interface, along with a server process for executing those queries.
