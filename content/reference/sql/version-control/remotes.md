---
title: Using remotes
---

# What are Remotes?

Just like Git, Dolt supports syncing with a [remote database](../../../concepts/dolt/git/remotes.md). A remote is a copy of your database that is distinct from your local copy. It usually is stored on a separate host or service for fault tolerance. The primary use cases are disaster recovery and collaboration. More conceptual description of remotes can be found [here](../../../concepts/dolt/git/remotes.md).

# Configuring Remotes

Remotes are configured using the [`remote` command](../../cli.md#dolt-remote). You configure a remote with a name and a URL. When you want to use the remote, you refer to it by name. When you clone a remote, a remote named `origin` is automatically configured for you.

# Remote Actions

Sync functionality is supported via the [`clone`](../../cli.md#dolt-clone), [`fetch`](../../cli.md#dolt-fetch), [`push`](../../cli.md#dolt-push), and [`pull`](../../cli.md#dolt-pull).

## Clone

## Fetch

## Push

## Pull

# Remote Options

## DoltHub

## DoltLab

## Use your Main SQL Server

## Filesystem

## S3

## GCS

## remotesrv

## Roll Your own
