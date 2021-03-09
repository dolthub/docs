---
title: Why Dolt
---

# Why Dolt

## A Relational Database, Evolved

Existing relational databases were built in a different era of computing. Their design goal was to capture the state of the application, and serve it up in a performant way.

## Data Has Changed, Databases Have Not

These databases managed "CRUD" data; that is create, read, update and delete operations prompted by human interactions with the application. Humans consumed the data. This has changed. Now, automated pipelines feed data directly into software enabled business processes. Our data has come to look a lot more like a production dependency, but our databases do not reflect this reality.

The following are examples of applications that are often fed by data pipelines, or at the very least require input datasets:

* machine learning models used to make real time decisions
* medical research where outside sources of data are used as inputs for clinical models
* trading algorithms that are calibrated on market observations

In each case there is the possibility of _failure caused by data_.

## Version Controlled Database

Dolt is a database that includes version control features so that users can build workflows that reduce the possibility of data causing software failure while making recovery faster.

We chose SQL as Dolt's query interface because it is the most widely the most widely adopted data description and query language for tabular data, and tables are the most common abstraction for managing datasets.

Dolt adds the following version control features to a familiar SQL database:

* [data lineage](lineage.md): associate results with a Dolt commit to retrieve the exact database state used to create those results
* [time travel](time-travel.md): examine the history of a value or values directly from SQL and without the use of backups
* [collaboration](collaboration.md): combine concurrently edited schema and data of a database in a principled way

Dolt makes it easy to enable these capabilities in any data infrastructure. These features are native to the database so little application code is required.

