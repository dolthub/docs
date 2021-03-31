# Dolt in Docker

## Quickstart

Dolt can be used in Docker environments with a few short commands.

1. Add the Dolt intall command to your `Dockerfile` (refer below for [sample Dockerfiles](#samples)):
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
> docker run dolt-test -v ${pwd}:/home/src -w /home/src dolt init
```

A more interest example mounts a local data directory:
```bash
> mkdir test
> docker run -v $PWD/test:/home/test -w /home/test dolt-cent sql -q "create table t1 (a bigint primary key)"
> docker run -v $PWD/test:/home/test -w /home/test dolt-cent sql -q "insert into t1 values (0), (1)"
Query OK, 2 rows affected
> docker run -v $PWD/test:/home/test -w /home/test dolt-cent sql -q "select * from t1"
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
CMD ["sql-server", "-l", "trace"]
```

If our current directory is a valid Dolt repo:
TODO this one doesn't work
```bash
> docker run -p 3306:3306 -v $PWD/test:/home/test -w /home/test dolt-test
Starting server with Config HP="localhost:3306"|U="root"|P=""|T="28800000"|R="false"|L="trace"
```

If we run above with `-d` or switch to a separate window:
TODO add mysql select * from t1
```bash
> mysql --user=root --host=0.0.0.0 -t test -p
```

## Docker-Compose SQL-Server
The `Dockerfile` from [SQL-Server](#sql-server) example can be used in the same manner with a `docker-compose.yml`:
TODO get working
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
      - my-db:/var/lib/mysql
volumes:
  my-db:
```

Run with the standard:
TODO show output
```bash
> docker-compose up
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
