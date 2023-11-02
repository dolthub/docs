---
title: FAQ
---

## Why is it called Dolt? Are you calling me dumb?

It's named `dolt` to pay homage to [how Linus Torvalds named
git](https://en.wikipedia.org/wiki/Git#Naming):

> Torvalds sarcastically quipped about the name git (which means
> "unpleasant person" in British English slang): "I'm an egotistical
> bastard, and I name all my projects after myself. First 'Linux',
> now 'git'."

We wanted a word meaning "idiot", starting with D for Data,
short enough to type on the command line, and
not taken in the standard command line lexicon. So,
`dolt`.

## Dolt is MySQL-compatible. I use Postgres?

We released a Postgres version of Dolt called [DoltgreSQL](https://github.com/dolthub/doltgresql). 

However, Dolt is a production-grade version controlled database today. 
[Dolt is 1.0](https://www.dolthub.com/blog/2023-05-05-dolt-1-dot-0/). 
If you are ok with using a MySQL-client, we recommend using Dolt for 
all use cases. Doltgres is experimental.

## What does `@@autocommit` do?

This is a SQL variable that you can turn on for your SQL session like so:

`SET @@autocommit = 1`

It's on by default in the MySQL shell, as well as in most clients. But
some clients (notably the Python MySQL connector) turn it off by
default.

You must commit your changes for them to persist after your session
ends, either by setting `@@autocommit` to on, or by issuing `COMMIT`
statements manually.

## What's the difference between `COMMIT` and `DOLT_COMMIT()`?

`COMMIT` is a standard SQL statement that commits a transaction. In
dolt, it just flushes any pending changes in the current SQL session
to disk, updating the working set. HEAD stays the same, but your
working set changes. This means your edits will persist after this
session ends.

`DOLT_COMMIT()` commits the current SQL transaction, then creates a
new dolt commit on the current branch. It's the same as if you run
`dolt commit` from the command line.

## I want each of my connected SQL users to get their own branch to make changes on, then merge them back into `main` when they're done making edits. How do I do that?

We are glad you asked! This is a common use case, and giving each user
their own branch is something we've spent a lot of time getting
right. For more details on how to use this pattern effectively, see
[using branches](../reference/sql/version-control/branches.md).

## Does Dolt support transactions?

Yes, it should exactly work the same as MySQL, but with fewer locks
for competing writes.

It's also possible for different sessions to connect to different
branches on the same server. See [using
branches](../reference/sql/version-control/branches.md) for details.

## What SQL features / syntax are supported?

Most of them! Check out [the docs for the full list of supported
features](../reference/sql/sql-support/supported-statements.md).

You can check out what we're working on next on our
[roadmap](./roadmap.md). Paying customers get their feature requests
bumped to the front of the line.

## Does Dolt support my favorite SQL workbench / tool?

Probably! Have you tried it? If you try it and it doesn't work, [let
us know with an issue](https://github.com/dolthub/dolt/issues) or in
[our Discord](https://discord.gg/s8uVgc3) and we'll see what
we can do. A lot of times we can fix small compatibility issues really
quick, like the same week. And even if we can't, we want to know about
it! Our goal is to be a 100% drop-in replacement for MySQL.

## How does Dolt Docs work? What happened to my `README.md` and `LICENSE.md`?

Previously, Dolt automatically synced doc files from the file system to the
`dolt_docs` table. This process is now manual and performed with the `dolt docs`
CLI command. `dolt docs upload [doc name] [file name]` reads a file into the
`dolt_docs` table with the given name. `dolt docs print [doc name]` prints a
doc with the given name to stdout.

## How do I squash the history of a Dolt database? I only want the latest.

Dolt has a command called [read-tables](../reference/cli/cli.md#dolt-read-tables) 
that reads the tables at a remote, commit pair and creates a new Dolt database 
without any history. This new database is often much smaller than the database 
it was created from. Note, this new database cannot be merged with the database 
it was created from. It is a new thing.

Note, a remote can be local to your filesystem using 
[filesystem remotes](../reference/sql/version-control/remotes.md#filesystem). 

You can also [`dolt dump`](../reference/cli/cli.md#dolt-dump) the database and import 
the dump to a new database using [`dolt sql`](../reference/cli/cli.md#dolt-sql).
