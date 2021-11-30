---
title: Backups
---

Dolt has two options for backup: remotes and backups.

## Remotes

Using remotes for backups should be suitable for some use cases. Pushing
to a remote creates an off server copy of the branch being pushed.
Frequently pushing to a remote can serve as a reasonable backup.

## Backups

Dolt also has backups, accessed with the `dolt backup` command. These backups
look more like traditional database backups. The entire state of the
database, including uncommitted changes, are copied to another location.

Refer to the [cli
documentation](https://docs.dolthub.com/interfaces/cli#dolt-backup) and
the [backups blog](https://www.dolthub.com/blog/2021-10-08-backups/) for
a more thorough introduction.