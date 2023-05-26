---
title: SQL Clients
---

# SQL Clients

Dolt ships with a built in MySQL compatible server. To start the server for your Dolt database, you run `dolt sql-server` in the repository directory. The `dolt sql-server` command starts a MySQL compatible server for the Dolt database on port 3306 with no authentication. The database name is the name of the repository directory but with dashes \(`-`\) replaced with underscores \(`_`\). So `dolt-test` repository name would become `dolt_test` database name. See [this documentation for more configuration details](../../cli.md#dolt-sql-server).

Once a server is running, any MySQL client should be able to connect to Dolt SQL Server in the exact same way it connects to a standard MySQL database. For instance, if you are running a Dolt sql-server locally, you can connect to it with the MySQL client `mysql` like so:

```
$ mysql -u root
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 5.7.9-Vitess 

Copyright (c) 2000, 2022, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

We explicitly support the programmatic clients outlined in this document through integration testing. Tests are run on GitHub pull requests to Dolt in a Ubuntu environment in a Docker container. If you would like another MySQL compatible client supported and tested, [please let us know](https://www.dolthub.com/contact).

The test code linked to below is a good way to get started connecting to a Dolt SQL server if you are not familiar how to connect to MySQL in your language of choice. The code establishes a connection, runs some simple queries, verifies the output comes back as expected, and closes the connection.

## Python

We currently support two native Python MySQL connectors, [mysql.connector](https://dev.mysql.com/doc/connector-python/en/) and [pymysql](https://pymysql.readthedocs.io/en/latest/). These are all native \(ie. do not depend on a MySQL compiled C library\) Python libraries available through `pip`.

### mysql.connector

- [Official Client documentation.](https://dev.mysql.com/doc/connector-python/en/)
- [Python mysql.connector test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/python/mysql.connector-test.py)

### pymysql

- [Official Client documentation](https://pymysql.readthedocs.io/en/latest/)
- [Python pymysql test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/python/pymysql-test.py)

### SQLAlchemy

We also support the [SQLAlchemy](https://www.sqlalchemy.org/) library. SQLAlchemy requires a connector that is specified in the connection string. Choose one of the supported connectors listed above, and then pass that to the SQLAlchemy connection string, as in the snippet taken from the connector test below:

```python
conn_string_base = "mysql+mysqlconnector://"

engine = create_engine(conn_string_base +
                       "{user}@127.0.0.1:{port}/{db}".format(user=user,
                                                             port=port,
                                                             db=db)
```

- [Offical Library documentation](https://docs.sqlalchemy.org/en/13/)
- [Python SQLAlchemy test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/python/sqlalchemy-test.py)

## Node

We support the standard `mysql` Node library.

- [Official Client documentation](https://www.npmjs.com/package/mysql)
- [Node MySQL test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/node/index.js)

## Java

We support the Java client distributed on the MySQL website called `mysql-connector-java`. For our test we use the architecture independent build.

- [Official Client Documentation](https://dev.mysql.com/doc/connector-j/8.0/en/)
- [Java mysql-connector test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/java/MySQLConnectorTest.java)

## C

We support [libmysqlclient](https://dev.mysql.com/doc/c-api/8.0/en/) distributed by MySQL. On OSX, we tested the client distributed by `brew install mysql-client`. For the Ubuntu tests, we `apt install -y libmysqlclient-dev`. We then use `pkg-config` to generate the proper `CFLAGS` and `LDFLAGS`.

- [Official Client Documentation](https://dev.mysql.com/doc/c-api/8.0/en/)
- [C libmysqlclient test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/c/mysql-connector-c-test.c)

## C++

We support `mysql-connector-cpp`. Getting it to work correctly required we checkout and build [mysql-connector-cpp](https://github.com/mysql/mysql-connector-cpp) using the proper flags and dependencies. This was a relatively heavy lift but you can use [our build logic](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/cpp/README.md) as an example.

- [Official Client Documentation](https://dev.mysql.com/doc/connector-cpp/8.0/en/)
- [C++ mysql-connector-cpp test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/cpp/mysql-connector-cpp-test.cpp)

## Dotnet

We support [MySQL.Data.MySqlClient](https://dev.mysql.com/doc/connector-net/en/) distributed by MySQL and the asynchronous [MySqlConnector](https://mysqlconnector.net/). On OSX and Ubuntu we tested the client using [.Net core SDK](https://dotnet.microsoft.com/download/dotnet-core/3.1).

### MySQL.Data.MySqlClient
- [Official Client Documentation](https://dev.mysql.com/doc/connector-net/en/)
- [MySql.Data test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/dotnet/MySqlClient/Program.cs)

### MySQLConnector
- [Official Client Documentation](https://mysqlconnector.net/)
- [MySqlConnector test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/dotnet/MySqlConnector/Program.cs)

## Perl

We support the [DBD::mysql](https://metacpan.org/pod/DBD::mysql) package that implements [DBI](https://metacpan.org/pod/DBI) for MySQL. This connector relies on [libmysqlclient](https://dev.mysql.com/doc/c-api/8.0/en/).

- [Official Client Documentation](https://metacpan.org/pod/DBD::mysql)
- [DBD:mysql test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/perl/dbd-mysql-test.pl)

## PHP
We support the built in [mysqli](https://www.php.net/manual/en/book.mysqli.php) extension and [PDO](https://www.php.net/manual/en/book.pdo.php) API for connecting to MySQL.

- [Official mysqli Client Documentation](https://www.php.net/manual/en/book.mysqli.php)
- [Official PDO Client Documentation](https://www.php.net/manual/en/book.pdo.php)
- [mysqli test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/php/mysqli_connector_test.php)
- [PDO test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/php/pdo_connector_test.php)

## Go

We support the [go-sql-driver/mysql](https://github.com/go-sql-driver/mysql) package. This is the MySQL driver for the [database/sql](https://golang.org/pkg/database/sql/) package.

- [Official Client Documentation](https://github.com/go-sql-driver/mysql)
- [go-sql-driver/mysql test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/go/go-sql-driver-mysql-test.go)

## Ruby

We support the native [ruby/mysql](http://www.tmtm.org/en/ruby/mysql/) library and the native [mysql2](https://github.com/brianmario/mysql2) library. The [mysql/ruby](http://www.tmtm.org/en/mysql/ruby/) package uses the MySQL C API and [has not been ported to MySQL client version 8](https://github.com/luislavena/mysql-gem/issues/35). Thus, we do not support `mysql/ruby`.

### mysql2
- [Official Client Documentation](https://www.rubydoc.info/gems/mysql2)
- [mysql2 test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/ruby/mysql2-test.rb)

### ruby/mysql
- [Official Client Documentation](http://www.tmtm.org/en/ruby/mysql/)
- [ruby/mysql test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/ruby/ruby-mysql-test.rb)

## R

We support the legacy [RMySQL](https://github.com/r-dbi/RMySQL) and newer [RMariaDB](https://github.com/r-dbi/RMariaDB) R clients. Both implement [DBI](https://metacpan.org/pod/DBI) and require either [libmysqlclient](https://dev.mysql.com/doc/c-api/8.0/en/) or [MariaDBConnector/C](https://downloads.mariadb.org/connector-c/).

- [RMySQL Official Client Documentation](https://github.com/r-dbi/RMySQL)
- [RMYSQL test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/r/rmysql-test.r)

- [RMariaDB Official Client Documentation](https://rmariadb.r-dbi.org)
- [RMariaDB test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/r/rmariadb-test.r)

There is also an open-source, third-party wrapper for working with Dolt, called [DoltR](https://ecohealthalliance.github.io/doltr/). This tool is well-maintained by [EcoHealth Alliance](https://www.ecohealthalliance.org/) and provides an easy way to work with local or remote Dolt databases from within R Studio.

- [Getting Started with Doltr](https://ecohealthalliance.github.io/doltr/articles/doltr.html)
- [DoltR on GitHub](https://github.com/ecohealthalliance/doltr)

## Rust

We support the [mysql crate](https://docs.rs/mysql/latest/mysql/) in Rust.

- [Official Client Documentation](https://docs.rs/mysql/latest/mysql/)
- [Rust test code](https://github.com/dolthub/dolt/blob/main/integration-tests/mysql-client-tests/rust/src/mysql_connector_test.rs)
