---
title: Lineage
---

# Lineage

Dolt makes it easy to build powerful reproducible data pipelines with full featured lineage capabilities.

## Reproducibility

The first step to lineage tracking is reproducibility. When the input data for a process comes from Dolt the process can be reproduced at any time using at the exact state of the database associated with the original run. This makes data issues far easier to uncover. When the output of a process is written to Dolt it is trivial to diff outputs across runs.

These capabilities make it easier to users to test and deploy data pipelines, as well as isolate sources of changes between input data and code.

## Lineage

When reproducible processes are combined in a sequence of steps the full lineage of a result can be traced. Outputs can be updated based on whether upstream datasets have been updated without the need to implement polling or detection infrastructure.

