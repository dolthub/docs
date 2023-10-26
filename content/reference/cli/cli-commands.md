---
title: "Cli Commands"
---

# Cli Commands

## Setup and Config

| Component | Supported  | Notes and limitations                   |
|:----------|:-----------|:----------------------------------------|
| `config`  | ✅          | planned support for `dolt config alias` |

## Getting and Creating Projects

| Component | Supported  | Notes and limitations |
|:----------|:-----------|:----------------------|
| `init`    | ✅          |                       |
| `clone`   | ✅          |                       |

## Basic Snapshotting

| Component | Supported | Notes and limitations |
|:----------|:----------|:----------------------|
| `add`     | ✅         |                       |
| `status`  | ✅         |                       |
| `commit`  | ✅         |                       |
| `notes`   | ❌         |                       |
| `restore` | ❌         |                       |
| `reset`   | ✅         |                       |
| `rm`      | ✅         |                       |

## Branching and Merging

| Component  | Supported | Notes and limitations                                       |
|:-----------|:----------|:------------------------------------------------------------|
| `branch`   | ✅         |                                                             |
| `checkout` | ✅         |                                                             |
| `merge`    | ✅         |                                                             |
| `log`      | 🟠        | planned support for `dolt log --all` and `dolt log --graph` |
| `stash`    | ❌         |                                                             |
| `tag`      | ✅         |                                                             |
| `worktree` | ❌         |                                                             |

## Sharing and Updating Projects

| Component | Supported | Notes and limitations |
|:----------|:----------|:----------------------|
| `fetch`   | ✅         |                       |
| `pull`    | ✅         |                       |
| `push`    | ✅         |                       |
| `remote`  | ✅         |                       |

## Inspection and Comparison

| Component    | Supported | Notes and limitations                               |
|:-------------|:----------|:----------------------------------------------------|
| `show`       | 🟠        | not supported for merge commits or internal objects |
| `diff`       | ✅         |                                                     |
| `range-diff` | ❌         |                                                     |
| `shortlog`   | ❌         |                                                     |
| `describe`   | ❌         |                                                     |

## Patching

| Component     | Supported | Notes and limitations |
|:--------------|:----------|:----------------------|
| `cherry-pick` | ✅         |                       |
| `rebase`      | ❌         |                       |
| `revert`      | ✅         |                       |

## Debugging

| Component | Supported | Notes and limitations |
|:----------|:----------|:----------------------|
| `bisect`  | ❌         | support is planned    |
| `blame`   | ✅         |                       |

## Administration

| Component       | Supported | Notes and limitations                  |
|:----------------|:----------|:---------------------------------------|
| `clean`         | 🟠        | does not completely match git behavior |
| `gc`            | ✅         |                                        |
| `fsck`          | ❌         |                                        |
| `reflog`        | ❌         | support is planned                     |
| `filter-branch` | ✅         |                                        |

## Plumbing Commands

| Component      | Supported | Notes and limitations |
|:---------------|:----------|:----------------------|
| `check-ignore` | ❌         |                       |
| `ls`           | ✅         |                       |
| `merge-base`   | ✅         |                       |
| `rev-list`     | ❌         |                       |
| `rev-parse`    | ❌         |                       |
| `name-rev`     | ❌         | support is planned    |
| `show-ref`     | ❌         |                       |
| `update-ref`   | ❌         |                       |
