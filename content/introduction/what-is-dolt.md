---
title: What is Dolt?
---

# What is Dolt?

![](../.gitbook/assets/dolt-logo.png)

Dolt is the first and only SQL database that you can fork, clone, branch, merge, push and pull just like a Git repository. Dolt is a [version controlled database](https://www.dolthub.com/blog/2021-09-17-database-version-control/). Dolt is [Git for Data](https://www.dolthub.com/blog/2020-03-06-so-you-want-git-for-data/).

Dolt implements the Git command line and associated operations on table rows instead of files. Data and schema are modified in the working set using SQL. When you want to permanently store a version of the working set, you make a commit. In SQL, dolt implements Git read operations (ie. diff, log) as system tables and write operations (ie. commit, merge) as stored procedures. Dolt produces cell-wise diffs and merges, making data debugging between versions tractable. Dolt is the only SQL database that has branches and merges. 

You can run Dolt online, like you would PostgreSQL or MySQL. Or you can run Dolt offline, treating data and schema like source code. 

## Version Controlled Database

Dolt is a [version controlled SQL database](https://www.dolthub.com/blog/2021-09-17-database-version-control/). Connect to Dolt just like any MySQL database to run queries. Use Dolt system tables, functions, or stored procedures to access version control information and features. 

## Git for Data

Dolt is [Git for data](https://www.dolthub.com/blog/2020-03-06-so-you-want-git-for-data/). Use the command line interface to import CSV files, commit your changes, push them to a remote, or merge your teammate's changes.

## Versioned MySQL Replica

Dolt can be deployed as a [Versioned MySQL Replica](https://www.dolthub.com/blog/2023-02-17-binlog-replication-preview/). Because Dolt is MySQL compatible, Dolt can be configured just like any other MySQL replica. This allows you to get most of the features of a [version controlled database](https://www.dolthub.com/blog/2021-09-17-database-version-control/) without migrating from MySQL.

##

![](../.gitbook/assets/dolthub-logo.png)

We also built [DoltHub](https://www.dolthub.com), a place to share Dolt databases. We host public data for free! DoltHub adds a modern, secure, always on database management web GUI to the Dolt ecosystem. Edit your database on the web, have another person review it via a pull request, and have the production database pull it to deploy.

##

![](../.gitbook/assets/doltlab-logo.png)

Not ready to put your databases on the internet, no matter the permissions? We have a self-hosted version of DoltHub we call [DoltLab](https://www.doltlab.com). DoltLab gives you all the features of DoltHub, wherever you want them, in your own network or on your development machine.

##

![](../.gitbook/assets/hosted-logo.png)

[Hosted Dolt](https://hosted.doltdb.com) is a cloud-deployed Dolt database. Choose the type of server and disk you need and we'll provision the resources and run Dolt for you. Connect with any MySQL client. Hosted Dolt is perfect for teams who want to build a Dolt-powered application. 
