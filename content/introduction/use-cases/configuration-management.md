---
title: Configuration Management
---

# Problem

* Is your configuration too big and complex for files? 
* Is your configuration more like code than configuration? 
* Does configuration have a large production impact? 
* Are configuration changes hard to review? 
* Are multiple configuration changes hard to merge together when it’s time to ship?
* Are you building a game with lots of assets and configuration?

# Dolt solves this by…

Configuration is generally structured and managed as large text files. YAML and JSON formatted configuration is very popular. These formats are unordered, meaning standard version control solutions like Git cannot reliably produce [diffs](../../concepts/dolt/git/diff.md) and [merges](../../concepts/dolt/git/merge.md). Moreover, configuration can get quite large, running up against the file size limits of tools like Git.

Some configuration is better modeled as [tables](../../concepts/dolt/sql/table.md). Tables by design are unordered. Tables can contain even JSON columns for parts of your configuration you want to remain loosely typed. 

Dolt is an ideal solution for version controlling tabular configuration. Dolt allows for all the version control features you came to know and love when your data was small like [branches](../../concepts/dolt/git/branch.md), [diffs](../../concepts/dolt/git/diff.md), and [human review via pull requests](../../concepts/dolthub/prs.md). 

This use case is particularly popular in video games where much of the game functionality is modeled as configuration. Store the likelihood of an item drop or the strength of a particular enemy in Dolt tables. Review and manage changes. When the configuration is ready, use a build process to create whatever format your game needs.

# Companies Doing This

* [Scorewarrior](https://scorewarrior.com/)
* [PhanXgames](https://www.phanxgames.com/)

# Case Studies

Let us know if you would like us to feature your use of Dolt for configuration management here.

# Other Related Articles

[Version control for Video Game Development using Dolt](https://www.dolthub.com/blog/?q=game)
[Your config file should be a database](https://www.dolthub.com/blog/2023-05-15-your-config-file-should-be-a-database/)
