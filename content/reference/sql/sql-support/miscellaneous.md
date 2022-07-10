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

Dolt currently only supports a single collation and character set, the same one that Go uses: `utf8_bin` and `utf8mb4`. We will add support for more character sets and collations as required by customers. Please [file an issue](https://github.com/dolthub/dolt/issues) explaining your use case if current character set and collation support isn't sufficient.
