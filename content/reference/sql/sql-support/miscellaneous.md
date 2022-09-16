---
title: Miscellaneous
---

# Miscellaneous

## Misc features

| Component                         | Supported  | Notes and limitations                                                                                           |
| :-------------------------------- |:-----------|:----------------------------------------------------------------------------------------------------------------|
| Information schema                | ✅          |                                                                                                                 |
| Views                             | ✅          |                                                                                                                 |
| Window functions                  | 🟠         | Some functions not supported, see [window function docs](./expressions-functions-operators.md#window-functions) |
| Common table expressions \(CTEs\) | ✅          |                                                                                                                 |
| Stored procedures                 | 🟠         | Not all statements supported, see [compound statements](./supported-statements.md#compound-statements)          |
| Cursors                           | ❌          |                                                                                                                 |
| Triggers                          | ✅          |                                                                                                                 |

## Collations and character sets

Dolt supports a subset of the character sets and collations that MySQL supports.
Notably, the default character set is `utf8mb4`, while the default collation is `utf8mb4_0900_bin` (a case-sensitive collation).
This default was chosen as it has the fastest implementation, and also from a legacy perspective, as before proper collation support was added, it was the only real collation that we supported.
This differs from a standard MySQL instance, which defaults to `utf8mb4_0900_ai_ci` (a case-insensitive collation).
Character sets and collations are added upon request, so please [file an issue](https://github.com/dolthub/dolt/issues) if a character set or collation that you need is missing.
