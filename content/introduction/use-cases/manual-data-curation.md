---
title: Manual Data Curation
---

# Problem

* Are you using spreadsheets to curate production data? 
* Is the process of merging and reviewing everyone’s changes getting out of hand? 
* Are bad data changes causing production issues? 
* Would human review of cell-level data changes help?

# Dolt solves this by…

Dolt allows you to treat your spreadsheet like code. DoltHub and DoltLab implement a [Pull Request workflow](../../concepts/dolthub/prs.md) on tables, the standard for human reviewing code changes. Extend that model to your data changes. Make changes on [branches](../../concepts/dolt/git/branch.md) and then have the changes human reviewed. Data diffs are easily consumed by a human reviewer. Add continuous integration tests to data changes. Have dozens or hundreds of changes in flight at one time.

DoltHub and DoltLab support [SQL](../../concepts/dolt/sql/README.md), File Upload (CSV), and a spreadsheet editor for data modification. These interfaces are simple enough that non-technical users can make and review data changes. 

Dolt is a MySQL compatible database so exporting the manually created data to production can be as simple as cloning a copy and starting a server for you developers to connect to.

# Companies Doing This

[Annalise](https://usa.annalise.ai/), [Briya](https://briya.com/), [Aktify](https://aktify.com/), [Blonk Sustainability](https://blonksustainability.nl/), [IMTF](https://imtf.com/), [Lumicks](https://lumicks.com/), [Merkle Science](https://www.merklescience.com/)

# Case Studies

[Aktify](https://www.dolthub.com/blog/2021-10-01-dolt-aktify/)

# Other Related Articles

[So you want Spreadsheet Version Control?](https://www.dolthub.com/blog/2022-07-15-so-you-want-spreadsheet-version-control/)
[Edit like a Spreadsheet V1](https://www.dolthub.com/blog/2021-10-04-edit-like-spreadsheet-v1/)


