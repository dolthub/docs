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

Dolt was built for sharing. The Git model of code sharing has scaled to thousands of contributors for open source software. We believe the same model can work for data sharing. 

[Dolt](https://www.doltdb.com) is the world's first version controlled SQL database. Git-style version control allows for decentralized, asynchronous collaboration. Every person gets their own copy of the database to read and write.[DoltHub](https://www.dolthub.com) allows you to coordinate collaboration over the internet with permissions, human review, forks and all the other distributed collaboration tools you are used to from GitHub.

Dolt and DoltHub is the best way to share data with customers. Use versions to satisfy both slow and fast upgrading consumers. Let your customers help make your data better. Versions offer better debugging information. Version X works but version Y doesn't. Your customers can even make changes and submit data patches for your review, much like open source.

Dolt and DoltHub are also great if vendors share data with you. When you receive data from a vendor, import the data into Dolt. Examine the diff, either with the human eye or programmatically, before putting the data into production. You can now build integration tests for vendor data. If there's a problem, never merge the import branch into main or roll the change back if a bug was discovered in production. Use the problematic diff to debug with your vendor. The same tools you have for software dependencies, you now have for data dependencies.

# Companies Doing This

[Bitfinex](https://www.bitfinex.com/), [KAPSARC](https://www.kapsarc.org/)

# Case Studies

Let us know if you would like us to feature your use of Dolt for data sharing here.


