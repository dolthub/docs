---
title: Server
---

# Server

## What is a database server?

A database server allows multiple local or remote clients to connect to the same database. You start a database server process on a host. The database server process opens a port or socket and then clients connect with a compatible client. The database server handles authentication. 

## How to use database servers

Database servers are used to allow multiple users to access the same database over a network. Database servers are often used to back applications. In that case, the application instances are the user. 

## Difference between the MySQL database server and the Dolt database server

Dolt behaves the same way as the MySQL database server started using `mysqld`. By default, Dolt starts on the same port as MySQL, `3306`. Currently Dolt does not support the MySQL socket interface for local clients. All connections must be routed over TCP.

## Interaction with Dolt Version Control

Dolt allows users to connect to multiple branches using a connection string. All users connected to the same branch see the same branch state. 

## Example

### Start a Server

```
dolt sql-server
Starting server with Config HP="localhost:3306"|T="28800000"|R="false"|L="info"
```

### Connect a client

```
% mysql --host 127.0.0.1 --port 3306 -uroot
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
