---
title: "Administrator Guide"
---

In DoltLab's current version, there is no Administrator (Admin) web-based UI or dashboard as it is still in development. In the meantime,
the following information can help DoltLab Admins manually perform some tasks the wish to, see below for details

docker run -it --rm --network doltlab_doltlab -v "$(pwd)"/pgdata:/dump postgres:13-bullseye /bin/bash

pg_dump --data-only --host=doltlab_doltlabdb_1 --port=5432 --superuser=dolthubadmin --username=dolthubapi > /dump/doltlab-v0.1.0-dump-data-only.bak

pg_dump --data-only --host=doltlab_doltlabdb_1 --port=5432 --superuser=dolthubadmin --username=dolthubapi > /dump/doltlab-v0.1.0-dump-data-only.sql

pg_dump: warning: there are circular foreign-key constraints among these tables:
pg_dump:   email_addresses
pg_dump:   users
pg_dump: You might not be able to restore the dump without using --disable-triggers or temporarily dropping the constraints.
pg_dump: Consider using a full dump instead of a --data-only dump to avoid this problem.
pg_dump: warning: there are circular foreign-key constraints on this table:
pg_dump:   repositories
pg_dump: You might not be able to restore the dump without using --disable-triggers or temporarily dropping the constraints.
pg_dump: Consider using a full dump instead of a --data-only dump to avoid this problem.

1. [Upgrade DoltLab Versions Without Data Loss]()
2. [View Service Logs]()
3. [Backup DoltLab Data]()

steps:

connect to the running postgres server using a docker container in the doltlab network
dump the database/data using pg_dump
stop the running doltlab servers with docker-compose stop
backup the remote data and (user uploaded data only in doltlab v0.2.0)
remove the build caches and stopped containers with docker system prune -a
remove only docker volume rm doltlab_doltlabdb-data? this is right
download the latest version of doltlab
start the latest version using the start script
connect to the running pg server of the latest doltlab version

edit the dump file and add
`SET session_replication_role = replica;`

import the data dump into that running server
psql --host=doltlab_doltlabdb_1 --port=5432 --username=dolthubadmin dolthubapi < doltlab-v0.1.0-dump-data-only.sql

then run this query
psql --host=doltlab_doltlabdb_1 --port=5432 --username=dolthubadmin dolthubapi
`update users set has_dolt = 'false';`

ensure that doltlab's running as expect with older data on latest server
