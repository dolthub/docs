# Dolt in Docker

## Quickstart

Dolt can be run in Docker with a few short commands.

1. Install Dolt in your `Dockerfile` (refer below for complete [sample Dockerfiles](#samples)):
```Dockerfile
RUN curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | bash
```

2. Build a `dolt-test` image:
```bash
> docker build -t dolt-test . -f Dockerfile
```

3. Run your image as an interactive container:
```bash
> docker run --rm -ti dolt-test /bin/bash
```

4. Verify Docker is installed and exit:
```bash
[root@cf04a2e8c538 /]# dolt version
dolt version 0.24.4
[root@cf04a2e8c538 /]# exit
exit
>
```

## Dolt Run Command

Use entrypoints to set the default executable and params:
```Dockerfile
FROM centos

RUN yum install -y curl \
    && curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | bash \
    && dolt config --global --add user.name "FIRST LAST" \
    && dolt config --global --add user.email "FIRST@LAST.com"

ENTRYPOINT ["dolt"]
CMD ["--help"]
```

Used as follows:
```bash
> docker run dolt-test | head -n 5
Valid commands for dolt are
                init - Create an empty Dolt data repository.
              status - Show the working tree status.
                 add - Add table changes to the list of staged table changes.
               reset - Remove table changes from the list of staged table changes.
> docker run dolt-test version 
dolt version 0.24.4
```

A more interesting example mounts a local data directory:
```bash
> mkdir test
> docker run -v $PWD/test:/home/test -w /home/test dolt-test init
Successfully initialized dolt data repository.
> docker run -v $PWD/test:/home/test -w /home/test dolt-test sql -q "create table t1 (a bigint primary key)"
> docker run -v $PWD/test:/home/test -w /home/test dolt-test sql -q "insert into t1 values (0), (1)"
Query OK, 2 rows affected
> docker run -v $PWD/test:/home/test -w /home/test dolt-test sql -q "select * from t1"
+---+
| a |
+---+
| 0 |
| 1 |
+---+
> ls test/.dolt
config.json*     noms/            repo_state.json* temptf/          tmp/
```

## Dolt SQL-Server <a name="sql-server"></a>

A `Dockerfile` that runs Dolt in server mode by default might look like:
```Dockerfile
FROM centos

RUN yum install -y curl \
    && curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | bash \
    && dolt config --global --add user.name "FIRST LAST" \
    && dolt config --global --add user.email "FIRST@LAST.com"

EXPOSE 3306
ENTRYPOINT ["dolt"]
CMD ["sql-server", "-l", "trace", "--host", "0.0.0.0"]
```

If our current directory has a valid Dolt repo `test`:
```bash
> docker run -p 3306:3306 -v $PWD/test:/home/test -w /home/test dolt-test
Starting server with Config HP="0.0.0.0:3306"|U="root"|P=""|T="28800000"|R="false"|L="trace"
```

If we run the command above with `-d` or switch to a separate window we can connect with MySQL (empty password by default):
```bash
> mysql> --user=root --host=0.0.0.0 -t test -p
mysql> select * from t1;
+------+
| a    |
+------+
|    0 |
|    1 |
+------+
2 rows in set (0.01 sec)
```

## Docker-Compose SQL-Server
The `Dockerfile` from the [SQL-Server](#sql-server) example can be used in a `docker-compose.yml`:
```yaml
version: '3.3'
services:
  db:
    build:
      context: .
      dockerfile: Dockerfile
    restart: always
    ports:
      - '3306:3306'
    expose:
      - '3306'
    volumes:
      - ./test:/home/test
    working_dir: /home/test
volumes:
  test:
```

Up'ing the resources exposes a server on port 3306, accessed with `mysql` as shown the last example.
```bash
> docker-compose up
Starting tmp_db_1 ... done
Attaching to tmp_db_1
db_1  | Starting server with Config HP="0.0.0.0:3306"|U="root"|P=""|T="28800000"|R="false"|L="trace"
db_1  | TRACE: received query select * from t1
db_1  | DEBUG: executing query
db_1  | TRACE: returning result row [INT64(0)]
db_1  | TRACE: returning result row [INT64(1)]
```

## Sample Dockerfiles <a name="samples"></a>

Ubuntu:
```Dockerfile
FROM ubuntu

RUN apt update \
    && apt update \
    && apt install -y curl \
    && curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | bash
```

Debian:
```Dockerfile
FROM debian

RUN apt update \
    && apt update \
    && apt install -y curl \
    && curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | bash
```

CentOS:
```Dockerfile
FROM centos

RUN yum install -y curl \
    && curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | bash
```

Alpine:
```Dockerfile
FROM alpine

RUN apk add --no-cache bash curl \
    && curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | bash \
    && mkdir /lib64 && ln -s /lib/libc.musl-x86_64.so.1 /lib64/ld-linux-x86-64.so.2
```
