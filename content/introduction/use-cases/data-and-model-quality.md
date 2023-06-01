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

# Dolt fixes this by…

Traditional databases were built for a world of transactions and reports. Modern data science tools use data to create models that look more like software than reports. The version control tools we use to build software apply to modern data science. Version control for data did not exist until Dolt, the first and only database you can branch, diff, and merge just like a Git repository.

The simplest application of Dolt is to use tags for model reproducibility. If you build a model from a version of the data, make a tag at that commit and refer to that tag in the model metadata. Some of our data and model quality control customers only use Dolt for this simple feature. Dolt shares storage between versions so you can store many more copies of the data using Dolt than say storing copies of the data in S3. 

Human or automated review on data changes.

Branches for long running data projects.

Commits, logs, and diffs for model insights.

# Companies Doing This

[Turbine](https://turbine.ai/), [KAPSARC](https://www.kapsarc.org/), [Flock Safety](https://www.flocksafety.com/), [Tome](https://www.tome.com/), [Bosch](https://www.bosch-home.com/), [IMTF](https://imtf.com/)

# Case Studies

[Turbine](https://www.dolthub.com/blog/2022-08-17-dolt-turbine/)

