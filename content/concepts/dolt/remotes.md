---
title: Remotes
---

# Remotes

## What is a remote?

A remote is the basis for all the distributed collaboration features of Dolt. A remote is a Dolt database in another location, usually on a different, network accessible host. A Dolt remote is the coordination mechanism between many local copies of Dolt. A Dolt database can have multiple remotes.

DoltHub is a hosted Dolt remote with addition discovery and management user interface.

You configure a Dolt database as a remote. Once configured, you can perform Dolt's distributed operations using that remote: clone, fetch, push, and pull. 

Clone creates a copy of remote database in your current directory. In the case of clone, the remote you cloned from is automatically configured as the `origin` remote.

Fetch gathers all the changes made to the remote since you last fetched.

Push performs a merge of your current branch and the remote branch you are pushing to. It sends all the associated changed data and schema to the remote and updates the commit log to reflect the push.

Pull performs a fetch then a merge of the remote branch to your local branch. Essentially pull merges the changes on the remote branch into your local branch.
 
## How to use remotes


## Difference between Git remotes and Dolt remotes


## Example