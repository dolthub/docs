---
title: Use Cases
---

We built Dolt as a better way to [share data](./use-cases/data-sharing.md). Along the way, customers wanted an OLTP SQL database with Git features, so that is what Dolt became. Dolt is still a great way to share data but it's also [a great SQL database](https://www.dolthub.com/blog/2023-05-05-dolt-1-dot-0/). 

Anything you can build with MySQL or Postgres you can build with Dolt. 

Dolt really shines when your database can benefit from [branches](../concepts/dolt/git/branch.md), [merges](../concepts/dolt/git/merge.md), [diffs](../concepts/dolt/git/diff.md), or [clones](../concepts/dolt/git/remotes.md). We've written about customers who use Dolt to [build better cancer cell simulations](https://www.dolthub.com/blog/2022-08-17-dolt-turbine/), [power an application with branches](https://www.dolthub.com/blog/2021-11-19-dolt-nautobot/), or [add a versioning layer to important spreadsheets](https://www.dolthub.com/blog/2021-10-01-dolt-aktify/). These are just the customers who allowed us to write about their use case.

Other customers use Dolt to [manage video game configuration](./use-cases/configuration-management.md), [get an immutable audit log of changes to their database](./use-cases/audit.md), [build reproducibility into machine learning models](./use-cases/data-and-model-quality.md), [ensure data quality using a pull request workflow](./use-cases/manual-data-curation.md), and much more. 

Eventually, we think people will realize that all SQL databases should be version controlled to prevent data loss and make development easier, much the same way we think all code should be version controlled. Dolt compares favorably  on [performance](../reference/sql/benchmarks/latency.md) and [correctness](../reference/sql/benchmarks/correctness.md), as we signalled with [Dolt 1.0](https://www.dolthub.com/blog/2023-05-05-dolt-1-dot-0/).

Until every database is version controlled, we can dive deep into the following use cases.

1. [Data Sharing](introduction/use-cases/data-sharing.md)
2. [Data and Model Quality Control](introduction/use-cases/better-data-and-models.md)
3. [Manual Data Curation](introduction/use-cases/manual-data-curation.md)
4. [Version Control for your Application](introduction/use-cases/vc-your-app.md)
5. [Versioned MySQL Replica](introduction/use-cases/versioned-replica.md)
6. [Audit](introduction/use-cases/audit.md) 
7. [Configuration Management](introduction/use-cases/configuration-management.md)
8. [Offline First](introduction/use-cases/offline-first.md)