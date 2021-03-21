---
title: Miscellaneous
---

# Miscellaneous

## Permissions

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| Users | O | Only one user is configurable, and must be specified in the config file at startup. |
| Privileges | X | Only one user is configurable, and they have all privileges. |

## Misc features

| Component | Supported | Notes and limitations |
| :--- | :--- | :--- |
| Information schema | ✓ |  |
| Views | ✓ |  |
| Window functions | O | Only `ROW_NUMBER()` is supported currently, and other limitations apply. |
| Common table expressions \(CTEs\) | X |  |
| Stored procedures | O | Currently in alpha release |
| Cursors | X |  |
| Triggers | ✓ |  |

## Collations and character sets

Dolt currently only supports a single collation and character set, the same one that Go uses: `utf8_bin` and `utf8mb4`. We will add support for more character sets and collations as required by customers. Please [file an issue](https://github.com/dolthub/dolt/issues) explaining your use case if current character set and collation support isn't sufficient.

