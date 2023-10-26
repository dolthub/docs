---
title: "Cli Commands"
---

We aim to match our CLI command behavior as closely to their Git equivalent as possible. This page lists the commands that are currently supported, and any known limitations.

# Cli Commands

## Setup and Config

| Component | Supported  | Notes and limitations |
|:----------|:-----------|:----------------------|
| `config`  | ✅          |                       |

## Getting and Creating Databases

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

| Component  | Supported | Notes and limitations |
|:-----------|:----------|:----------------------|
| `branch`   | ✅         |                       |
| `checkout` | ✅         |                       |
| `merge`    | ✅         |                       |
| `log`      | ✅         |                       |
| `stash`    | ✅         |                       |
| `tag`      | ✅         |                       |
| `worktree` | ❌         |                       |

## Sharing and Updating Databases

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

## Patching

| Component     | Supported | Notes and limitations |
|:--------------|:----------|:----------------------|
| `cherry-pick` | ✅         |                       |
| `rebase`      | ❌         |                       |
| `revert`      | ✅         |                       |

## Debugging

| Component | Supported | Notes and limitations |
|:----------|:----------|:----------------------|
| `bisect`  | ❌         |                       |
| `blame`   | ✅         |                       |

## Administration

| Component       | Supported | Notes and limitations                                                                 |
|:----------------|:----------|:--------------------------------------------------------------------------------------|
| `clean`         | 🟠        | [does not completely match git behavior](https://github.com/dolthub/dolt/issues/6313) |
| `gc`            | ✅         |                                                                                       |
| `fsck`          | ❌         |                                                                                       |
| `reflog`        | ❌         |                                                                                       |
| `filter-branch` | ✅         |                                                                                       |

## Plumbing Commands

| Component      | Supported | Notes and limitations |
|:---------------|:----------|:----------------------|
| `check-ignore` | ❌         |                       |
| `ls`           | ✅         |                       |
| `merge-base`   | ✅         |                       |
| `rev-list`     | ❌         |                       |
| `rev-parse`    | ❌         |                       |
| `name-rev`     | ❌         |                       |
| `show-ref`     | ❌         |                       |
| `update-ref`   | ❌         |                       |

If you are interested in a command that is currently unsupported, please [open an issue](https://github.com/dolthub/dolt/issues) or contact us on [discord](https://discord.gg/8qyCyRfh).
