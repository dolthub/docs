---
title: Versioning
---

Dolt uses a three digit versioning format – `major`.`minor`.`patch`. For major, minor, and patch version bumps, you can expect:

- **Patch version bumps** (e.g. `1.0.0` &#8594; `1.0.1`) – Patch version bumps will **NOT** change any interfaces; they include bug fixes, performance improvements, and additive features. You can safely pick up patch releases without having to update your application code.
- **Minor version bumps** (e.g. `1.0.0` &#8594; `1.1.0`) – Minor version bumps signal that the release contains an interface change, such as changing the signature of a Dolt CLI command or stored procedure. Your application code may require an update to move to a minor version bump if it is using an affected interface. Affected interfaces are called out in release notes.
- **Major version bumps** (e.g. `1.0.0` &#8594; `2.0.0`) - Major version bumps signal a significant change that requires database data to be migrated, for example, [moving to a new low-level storage format](https://www.dolthub.com/blog/2022-11-01-dolthub-migrate-button/). Major version bumps will be extremely rare.

# Internal Feature Version

In addition to the external version number, Dolt also uses an internal "feature" version that is incremented when persisted data structures change in a backwards incompatible way. When you use a version of Dolt with a new feature version, once it writes data to your database, older clients with a lower feature version will no longer be able to read or write that database. You can check the feature version of your database by running `dolt version --feature` from within the database's directory.

Feature version bumps will be called out in a version's release notes and will be released as a minor version bump. We avoid feature bumps as much as possible because they can be disruptive to customers, but they are occasionally needed when an existing data structure does not provide enough forward compatibility to support a new feature.
