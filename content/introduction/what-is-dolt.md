---
title: What is Dolt
---

## Version Controlled Database
Dolt is a version controlled relational database. Dolt implements a superset of MySQL. It is compatible with MySQL, and provides extra constructs exposing version control features. The version control features are closely modeled on Git.

### Offline
When Dolt is "offline", it looks very much like Git. Let's use `dolt clone` to acquire a database:
```
$ dolt clone dolthub/ip-to-country
cloning https://doltremoteapi.dolthub.com/dolthub/ip-to-country
32,832 of 32,832 chunks complete. 0 chunks being downloaded currently.
```

We now have acquired a database, and we can move into the newly created directory to give `dolt` the right database context:
```
$ cd ip-to-country
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
```

### Online
In the previous section we used Dolt's version control features, familiar from Git, to clone a remote database. In [Why Dolt](why-dolt.md) we identified the value of a familiar SQL query interface, served over a widely adopted wire protocol, MySQL.

We can now take the cloned Dolt database "online" by firing up the Dolt SQL Server:
```
dolt sql-server
Starting server with Config HP="localhost:3306"|U="root"|P=""|T="28800000"|R="false"|L="info"
```

We now have a running Dolt SQL Server that presents a superset of the MySQL dialect as its query interface. We can connect using using the standard MySQL connector:
```
~|>>  mysql --host=127.0.0.1 --user=root
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 1
Server version: 5.7.9-Vitess

Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

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

We used Git-like "offline" features to clone a database, and then stood up a server, and connected to it to start performing "online" operations. Let's see how to access Git-like version control features in SQL.

## Everything in SQL
Where possible Dolt's version control features are exposed in SQL. That means users can script complex version control workflows into the SQL queries that define data pipelines.

Let's dive into a couple of examples to see what this looks like in practice.

### AS OF
Suppose the IP to country mapping dataset that we procured earlier introduces a bug into our systems that observed at `2020-12-12 02:00:00`. We can can grab the commit that introduced this state easily:
```
mysql> select commit_hash, committer, message from dolt_log where `date` < '2020-12-10 18:00:00' limit 1;
+----------------------------------+------------------------+----------------------------------------------------------+
| commit_hash                      | committer              | message                                                  |
+----------------------------------+------------------------+----------------------------------------------------------+
| bqtrbbrsgie7u4fsgph0t12j94ofefml | LiquidataSystemAccount | Update IP to Country for date 2020-12-11 01:29:53.647746 |
+----------------------------------+------------------------+----------------------------------------------------------+
```

Suppose we want to see the new data introduced in that commit:
```
mysql> select * from dolt_diff_IPv4ToCountry where to_commit = 'bqtrbbrsgie7u4fsgph0t12j94ofefml' and diff_type = 'added';
+-----------------------+-------------+-----------------+---------------------+------------+------------+-----------------------+----------------------------------+-----------------------------------+-------------------------+---------------+-------------------+--------------+-----------+-------------+-------------------------+----------------------------------+-----------------------------------+-----------+
| to_CountryCode2Letter | to_Registry | to_AssignedDate | to_Country          | to_IpTo    | to_IPFrom  | to_CountryCode3Letter | to_commit                        | to_commit_date                    | from_CountryCode2Letter | from_Registry | from_AssignedDate | from_Country | from_IpTo | from_IPFrom | from_CountryCode3Letter | from_commit                      | from_commit_date                  | diff_type |
+-----------------------+-------------+-----------------+---------------------+------------+------------+-----------------------+----------------------------------+-----------------------------------+-------------------------+---------------+-------------------+--------------+-----------+-------------+-------------------------+----------------------------------+-----------------------------------+-----------+
| FI                    | ripencc     | 1607385600      | Finland             | 1542419967 | 1542419712 | FIN                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| DK                    | ripencc     | 1197936000      | Denmark             | 1559351295 | 1559347200 | DNK                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| SE                    | ripencc     | 1197936000      | Sweden              | 1559353343 | 1559351296 | SWE                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| DK                    | ripencc     | 1197936000      | Denmark             | 1559355391 | 1559353344 | DNK                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| IN                    | apnic       | 1607472000      | India               | 1738531839 | 1738531328 | IND                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| ID                    | apnic       | 1607472000      | Indonesia           | 1738532351 | 1738531840 | IDN                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| ID                    | apnic       | 1607472000      | Indonesia           | 1738532863 | 1738532352 | IDN                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| ID                    | apnic       | 1607472000      | Indonesia           | 1738533375 | 1738532864 | IDN                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| ID                    | apnic       | 1607472000      | Indonesia           | 1738533887 | 1738533376 | IDN                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| AU                    | apnic       | 1607472000      | Australia           | 1738534399 | 1738533888 | AUS                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| IN                    | apnic       | 1607472000      | India               | 1738534655 | 1738534400 | IND                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| IN                    | apnic       | 1607472000      | India               | 1738534911 | 1738534656 | IND                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| IN                    | apnic       | 1607472000      | India               | 1738535423 | 1738534912 | IND                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| IN                    | apnic       | 1607472000      | India               | 1738535935 | 1738535424 | IND                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| IN                    | apnic       | 1607472000      | India               | 1738536447 | 1738535936 | IND                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| IN                    | apnic       | 1607472000      | India               | 1738536959 | 1738536448 | IND                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| IN                    | apnic       | 1607472000      | India               | 1738537471 | 1738536960 | IND                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| IN                    | apnic       | 1607472000      | India               | 1738537983 | 1738537472 | IND                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| IN                    | apnic       | 1607472000      | India               | 1738538239 | 1738537984 | IND                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| US                    | ripencc     | 679190400       | United States       | 2471215103 | 2471211008 | USA                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| US                    | ripencc     | 679190400       | United States       | 2471219199 | 2471215104 | USA                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| IL                    | ripencc     | 679190400       | Israel              | 2471223295 | 2471219200 | ISR                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| US                    | ripencc     | 679190400       | United States       | 2471227391 | 2471223296 | USA                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| US                    | ripencc     | 679190400       | United States       | 2471231487 | 2471227392 | USA                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| US                    | arin        | 1607385600      | United States       | 2501050879 | 2501050368 | USA                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| US                    | arin        | 738892800       | United States       | 2501051391 | 2501050880 | USA                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| SE                    | ripencc     | 1265760000      | Sweden              | 2991067135 | 2991063040 | SWE                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| DK                    | ripencc     | 1265760000      | Denmark             | 2991069183 | 2991067136 | DNK                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| SE                    | ripencc     | 1265760000      | Sweden              | 2991071231 | 2991069184 | SWE                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| MD                    | ripencc     | 1607385600      | Moldova Republic of | 3248704255 | 3248704000 | MDA                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| RU                    | ripencc     | 1533168000      | Russian Federation  | 3262246399 | 3262245888 | RUS                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| RU                    | ripencc     | 1533168000      | Russian Federation  | 3262246911 | 3262246400 | RUS                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| US                    | arin        | 1607385600      | United States       | 3639952639 | 3639952384 | USA                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| US                    | arin        | 939513600       | United States       | 3639952895 | 3639952640 | USA                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| US                    | arin        | 939513600       | United States       | 3639953407 | 3639952896 | USA                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| US                    | arin        | 939513600       | United States       | 3639955711 | 3639955456 | USA                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| US                    | arin        | 1607385600      | United States       | 3639955967 | 3639955712 | USA                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| US                    | arin        | 939513600       | United States       | 3639956479 | 3639955968 | USA                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| US                    | arin        | 1607385600      | United States       | 3639957503 | 3639956480 | USA                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
| US                    | arin        | 939513600       | United States       | 3639959551 | 3639957504 | USA                   | bqtrbbrsgie7u4fsgph0t12j94ofefml | 2020-12-11 01:30:36.075 +0000 UTC | NULL                    | NULL          | NULL              | NULL         | NULL      | NULL        | NULL                    | u8pnf1o0mus2d8mok0083t5lpj190j5f | 2020-12-10 01:30:29.088 +0000 UTC | added     |
+-----------------------+-------------+-----------------+---------------------+------------+------------+-----------------------+----------------------------------+-----------------------------------+-------------------------+---------------+-------------------+--------------+-----------+-------------+-------------------------+----------------------------------+-----------------------------------+-----------+
```


### Rollback
Continuing with this example, let's suppose this is causing a production issue, and we need to rollback urgently. Dolt makes that easy:
```
mysql> INSERT INTO dolt_branches (name, hash) VALUES  ('production' , 'u8pnf1o0mus2d8mok0083t5lpj190j5f');
Query OK, 1 row affected (0.21 sec)
```

The state of the Dolt SQL Serve when queried at the production branch is now set to a commit prior to the one that caused an outage, and it was achieved with a single SQL query.

### DOLT_COMMIT
Suppose that we want to write some data to Dolt and create a commit against a running Dolt SQL Server. We can use Dolt specific SQL functions that expose the Git-like version control features.:
```
msql> SELECT DOLT_COMMIT('-m', 'This is a commit', '--author', 'John Doe <johndoe@example.com>');
```

We have now committed a new state of the database, which can be queried against and checked out.

## Conclusion
Dolt is a version controlled SQL database. It implements the MySQL dialect augmented with additional features to expose Dolt's version control features. Dolt's version control features are inspired by Git, and the semantics should be familiar to Git users.
