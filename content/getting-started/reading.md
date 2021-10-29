---
title: Reading from Dolt
---

# Reading from Dolt databases

## Cloning a Database

```text
$ dolt clone dolthub/ip-to-country && cd ip-to-country
cloning https://doltremoteapi.dolthub.com/dolthub/ip-to-country
23,716 of 23,716 chunks complete. 0 chunks being downloaded currently.
```

Other databases to clone are available on
[DoltHub](https://dolthub.com).

## SQL shell

```bash
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

Run single SQL statements with the `-q` argument.

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

## SQL Server

Run your dolt database as a SQL server with `dolt sql-server`. Talk to
it with any tool that speaks MySQL, such as the MySQL client.

For homebrew on OS X, use this command:

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

See the MySQL [documentation](https://dev.mysql.com/downloads/mysql/)
for details on installation on other platforms.

Start the server:

```text
$ dolt sql-server --log-level info
Starting server with Config HP="localhost:3306"|U="root"|P=""|T="30000"|R="false"|L="info"
```

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

## Python

To read Dolt data in Pandas or another Python data tool, install
`doltpy`. See instructions in the [Python quickstart
guide](../guides/python/quickstart.md).

## R

R can use the `RMySQL` package to connect to a Dolt database server.

Install the required package and load the DBI package:

```text
install.packages("RMySQL")
library(RMySQL)
library(DBI)
```

We can now instantiate a connection object and start checking out the data:

```text
con <- dbConnect(MySQL(),
                 dbname = 'ip_to_country',
                 host = '127.0.0.1',
                 port = 3306,
                 user = 'root')
                 > dbListTables(con)
[1] "IPv4ToCountry"      "IPv6ToCountry"
```

## Next steps

Check out the guide to [Writing to Dolt](writing.md) to learn options for updating
the database.

Or dive right into the docs for the [SQL
interface](../interfaces/sql/README.md) or the
[CLI](../interfaces/cli.md).

