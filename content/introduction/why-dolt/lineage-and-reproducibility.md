---
title: Lineage and Reproducibility
---

Dolt builds on top of a commit graph, and thus stores the complete state of the database at every commit. This is a powerful tool for building reproducibility and lineage capabilities into data infrastructure.

## Reproducibility
Because a set of operations against Dolt can be associated with a commit  users can retrieve the exact inputs and outputs of particular _instances_ of their programs. They can also use Dolt's diffing capabilities to compare the outputs between runs. This vastly reduces complexity in identifying the source of data errors.

## Lineage
Lineage builds on top of basic reproducibility. Since every step in a pipeline built on top of Dolt can reproduce its reads and writes, and associate them with a commit, it's easy enough for users to trace the lineage of an output.
