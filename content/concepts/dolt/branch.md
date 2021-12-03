---
title: Branch
---

# Branch

## What is a Branch?

A branch is a named reference that starts with a parent commit. When creating a branch you define it's parent commit and then effectively you have created a new copy of the Dolt database. Changes to the branch only effect that branch. As you commit to the branch the head of the branch changes to the new commit. 

You can merge two branches together using the merge command. This creates a commit in the graph with two parents.

You Dolt database starts with one named branch, `main`. The name is configurable.

Branches differ from tags which is a named commit that does not change.

## How to use Branches


## Difference between Git branch and Dolt branch


## Example

Create a branch

Merge a branch