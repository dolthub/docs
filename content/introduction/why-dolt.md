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

By building a SQL database on top of a Git-like commit graph, where writes are grouped into commits, users can answer these questions by using Dolt.







Since then we have seen an explosion in uses of data to deliver products across a huge number of verticals. Some examples include:
- use of machine learning and artificial intelligence, where the data used to train the model is part of the model
- automated decision making based on feeds, such as financial services industry
- use of third party data feeds to calibrate targeted advertising, for example in direct to consumer e-commerce
- data sharing between academic researchers and pharmaceutical companies seeking to accelerate research

In other words data has become much more than storing user profiles and preferences.

In each case the data forms an essential ingredient to a consequential business process. For example, where a model is being used to make automate or optimize a business process, the data used to train that model is part of that version of the deployed code.

Dolt is a relational database that is built from the ground up for this world.

## Familiar
Adopting databases is hard. Adopting databases with novel query languages is harder still. Dolt's query language is the most widely adopted of all, SQL. While SQL is not the perfect query interface for a whole host of use-cases, almost _every_ organization uses it to some degree. Many popular libraries in the data science and engineering ecosystem, such as Pandas, are oriented around a tabular abstraction. Even data that is not straightforwardly tabular can often be represented in SQL.

Most data that ends up in highly optimized layouts for production systems starts life in tables. We believe tables are the fundamental abstraction that defines the data ecosystem, and SQL is the most mature and widely adopted mechanism for defining, managing, and querying tabular data structures.
