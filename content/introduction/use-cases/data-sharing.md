---
title: Data Sharing
---

# Problem

* Do you share data with customers? 
* Do they ask you what changed between versions you share? 
* Do they want to actively switch versions instead of having data change out from under them? 
* Or, are customers or vendors sharing data with you? 
* Are you having trouble maintaining quality of scraped data?
* When new data is shared or scraped, do downstream systems break?
* Would you like to see exactly what changed between data versions?
* Do you want to add automated testing to data shared with you?
* Would you like to instantly rollback to the previous version if tests fail?

# Dolt solves this by…

Dolt was built for sharing. The Git model of code sharing has scaled to thousands of contributors for open source software. We believe the same model can work for data. 

Dolt is the world's first version controlled SQL database. Git-style version control allows for decentralized, asynchronous collaboration. Every person gets their own copy of the database to read and write. DoltHub allows you to coordinate collaboration over the internet with [permissions](../../concepts/dolthub/permissions.md), [human review](../../concepts/dolthub/prs.md), [forks](../../concepts/dolthub/forks.md) and all the other distributed collaboration tools you are used to from GitHub.

Dolt and DoltHub is the best way to share data with customers. Use versions to satisfy both slow and fast upgrading consumers. Let your customers help make your data better. Versions offer better debugging information. Version X works but version Y doesn't. Your customers can even make changes and submit data patches for your review, much like open source.

Dolt and DoltHub are also great if vendors share data with you. When you receive data from a vendor, import the data into Dolt. Examine the diff, either with the human eye or programmatically, before putting the data into production. You can now build integration tests for vendor data. If there's a problem, never [merge](../../concepts/dolt/git/merge.md) the import [branch](../../concepts/dolt/git/branch.md) into main or roll the change back if a bug was discovered in production. Use the problematic [diff](../../concepts/dolt/git/diff.md) to debug with your vendor. The same tools you have for software dependencies, you now have for data dependencies.

# Dolt replaces...

## Exchanging Files

Dolt replaces exchanging flat data files like CSVs via email, FTP servers, or other file transfer techniques. Dolt allows data to maintain schema on exchange including constraints, triggers, and views. This more rich format of exchange reduces transfer errors. Dolt also allows you to change the data to fit your needs and still get updates from your source. Dolt will notify you if your changes [conflict](../../concepts/dolt/git/conflicts.md) with the source.

## External APIs

Dolt is ideal for sharing data that does not have an API. But even for data with an API, Dolt is often more convenient. With Dolt, you get all the data and its history. With APIs you often have to assemble the data with multiple API calls. With APIs, the data can change out from under you, whereas with Dolt you can read a version of the data until you are ready to upgrade. DoltHub ships with a [SQL API](../../products/dolthub/dolthub-api/sql.md) so you can choose the data sharing solution that is right for your use case.

# Companies Doing This

* [Bitfinex](https://www.bitfinex.com/) 
* [KAPSARC](https://www.kapsarc.org/)

# Case Studies

Let us know if you would like us to feature your use of Dolt for data sharing here.

# Other Related Articles

[Distribute Data with Dolt, not APIs](https://www.dolthub.com/blog/2020-05-18-distribute-dolt-not-api/)
[Data Collaboration on DoltHub](https://www.dolthub.com/blog/2020-10-05-data-collaboration-on-dolthub/)
[DoltHub is the Figma of Databases](https://www.dolthub.com/blog/2021-11-08-figma-of-databases/)