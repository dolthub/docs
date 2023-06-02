---
title: Data and Model Quality Control
---

# Problem

* Are you in the business of creating data and models? 
* Do you want to institute human or automated review on data changes for data quality assurance?
* Are you worried about model reproducibility? 
* Do different people or teams want to work on slightly different versions of the data? 
* Are long running projects hard to pull off because of parallel data changes? 
* Would data branches help?
* Do you want the ability to query or roll back to a previous version of the data instantly?

# Dolt solves this by…

Traditional databases were built for a world of transactions and reports. Modern data science tools use data to create models that look more like software than reports. The version control tools we use to build software apply to modern data science. Version control for data did not exist until Dolt, the first and only database you can branch, diff, and merge just like a Git repository.

Modern data science applications require model reproducibility, data quality, and multiple related versions of data to perform at their best. Dolt allows for these capabilities directly in your database, in a version control model most developers understand.

The simplest application of Dolt is to use tags for model reproducibility. If you build a model from a version of the data, make a tag at that commit and refer to that tag in the model metadata. Some of our data and model quality control customers only use Dolt for this simple feature. Dolt shares storage between versions so you can store many more copies of the data using Dolt than say storing copies of the data in S3. 

Dolt allows for human or automated review on data changes increasing data quality. If a bad change makes it through review simply roll the data back to a previous version. DoltHub, DoltLab, and the Hosted Dolt Workbench all implement a Pull Request workflow, the standard for human reviewing code changes. Extend that model to your data changes.

Dolt is the only database with branch and merge functionality. Branches allow for long running data projects. Want to add an additional feature to a model, use production data, but you don't want the new feature effecting production model build? Make branch and run the project on that branch. Occasionally merge production data into that branch so you can stay in touch with changes there. Branches have increased the number of data projects companies using Dolt for data storage by an order of magnitude.

Lastly, commits, logs, and diffs for can be used for model insights. Did Thursday's model perform better than Tuesday's but had the same model weights? Inspect the data diff to see what changed. Inspect the commit log to see where that new data came from.

# Companies Doing This

[Turbine](https://turbine.ai/), [KAPSARC](https://www.kapsarc.org/), [Flock Safety](https://www.flocksafety.com/), [Tome](https://www.tome.com/), [Bosch](https://www.bosch-home.com/), [IMTF](https://imtf.com/)

# Case Studies

[Turbine](https://www.dolthub.com/blog/2022-08-17-dolt-turbine/)

