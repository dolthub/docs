---
title: "Hosted Dolt: Notable Features"
---

# Version control

[Dolt](https://doltdb.com) is a database like no other. There are numerous Dolt version
control features that you won't find elsewhere. Hosted Dolt gives you all the version
control features of a running Dolt server without the hassle of running it yourself. For
example:

- Create branches of your data.
- Merge changes you make with changes made by other people, and resolve conflicts using SQL.
- Look at the state of the data a given commit.
- Diff data between two commits or branches.
- Revert the changes made by a commit.

# Operations

## Logs

View and download logs from the deployment console. If using replication, access logs for
each server.

![Deployment Logs]()

## Monitoring

Monitor your instance from the deployment console. List some available graphs. If using
replication, access graphs for each server.

![Deployment Graphs]()

## Custom configuration

View and edit Dolt configuration.

![Deployment Configuration]()

## Replication

Add replicas. View logs and graphs for each server. More to come.

## Backups

Databases are backed up nightly and backups are kept for 14 days. You are able to create a new deployment using any backup.

![Deployment Backups]()

## Dolt upgrades and service windows

Manually update Dolt from the Actions dropdown. Set your own service window and we'll
update your software automatically when it's most convenient for you and your users.

## Enterprise Support

Dolt team is monitoring your instance 24/7. File tickets from the deployment console.

![Support ticket]()

## Access management

Talk about deployment collaborator roles and organization roles/teams.

# Quick Start

## Trial instance

$50/month trial instance to try it out.

## Connect from anywhere using any MySQL client

# SQL Workbench

## User Friendly Build-In Web GUI

Each deployment comes with a built-in SQL workbench. Includes read-only mode or allow
writes too. Learn how to use it [here](./sql-workbench.md).

![SQL workbench]()

## Pull Requests

## Commit Log

## ORM Diagrams

# Dolt Ecosystem

## Clone a Hosted Instance

Clone your Hosted database. Includes fetch and pull. Push coming soon. Learn more
[here](./cloning.md).

## Use DoltHub as a Remote

Use [DoltHub](https://www.dolthub.com) as a remote for Hosted. Add Dolt credentials to
your Hosted instance to clone private databases from DoltHub and push to databases you
have write permissions to. View our guide [here](./dolthub-as-remote.md).
