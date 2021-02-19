---
title: Why Dolt
---

## Background
Existing relational database solutions came to market to provide a persistence layer for the multi-user applications the internet enabled.

Their design goal was to capture the state of the application, and serve it up in a performant way.

## Data Has Changed, Databases Have Not
As adoption of software enabled business processes has exploded, so to have the ways in which we use data. It is extremely common for companies to have entire teams dedicated to data engineering, the practice of maintaining pipes to ensure these software enabled business process are supplied with the data they need to function properly.

The following are examples of applications that are often fed by data pipelines, or at the very least require input datasets:
- machine learning models used to make real time decisions
- medical research where outside sources of data are used as inputs for clinical models
- trading algorithms that are calibrated on market observations

In each case there is the possibility of _failure caused by data_.

## Version Controlled Database
Dolt is a database that includes version control features so that users can build workflows that reduce the possibility of data causing software failure.

Dolt presents SQL as its query interface because SQL is the most widely adopted data description and query language for tabular data, and tables are the most common abstraction for managing datasets.

Dolt compliments this familiar interface with novel version control features that seek to provide the following capabilities:
- reproducibility: given a commit, give the exact state of the database at that state in time
- diffs: given two results, each associated with a commit, show me the exact differences
- lineage: the ability to trace back through reads and writes based on commit IDs

We built Dolt so users could easily build these capabilities into their data infrastructure without writing complex application code.

## Conclusion
Dolt is for users that want to build better data infrastructure, with data versioning built into the datastore they use to build data pipelines.
