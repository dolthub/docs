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

A branch can be thought of as a long running transaction. If you have a set of database changes that logically should be grouped together or reviewed together, you make those changes on a branch. 

In traditional SQL databases, transactions are designed to be short lived. The rows you change in a transaction are essentially locked for the duration of the transaction. Because Dolt allows for merge and more complex conflict resolution than traditional SQL databases, Dolt can essentially support long running transactions on branches. 

## Difference between Git branch and Dolt branch


## Example

Create a branch

Merge a branch