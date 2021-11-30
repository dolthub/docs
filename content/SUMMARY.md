# Table of contents

## Introduction 
* [What Is Dolt?](introduction/what-is-dolt.md)
* [Installation](introduction/installation/installation.md)
    * [Linux](introduction/installation/linux.md)
    * [Windows](introduction/installation/windows.md)
    * [Mac](introduction/installation/mac.md)
    * [Build from Source](introduction/installation/source.md)
    * [Application Server](introduction/installation/application-server.md)
    * [Docker](introduction/installation/docker.md)
* [Getting Started](introduction/getting-started/start.md)
    * [Version Controlled Database](introduction/getting-started/database.md)
    * [Git For Data](introduction/getting-started/git-for-data.md)
    * [Data Sharing on DoltHub](introduction/getting-started/data-sharing.md)
    * [Data Bounties](introduction/getting-started/data-bounties.md)

## Guides
* Dolt
    * [Why Dolt?](guides/dolt/why.md)
    * [Commits](guides/dolt/commits.md)
    * [Log](guides/dolt/log.md)
    * [Diff](guides/dolt/diff.md)
    * [Branch](guides/dolt/branches.md)
    * [Merge](guides/dolt/merge.md)
    * [Conflicts](guides/dolt/conflicts.md)
* DoltHub
    * [Why DoltHub?](guides/dolthub/why.md)
    * [Permissions](guides/dolthub/permissions.md)
    * [Pull Requests](guides/dolthub/prs.md)
    * [Issues](guides/dolthub/issues.md)
    * [Forks](guides/dolthub/forks.md)
    * [API](guides/dolthub/api.md)
* Python
    * [Getting Started](guides/python/python.md)
    * [SQL Clients](guides/python/sql-clients.md)
    * [Doltpy](guides/python/doltpy.md)

## Reference
* [SQL](reference/sql/sql.md)
    * [SQL Support](reference/sql/sql-support/support.md)
        * [Data Description](reference/sql/sql-support/data-description.md)
        * [Expressions, Functions, Operators](reference/sql/sql-support/expressions-functions-operators.md)
        * [Supported Statements](reference/sql/sql-support/supported-statements.md)
        * [Miscellaneous](reference/sql/sql-support/miscellaneous.md)
    * [Dolt SQL Functions](reference/sql/dolt-sql-functions.md)
    * [Dolt System Tables](reference/sql/dolt-system-tables.md)
    * [Dolt System Variables](reference/sql/dolt-sysvars.md)
    * [Using Branches](reference/sql/branches.md)
    * [Configuration](reference/sql/configuration.md)
    * [Backups](reference/sql/backups.md)
    * [Replication](reference/sql/replication.md)
    * [Correctness](reference/sql/correctness.md)
    * [Latency](reference/sql/latency.md)
    * [Supported Clients](reference/sql/supported-clients/supported.md)
        * [Programmatic](reference/sql/supported-clients/clients.md)
        * [SQL Editors](reference/sql/supported-clients/sql-editors.md)
        * [Spreadsheets](reference/sql/supported-clients/spreadsheets.md)
        * [Notebooks](reference/sql/supported-clients/notebooks.md)
* [CLI](reference/cli.md))

## Architecture
* [Storage Engine](architecture/storage-engine/storage.md)
    * [Noms](architecture/storage-engine/noms.md)
    * [Merkle DAG](architecture/storage-engine/merkle-dag.md)
    * [Prolly Trees](architecture/storage-engine/prolly-trees.md)
* [SQL](architecture/sql/sql.md)
    * [Go MySQL Server](architecture/sql/go-mysql-server.md)
    * [Vitess](architecture/sql/vitess.md)

## Other
* [FAQ](other/faq.md)
* [Roadmap](other/roadmap.md)