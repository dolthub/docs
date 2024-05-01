---
title: Server
---

# Server

## What is a database server?

A database server allows multiple local or remote clients to connect to the same database. You start
a database server process on a host. The database server process opens a port or socket and then
clients connect with a compatible client. The database server handles authentication.

## How to use database servers

Database servers are used to allow multiple users to access the same database over a
network. Database servers are often used to back applications. In that case, the application
instances are the user.

## Difference between the Postgres database server and the Doltgres database server

Doltgres behaves the same way as the Postgres database server started using `postgres`. By default,
Doltgres starts on the same port as Postgres, `5432`.

## Interaction with Doltgres Version Control

Doltgres allows users to connect to multiple branches using a connection string. All users connected
to the same branch see the same branch state.

## Example

### Start a Server

```bash
doltgres
Starting server with Config HP="localhost:3306"|T="28800000"|R="false"|L="info"
```

### Connect a client

```bash
PGPASSWORD=password psql -h 127.0.0.1 -U doltgres
```
