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

Probably! Have you tried it? We have [blogs and sample code](../guides/dolt-tested-apps.md)
for many popular ORMs and tools.

If you try it and it doesn't work, [let
us know with an issue](https://github.com/dolthub/dolt/issues) or in
[our Discord](https://discord.gg/s8uVgc3) and we'll [fix it in 24 hours](https://www.dolthub.com/blog/2024-05-15-24-hour-bug-fixes/). 
Our goal is to be a 100% drop-in replacement for MySQL.

Dolt generates a lot of garbage during some writes, especially during initial import. It's not
unusual to get a local storage size of 20x the actual data size after an import. Running `dolt gc`
will remove the garbage and reclaim local storage. See the [docs on `dolt
gc`](../reference/cli/cli.md#dolt-gc) and the [`dolt_gc` stored
procedure](../reference/sql/version-control/dolt-sql-procedures.md#dolt_gc) for details.

## How do I squash the history of a Dolt database? I only want the latest.

You can perform a shallow [clone](https://docs.dolthub.com/sql-reference/version-control/dolt-sql-procedures#dolt_clone) of a database by using the `--depth` flag. If you only want
the latest change, specify a depth of 1. The [CLI](https://docs.dolthub.com/sql-reference/version-control/dolt-sql-procedures#dolt_clone) also supports this:

```bash
dolt clone --depth 1 <database>
```

# Does Dolt collect client metrics? How can I disable it?

Dolt collects anonymous usage metrics and sends them over the network to DoltHub metrics servers. No
personally identifiable information is collected. You can disable this behavior by setting the
`metrics.disabled` config key:

```bash
dolt config --global --add metrics.disabled true
```

## How to silence `stats failure` logs?

Statistic warnings appear infrequently between dolt version upgrades
and do not impact the correctness of database operations.
If the error is reproducible please [report the
issue](https://github.com/dolthub/dolt/issues/new).

Statistics caches can be removed from the filesystem to silence warnings
with `dolt_stats_purge()`:

```sql
call dolt_stats_purge();
```

Version incompatibilities should not hinder the purge command, but if
manual intervention is desirable a specific database's
stats cache can be removed from the filestystem:

```bash
rm -rf .dolt/stats
```

Statistics can be recollected at any time to improve join and indexing
execution performance. See
[the stats docs](../reference/sql/sql-support/miscellaneous#stats-controller-functions)
for more details.
