---
title: Access Management
---

# Access Management

Access management in Dolt is handled similarly to how it is handled in MySQL.
When Dolt is running in server mode (via [`sql-server`](../cli.md#dolt-sql-server)), it relies upon the grant tables (`mysql.user`, `mysql.db`, etc.) to control user access.
Access is determined by the privileges that a user has.
For more information on the basics of how users and privileges work and how to use them, [please read our blog post from when we announced their inclusion into Dolt](https://www.dolthub.com/blog/2022-02-16-introducing-users-and-privileges/).
This document will assume some familiarity with users and privileges.

## Enabling Users

### Server Mode Required

Privilege access checks are only enabled when running in [`sql-server`](../cli.md#dolt-sql-server) mode.
All other commands, including all permutations of [`sql`](../cli.md#dolt-sql), operate with privilege access checks disabled.
Currently, the only way to remotely interact with a dolt database is when a database is running under server mode, therefore it is the only context where it is sensible for users to exist.
As all other commands require file-level access to a database's files, any possible protection offered by other commands enabling users could easily be circumvented by directly modifying the data within the database files.

In addition to privilege checks only being enabled when running in server mode, any changes to the grant tables will only persist in server mode.
If any commands that modify the grant tables are used outside the server mode, those commands will fail, as the grant tables will not exist (they're only created when in server mode).

### CLI Argument

To enable full user support when using [`sql-server`](../cli.md#dolt-sql-server) mode, you may pass in the `--privilege-file="PATH"` argument.
`"PATH"` represents the path to the privileges file, generally named `privs.json`.

### YAML Configuration Option

To enable full user support when using [`sql-server`](../cli.md#dolt-sql-server) mode, you may add the `privilege_file: PATH` line to your [YAML config](configuration.md).
`PATH` represents the path to the privileges file, generally named `privs.json`.

### User and Password Arguments

Before the introduction of users and privileges, Dolt supported only a single user with an accompanying password.
This was done using the `--user` and `--password` arguments ([see the docs for their defaults](../cli.md#dolt-sql-server), also available using YAML configuration), whereby a server would only allow connections that supplied that singular user and password combination.
Although Dolt now supports users in a similar fashion to MySQL, we still retain the user and password arguments.
In MySQL, the default super account (generally called the root user) is created during installation and configuration.
Rather than creating a parallel with [`init`](../cli.md#dolt-init), we handle the super account creation when starting a server via the arguments.
Rather than creating this super account during [`init`](../cli.md#dolt-init), we instead handle the super account creation when starting a server via the arguments.

This leads to an interaction with the [privilege file](#privilege-file) that should be noted.
When the privilege file is specified, it will be created as an empty file if it does not exist.
As soon as any statement that modifies the grant tables (`CREATE USER`, `GRANT`, `REVOKE`, etc.) executes, the users and all privileges will save to the privilege file.
This **includes** the super account as defined by the user and password arguments, therefore it is recommended that the super account is deleted after all users are set up, or it is given a strong password.
On subsequent server starts, if the [privilege file](#privilege-file) _contains any data_, the user and password arguments are fully ignored.
This behavior was chosen so that server should always have at least one user that a client may log into, otherwise the server would be completely inaccessible.

## Editing Users

Editing users and their privileges must be done from [`sql-server`](../cli.md#dolt-sql-server) mode.
You may also directly edit the [privilege file](#privilege-file), which is detailed below.
Dolt comes with a MySQL client built-in, which is the [`sql-client`](../cli.md#dolt-sql-client) command.
In addition to allowing access to a running server, the client command also has the `--dual` flag which runs a server in the background, while the foreground automatically connects to the background server using the given port, etc.

Importantly, as described in the [previous section](#user-and-password-arguments), if a non-empty privilege file is provided, then the `--user` and `--password` arguments (also available via a [YAML configuration file](configuration.md)) _only_ function as login credentials.
Otherwise, the arguments handle both the creation of a super account **and** login credentials.

## Privilege File

The privilege file contains a JSON object, designed to be editable by anyone inclined to do so.
The structure is straightforward, although it is guaranteed to change in the future as more features are added (thus increasing the data that needs to be persisted).
Below is an example file representing the following properties (formatted for easier viewing):
- The default super account is `root`
  - May only be connected to from `localhost`
- There is a role named `test_role`
  - Has the privileges `SELECT`, `INSERT`, `UPDATE`, and `DELETE` on all databases and tables
  - Roles are the same as users except for a special boolean being set, and are locked to prevent being used for logging in
- There is a user named `test_user`
  - Can be connected to from any IP
  - Does not contain a password
  - Has the `DROP` privilege on the table `some_tbl` in the database `some_db`
  - Has both the `CREATE` and `DROP` privileges on the `other_db` database
- The role `test_role` has been granted to `test_user`
- The `"Columns"` field is present, but is currently unused

```json
{
  "Users": [
    {
      "User": "root",
      "Host": "localhost",
      "PrivilegeSet": {
        "GlobalStatic": [
          "SELECT",
          "INSERT",
          "UPDATE",
          "DELETE",
          "CREATE",
          "DROP",
          "RELOAD",
          "SHUTDOWN",
          "PROCESS",
          "FILE",
          "GRANT",
          "REFERENCES",
          "INDEX",
          "ALTER",
          "SHOW DATABASES",
          "SUPER",
          "CREATE TEMPORARY TABLES",
          "LOCK TABLES",
          "EXECUTE",
          "REPLICATION SLAVE",
          "REPLICATION CLIENT",
          "CREATE VIEW",
          "SHOW VIEW",
          "CREATE ROUTINE",
          "ALTER ROUTINE",
          "CREATE USER",
          "EVENT",
          "TRIGGER",
          "CREATE TABLESPACE",
          "CREATE ROLE",
          "DROP ROLE"
        ],
        "Databases": []
      },
      "Plugin": "mysql_native_password",
      "Password": "*A0F874BC7F54EE086FCE60A37CE7887D8B31086B",
      "PasswordLastChanged": "1970-01-01T00:00:01Z",
      "Locked": false,
      "Attributes": null,
      "IsRole": false
    },
    {
      "User": "test_role",
      "Host": "%",
      "PrivilegeSet": {
        "GlobalStatic": [
          "SELECT",
          "INSERT",
          "UPDATE",
          "DELETE"
        ],
        "Databases": []
      },
      "Plugin": "mysql_native_password",
      "Password": "",
      "PasswordLastChanged": "2022-02-15T00:00:00.0000000Z",
      "Locked": true,
      "Attributes": null,
      "IsRole": true
    },
    {
      "User": "test_user",
      "Host": "localhost",
      "PrivilegeSet": {
        "GlobalStatic": [],
        "Databases": [
          {
            "Name": "some_db",
            "Privileges": [],
            "Tables": [
              {
                "Name": "some_tbl",
                "Privileges": [
                  "DROP"
                ],
                "Columns": []
              }
            ]
          },
          {
            "Name": "other_db",
            "Privileges": [
              "CREATE",
              "DROP"
            ],
            "Tables": []
          }
        ]
      },
      "Plugin": "mysql_native_password",
      "Password": "",
      "PasswordLastChanged": "2022-02-15T00:00:00.0000000Z",
      "Locked": false,
      "Attributes": null,
      "IsRole": false
    }
  ],
  "Roles": [
    {
      "FromHost": "%",
      "FromUser": "test_role",
      "ToHost": "localhost",
      "ToUser": "test_user",
      "WithAdminOption": false
    }
  ]
}
```

## Updates and Persistence

Unlike in MySQL, Dolt immediately processes all updates to the grant tables.
Any privilege changes will immediately take effect, any deleted users with current sessions will immediately lose access, etc.
Whether these are benefits or drawbacks depend on those running the database.
For Dolt, the decision to have all updates take immediate effect allows for emergency updates to not require a server restart in some cases, which we believe offers some security and convenience advantages.
The benefit of delayed updates do not seem as likely or often, although we may still change this behavior in the future if it is proven otherwise.

Persistence to the [privilege file](#privilege-file) is immediate only when the grant tables are modified through their typical statements (`CREATE USER`, `GRANT`, `REVOKE`, etc.).
Directly modifying the grant tables using `INSERT`, `UPDATE`, etc. will cause an immediate update to all current users, however it **will not** be immediately persisted to the [privilege file](#privilege-file).
The [privilege file](#privilege-file) is **only** updated when the aforementioned statements are executed.
This may change in the future.

Lastly, any manual changes to the privilege file should be done when the server is not running.
Not only is the privilege file only read when the server is starting, but the privilege file's contents will be overwritten if any of the aforementioned commands are run.

## Statements

For now, only some of the core statements are supported for users and privileges.
Of those core statements, some are fully supported, while others only offer partial support.

### Fully Supported

- `CREATE ROLE`
- `DROP ROLE`
- `DROP USER`
- `SHOW PRIVILEGES`

The following grant tables are fully implemented:

- `mysql.user`
  - Contains the user definition, global static privileges, login details, password limits, account maximums, and attributes
  - Although this table is fully implemented, we do not support all of the features that this table provides, even though they may be set
    - For those features that are not yet implemented, their column values may not survive a server restart
- `mysql.db`
  - Contains the database-level privileges
- `mysql.tables_priv`
  - Contains the table-level privileges
- `mysql.role_edges`
  - Contains the connections between all roles and users

### Partially Supported

- `CREATE USER`
  - For now, we only support setting the username and host name, global static privileges, locked status, and a basic `mysql_native_password` for authentication
  - All other fields, such as the `DEFAULT ROLE` and multiple auth options, are either ignored or will throw an error
  - Even though a comment and attributes may be set (and are persisted), they are ignored, and this includes partial revokes
- `GRANT`
  - The form `GRANT <privileges> ON <privilege_level> TO <users...>` does not yet support columns, an object type (tables only), or assuming a different user
  - The form `GRANT <roles...> TO <users...> [WITH ADMIN OPTION]` is fully supported
  - The form `GRANT PROXY ...` is not yet supported
- `REVOKE`
  - The form `REVOKE <privileges...> ON <privilege_level> FROM <users...>` does not yet support columns or an object type (tables only)
  - The form `REVOKE <roles...> FROM <users...>` is fully supported
  - The form `REVOKE PROXY ...` is not yet supported
  - The form `REVOKE ALL PRIVILEGES ...` is not yet supported, which differs from `REVOKE ALL ON ...` in functionality
- `SHOW GRANTS`
  - Displays global static grants and granted roles
  - Does not yet display a user's database or table-level privileges
  - The optional `[USING <roles...>]` portion is not yet supported

### Not Yet Supported

- `ALTER USER`
- `RENAME USER`
- `SET DEFAULT ROLE`
- `SET PASSWORD`
- `SET ROLE`

The following grant tables (and their associated functionality) are not yet supported:

- `mysql.global_grants`
  - Contains all global dynamic grants
- `mysql.columns_priv`
  - Contains column privileges
- `mysql.procs_priv`
  - Contains stored procedures
- `mysql.proxies_priv`
  - Contains proxy accounts
- `mysql.default_roles`
  - Stores each user's default roles
- `mysql.password_history`
  - Contains password changes

The following system variables are not yet supported:
- `mandatory_roles`
  - All roles (and users) named here are granted to all users automatically, and cannot be revoked or dropped
- `activate_all_roles_on_login`
  - Sets all roles to active upon logging into a user
  - As `SET ROLE` is also not yet implemented, any granted roles are automatically active when granted and logging in
    - This will be changed as soon as `SET ROLE` is implemented

## Future Plans

We plan to incorporate all currently missing statements and functionality that MySQL contains regarding users and privileges.
In addition, we also plan to allow for all of our versioning features to have their access privilege-checked.
This includes the Dolt SQL functions (`DOLT_COMMIT()`, `DOLT_CHECKOUT()`, etc.) as well as only allowing specific users to manage specific branches, just to name a few of the planned features.
This page will be updated as features are added!