---
title: Versioning
---

# Versioning

Dolt uses a three digit versioning format – `major`.`minor`.`patch`. For major, minor, and patch version bumps, you can expect:
- **Patch version bumps** (e.g. `1.0.0` &#8594; `1.0.1`) – Patch version bumps will **NOT** change any interfaces; they include bug fixes, performance improvements, and additive features. You can safely pick up patch releases without having to update your application code.   
- **Minor version bumps** (e.g. `1.0.0` &#8594; `1.1.0`) – Minor version bumps signal that the release contains an interface change, such as changing the signature of a Dolt CLI command or stored procedure. Your application code may require an update to move to a minor version bump if it is using an affected interface. Affected interfaces are called out in release notes. 
- **Major version bumps** (e.g. `1.0.0` &#8594; `2.0.0`) - Major version bumps signal a significant change that requires database data to be migrated, for example, [moving to a new low-level storage format](https://www.dolthub.com/blog/2022-11-01-dolthub-migrate-button/). Major version bumps will be extremely rare.

As Dolt continues moving closer to a 1.0.0 release, you should expect some small interface changes, which will be released as minor version bumps and documented in Dolt's release notes. 