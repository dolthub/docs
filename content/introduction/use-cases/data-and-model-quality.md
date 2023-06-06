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

Traditional databases were built for a world of transactions and reports. Modern data science tools use data to create models that behave more like software than reports. Models produce user visible outputs and define application behavior. Tuning data to get the right model can be a lot like writing code.

The version control tools we use to build software apply to modern data science. Version control for data did not exist until Dolt, the first and only database you can [branch](../../concepts/dolt/git/branch.md), [diff](../../concepts/dolt/git/diff.md), and [merge](../../concepts/dolt/git/merge.md) just like a Git repository.

Modern data science applications require model reproducibility, data quality, and multiple versions of data to perform at their best. Dolt allows for these capabilities directly in your database, in a [Git-style version control model](../../concepts/dolt/git/README.md) most developers understand.

Dolt is used for model reproducibility. If you build a model from a version of the data, make a tag at that commit and refer to that tag in the model metadata. Some of our data and model quality control customers only use Dolt for this simple feature. Dolt shares storage between versions so you can store many more copies of the data using Dolt than say storing copies of the data in S3. 

Dolt allows for human or automated review on data changes increasing data quality. If a bad change makes it through review simply [roll the data back to a previous version](https://www.dolthub.com/blog/2022-09-23-dolt-rollback-options/). DoltHub, DoltLab, and the Hosted Dolt Workbench all implement [a Pull Request](../../concepts/dolthub/prs.md) workflow, the standard for human reviewing code changes. Extend that model to your data changes.

Dolt is the only database with [branch](../../concepts/dolt/git/branch.md) and [merge](../../concepts/dolt/git/merge.md) functionality. Branches allow for long running data projects. Want to add an additional feature to a model but don't want the new feature effecting the production model build? Make branch and run the project on that branch. Occasionally merge production data into that branch so you can stay in touch with changes there. Companies use Dolt branches to increase the number of parallel data projects by an order of magnitude.

Lastly, [commits](../../concepts/dolt/git/commits.md), [logs](../../concepts/dolt/git/log.md), and [diffs](../../concepts/dolt/git/diff.md) can be used for model insights. Did Thursday's model perform better than Tuesday's but had the same model weights? Inspect the data diff to see what changed. Inspect the commit log to see where that new data came from.

# Dolt replaces...

## Unstructured files in cloud storage

It is common practice to store copies of training data or database backups in cloud storage for model reproducibility. A full copy of the data is stored for every training run. This can become quite expensive and limit the amount of models you can reproduce. Dolt stores only the differences between stored versions decreasing the cost of data storage. Additionally, Dolt can produce diffs between versions of training data producing novel model insights.

## MySQL, Postgres, or other databases

Dolt can replace any database used to store and query data. Many of our customers switch from other OLTP databases like MySQL or Postgres to improve data and model quality through versioning. Customers have also switched to Dolt from document databases like MongoDB. Dolt's additional unique features like branches, diffs, and merges allow for human review of data changes and multiple parallel data projects.

# Companies Doing This

* [Turbine](https://turbine.ai/)
* [KAPSARC](https://www.kapsarc.org/) 
* [Flock Safety](https://www.flocksafety.com/) 
* [Tome](https://www.tome.com/) 
* [Bosch](https://www.bosch-home.com/) 
* [IMTF](https://imtf.com/)

# Case Studies

[Turbine](https://www.dolthub.com/blog/2022-08-17-dolt-turbine/)

# Other Related Articles

[Better Data with Great Expectations + Dolt](https://www.dolthub.com/blog/2021-06-15-great-expectations-plus-dolt/)
[Upleveling Flyte’s Data Lineage Using Dolt](https://www.dolthub.com/blog/2021-06-04-flyte-dolt-plugin/)
[Data Version Control and Dolt Reproducibility](https://www.dolthub.com/blog/2021-04-16-dolt-dvc/)
[Using Dolt to Manage Train/Test Splits](https://www.dolthub.com/blog/2020-05-11-dolt-manage-train-test-splits/)
[So you want Data Quality Control](https://www.dolthub.com/blog/2022-11-23-data-quality-control/)