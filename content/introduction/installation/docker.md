---
title: Docker
---

# Docker

You can get a Dolt Docker container using our [official Docker images](https://hub.docker.com/u/dolthub).
Both images support `linux/amd64` and `linux/arm64` platforms and updated on every release of [Dolt](https://doltdb.com).
Older versions are also available, and tagged with the Dolt version they contain. The source of the Dockerfiles can be found [here](https://github.com/dolthub/dolt/tree/main/docker)

## Docker Image for Dolt CLI

[The Dolt CLI Docker image](https://hub.docker.com/r/dolthub/dolt) is useful if you need a container that already has 
the Dolt CLI installed on it. For example, this image is a good fit if you are performing data analysis and want to 
work in a containerized environment, or if you are building an application that needs to invoke Dolt from the command 
line and also needs to run in a container. 

Running this image is equivalent to running the `dolt` command. You can get the latest version with `latest` tag, 
or you can get a specific, older version by using the Dolt version you want as the image's tag (e.g. `0.50.8`).

```shell
> docker pull dolthub/dolt:latest
> docker run dolthub/dolt:latest version
dolt version 0.50.10
>
> docker pull dolthub/dolt:0.50.8
> docker run dolthub/dolt:0.50.8 version
dolt version 0.50.8
```

## Docker Image for Dolt SQL-Server

[The Dolt sql-server Docker image](https://hub.docker.com/r/dolthub/dolt-sql-server) creates a container 
with dolt installed and starts a Dolt SQL server when running the container. It is similar to MySQL's Docker image. 
Running this image without any arguments is equivalent to running `dolt sql-server --host 0.0.0.0 --port 3306` 
command locally, which is the default settings for the server in the container. The persisted host
and port allows user to connect to the server from inside the container and from the local host system through
port-mapping.

To check out supported options for `dolt sql-server`, you can run the image with `--help` flag.

```bash
> docker run dolthub/dolt-sql-server:latest --help
```

### Connect to the server in the container from the host system

To be able to connect to the server running in the container, we need to set up a port to connect to locally that
maps to the port in the container. The host is set to `0.0.0.0` for accepting connections to any available network
interface.

```bash
> docker run -p 3307:3306 dolthub/dolt-sql-server:latest
```

If we run the command above with -d or switch to a separate window we can connect with MySQL (empty password by default):

```bash
> mysql --host 0.0.0.0 -P 3307 -u root
```

### Define configuration for the server

You can either define server configuration as command line arguments, or you can use yaml configuration file.
For the command line argument definition you can simply define arguments at the end of the docker command. See [the Dolt server configuration documentation](https://docs.dolthub.com/sql-reference/server/configuration) for more details and available options. 

```bash
> docker run -p 3307:3306 dolthub/dolt-sql-server:latest -l debug --no-auto-commit
```

Or, we can mount a local directory to specific directories in the container.
The special directory for server configuration is `/etc/dolt/servercfg.d/`. You can only have one `.yaml` configuration
file in this directory. If there are multiple, the default configuration will be used. If the location of
configuration file was `/Users/jennifer/docker/server/config.yaml`, this is how to use `-v` flag which mounts
`/Users/jennifer/docker/server/` local directory to `/etc/dolt/servercfg.d/` directory in the container.

```bash
> docker run -p 3307:3306 -v /Users/jennifer/docker/server:/etc/dolt/servercfg.d dolthub/dolt-sql-server:latest
```

The Dolt configuration and data directories can be configured similarly:

- The dolt configuration directory is `/etc/dolt/doltcfg.d/`
  There should be one `.json` dolt configuration file. It will replace the global dolt configuration file in the
  container.

- We set the location of where data to be stored to default location at `/var/lib/dolt/` in the container.
  The data directory does not need to be defined in server configuration for container, but to store the data
  on the host system, it can also be mounted to this default location.

```shell
> docker run -p 3307:3306 -v /Users/jennifer/docker/databases:/var/lib/dolt dolthub/dolt-sql-server:latest
```

There will be directory called `/docker-entrypoint-initdb.d` inside the container, and all appropriate files including
`.sh` or `.sql` files. They will be run after server has started. This is useful for such as setting up your 
database with importing data by providing SQL dump file.

### Let's look at an example

Here is how I set up my directories to be mounted. I have three directories to mount in a directory called `shared`, 
- `databases` is empty and is used for storing my data,
- `dolt` has a single `.json` file that stores my dolt configuration
- `server` has a single `.yaml` file that stores my server configuration

```bash
shared > ls
databases	dolt		server
shared > docker run -p 3307:3306 -v $PWD/server:/etc/dolt/servercfg.d -v $PWD/dolt:/etc/dolt/doltcfg.d -v $PWD/databases:/var/lib/dolt dolthub/dolt-sql-server:latest 
2022-10-27 18:07:51+00:00 [Note] [Entrypoint]: Entrypoint script for Dolt Server 0.50.10 starting.
2022-10-27 18:07:51+00:00 [Note] [Entrypoint]: Checking for config provided in /etc/dolt/doltcfg.d
2022-10-27 18:07:51+00:00 [Note] [Entrypoint]: /etc/dolt/doltcfg.d/config.json file is found
2022-10-27 18:07:51+00:00 [Note] [Entrypoint]: Checking for config provided in /etc/dolt/servercfg.d
2022-10-27 18:07:51+00:00 [Note] [Entrypoint]: /etc/dolt/servercfg.d/config.yaml file is found


2022-10-27 18:07:51+00:00 [Warn] [Entrypoint]: /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*
2022-10-27 18:07:51+00:00 [Note] [Entrypoint]: Dolt Server 0.50.10 is started.
Starting server with Config HP="0.0.0.0:3306"|T="28800000"|R="false"|L="debug"

```

We can see both config files were used successfully.

We can verify that we have the data we create through the server in our local directory we mounted.

```bash
> mysql --host 0.0.0.0 -P 3307 -uroot
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 1
Server version: 5.7.9-Vitess 

Copyright (c) 2000, 2022, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> create database doltdb;
Query OK, 1 row affected (0.08 sec)

mysql> use doltdb;
Database changed
mysql> create table mytable(pk int primary key, col1 varchar(20));
Query OK, 0 rows affected (0.02 sec)

mysql> insert into mytable values (1, 'first row'),(2, 'second row');
Query OK, 2 row affected (0.02 sec)

mysql> exit
```

We can check for directory `doltdb` created in our local `/shared/databases` directory. 

```bash
shared > cd databases && ls
doltdb
databases > cd doltdb && dolt sql -q "SELECT * FROM mytable"
+----+------------+
| pk | col1       |
+----+------------+
| 1  | first row  |
| 2  | second row |
+----+------------+

```

You can verify it has the data we created by using Dolt CLI Docker image if you do not have Dolt installed locally.

```bash
shared > cd databases && ls
doltdb
databases > docker run -v $PWD/doltdb:/doltdb dolthub/dolt:latest sql -q "USE doltdb; SELECT * FROM mytable;"
Database changed
+----+------------+
| pk | col1       |
+----+------------+
| 1  | first row  |
| 2  | second row |
+----+------------+

```
