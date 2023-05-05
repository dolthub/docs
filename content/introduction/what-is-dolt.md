---
title: What is Dolt?
---

# What is Dolt?

![](../.gitbook/assets/dolt-logo.png)

Dolt is a SQL database you can fork, clone, branch, merge, push and pull just like a Git repository. Connect to Dolt just like any MySQL database to run SQL queries. Use the command line interface to import CSV files, commit your changes, push them to a remote, or merge your teammate's changes.

All the commands you know from Git work exactly the same in Dolt. Git versions files, Dolt versions tables. It's like Git and MySQL had a baby.

Dolt is a [version controlled database](https://www.dolthub.com/blog/2021-09-17-database-version-control/). Dolt is [Git for Data](https://www.dolthub.com/blog/2020-03-06-so-you-want-git-for-data/). Dolt is a [Versioned MySQL Replica](https://www.dolthub.com/blog/2023-02-17-binlog-replication-preview/).

{% embed url="https://youtu.be/3F6LwZt6e-A" %}

## Version Controlled Database

Dolt is a [version controlled SQL database](https://www.dolthub.com/blog/2021-09-17-database-version-control/). Connect to Dolt just like any MySQL database to run SQL queries. Use Dolt [system tables](../reference/sql/version-control/dolt-system-tables.md), [functions](../reference/sql/version-control/dolt-sql-functions.md), or [procedures](../reference/sql/version-control/dolt-sql-procedures.md) to access version control information and features. 

## Git for Data

Dolt is [Git for data](https://www.dolthub.com/blog/2020-03-06-so-you-want-git-for-data/). [Dolt matches the Git CLI exactly](../reference/cli.md). When you would have run `git add`, you run `dolt add`. When you would have run `git commit`, you run `dolt commit`.

## Versioned MySQL Replica

Dolt can be deployed as a [Versioned MySQL Replica](https://www.dolthub.com/blog/2023-03-15-getting-started-versioned-mysql-replica/). Because Dolt is MySQL compatible, Dolt can be configured just like any other MySQL replica. A Dolt replica gives you features of a [version controlled database](https://www.dolthub.com/blog/2021-09-17-database-version-control/) without migrating from MySQL.

##

![](../.gitbook/assets/hosted-logo.png)

[Hosted Dolt](https://hosted.doltdb.com) is a cloud-deployed Dolt database. Choose the type of server and disk you need and we'll provision the resources and run Dolt for you. Connect with any MySQL client. Hosted Dolt is perfect for teams who want to build a Dolt-powered application. 

##

![](../.gitbook/assets/dolthub-logo.png)

We also built [DoltHub](https://www.dolthub.com), a place to share Dolt databases. We host public data for free! DoltHub adds a modern, secure, always on database management web GUI to the Dolt ecosystem. Edit your database on the web, have another person review it via a pull request, and have the production database pull it to deploy.

##

![](../.gitbook/assets/doltlab-logo.png)

Not ready to put your databases on the internet, no matter the permissions? We have a self-hosted version of DoltHub we call [DoltLab](https://www.doltlab.com). DoltLab gives you all the features of DoltHub, wherever you want them, in your own network or on your development machine.
