---
title: Supported Functions 
---

Doltgres currently supports a subset of [the Postgres functions](https://www.postgresql.org/docs/15/functions.html)
for the built-in data types. If you need any Postgres function that is not available in Doltgres yet, 
you can [open a GitHub issue](https://github.com/dolthub/doltgresql/issues) to let us know what you need.

{% hint style="info" %}
Supported functions work as `SELECT [function]`, but not yet as `SELECT * FROM [function]`.
{% endhint %}

## Session Information Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/15/functions-info.html#FUNCTIONS-INFO-SESSION-TABLE).

| Function                                | Supported | Notes and limitations                |
| :-------------------------------------- |:----------|:-------------------------------------|
| current_catalog                         | ✅         |                                      |
| current_database()                      | ✅         |                                      |
| current_query()                         | ❌         |                                      |
| current_role                            | ❌         |                                      |
| current_schema[()]                      | ✅         |                                      |
| current_schemas(bool)                   | ✅         |                                      |
| current_user                            | ❌         |                                      |
| inet_client_addr()                      | ❌         |                                      |
| inet_client_port()                      | ❌         |                                      |
| inet_server_addr()                      | ❌         |                                      |
| inet_server_port()                      | ❌         |                                      |
| pg_backend_pid()                        | ❌         |                                      |
| pg_blocking_pids(integer)               | ❌         |                                      |
| pg_conf_load_time()                     | ❌         |                                      |
| pg_current_logfile([text])              | ❌         |                                      |
| pg_my_temp_schema()                     | ❌         |                                      |
| pg_is_other_temp_schema(oid)            | ❌         |                                      |
| pg_jit_available()                      | ❌         |                                      |
| pg_listening_channels()                 | ❌         |                                      |
| pg_notification_queue_usage()           | ❌         |                                      |
| pg_postmaster_start_time()              | 🟠        | Parses, returns current time         |
| pg_safe_snapshot_blocking_pids(integer) | ❌         |                                      |
| pg_trigger_depth()                      | ❌         |                                      |
| session_user                            | ❌         |                                      |
| user                                    | ❌         |                                      |
| version()                               | 🟠        | Includes version but not system info |

## System Catalog Information Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/15/functions-info.html#FUNCTIONS-INFO-CATALOG-TABLE).

| Function                                     | Supported | Notes and limitations   |
|:---------------------------------------------|:----------|:------------------------|
| format_type(oid, integer)                    | ✅         |                         |
| pg_char_to_encoding(name)                    | ❌         |                         |
| pg_encoding_to_char(integer)                 | 🟠        | Parses, not implemented |
| pg_get_catalog_foreign_keys()                | ❌         |                         |
| pg_get_constraintdef(oid [, boolean])        | ✅         |                         |
| pg_get_expr(pg_node_tree, oid [, boolean])   | 🟠        | Parses, not implemented |
| pg_get_functiondef(oid)                      | 🟠        | Parses, not implemented |
| pg_get_function_arguments(oid)               | ❌         |                         |
| pg_get_function_identity_arguments(oid)      | 🟠        | Parses, not implemented |
| pg_get_function_result(oid)                  | ❌         |                         |
| pg_get_indexdef(oid [, integer, boolean])    | ❌         |                         |
| pg_get_keywords(oid)                         | ❌         |                         |
| pg_get_partkeydef()                          | 🟠        | Parses, not implemented |
| pg_get_ruledef(oid [, boolean])              | ❌         |                         |
| pg_get_serial_sequence(text, text)           | ❌         |                         |
| pg_get_statisticsobjdef(oid)                 | ❌         |                         |
| pg_get_triggerdef(oid [, boolean])           | 🟠        | Parses, not implemented |
| pg_get_userbyid(oid)                         | 🟠        | Parses, not implemented |
| pg_get_viewdef(oid [, boolean])              | ✅         |                         |
| pg_get_viewdef(text [, boolean])             | ✅         |                         |
| pg_index_column_has_property(regclass, text) | ❌         |                         |
| pg_indexam_has_property(oid, text)           | ❌         |                         |
| pg_options_to_table(text[])                  | ❌         |                         |
| pg_settings_get_flags(text)                  | ❌         |                         |
| pg_tablespace_databases(oid)                 | ❌         |                         |
| pg_tablespace_location(pod)                  | ❌         |                         |
| pg_typeof("any")                             | ❌         |                         |
| COLLATION FOR("any)                          | ❌         |                         |
| to_regclass(text)                            | ✅         |                         |
| to_regcollation(text)                        | ❌         |                         |
| to_regnamespace(text)                        | ❌         |                         |
| to_regoper(text)                             | ❌         |                         |
| to_regoperator(text)                         | ❌         |                         |
| to_regproc(text)                             | ✅         |                         |
| to_regprocedure(text)                        | ❌         |                         |
| to_regrole(text)                             | ❌         |                         |
| to_regtype(text)                             | ✅         |                         |

## Schema Visibility Inquiry Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/15/functions-info.html#FUNCTIONS-INFO-SCHEMA-TABLE).

| Function                          | Supported | Notes and limitations   |
| :-------------------------------- | :-------- |:------------------------|
| pg_collation_is_visible(oid)      | ❌        |                         |
| pg_conversion_is_visible(oid)     | ❌        |                         |
| pg_function_is_visible(oid)       | 🟠        | Parses, not implemented |
| pg_opclass_is_visible(oid)        | ❌        |                         |
| pg_operator_is_visible(oid)       | ❌        |                         |
| pg_opfamily_is_visible(oid)       | ❌        |                         |
| pg_statistics_obj_is_visible(oid) | ❌        |                         |
| pg_table_is_visible(oid)          | ✅        |                         |
| pg_ts_config_is_visible(oid)      | ❌        |                         |
| pg_ts_dict_is_visible(oid)        | ❌        |                         |
| pg_ts_parser_is_visible(oid)      | ❌        |                         |
| pg_ts_template_is_visible(oid)    | ❌        |                         |
| pg_type_is_visible(oid)           | ❌        |                         |

## Comment Information Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/15/functions-info.html#FUNCTIONS-INFO-COMMENT-TABLE).

| Function                      | Supported | Notes and limitations   |
| :---------------------------- | :-------- |:------------------------|
| col_description(oid, integer) | 🟠        | Parses, not implemented |
| obj_description(oid, name)    | 🟠        | Parses, not implemented |
| obj_description(oid)          | ❌        | Deprecated in Postgres  |
| shobj_description(oid, name)  | 🟠        | Parses, not implemented |

## Array Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/15/functions-array.html#ARRAY-FUNCTIONS-TABLE).

| Function                                                                 | Supported | Notes and limitations |
|:-------------------------------------------------------------------------| :-------- | :-------------------- |
| array_append ( anycompatiblearray, anycompatible )                       | ✅        |                       |
| array_cat ( anycompatiblearray, anycompatiblearray )                     | ❌        |                       |
| array_dims ( anyarray )                                                  | ❌        |                       |
| array_fill ( anyelement, integer[] [, integer[] ] )                      | ❌        |                       |
| array_length ( anyarray, integer )                                       | ❌        |                       |
| array_lower ( anyarray, integer )                                        | ❌        |                       |
| array_ndims ( anyarray )                                                 | ❌        |                       |
| array_position ( anycompatiblearray, anycompatible [, integer ] )        | ❌        |                       |
| array_positions ( anycompatiblearray, anycompatible )                    | ❌        |                       |
| array_prepend ( anycompatible, anycompatiblearray )                      | ❌        |                       |
| array_remove ( anycompatiblearray, anycompatible )                       | ❌        |                       |
| array_replace ( anycompatiblearray, anycompatible, anycompatible )       | ❌        |                       |
| array_to_string ( array anyarray, delimiter text [, null_string text ] ) | ✅        |                       |
| array_upper ( anyarray, integer )                                        | ❌        |                       |
| cardinality ( anyarray )                                                 | ❌        |                       |
| trim_array ( array anyarray, n integer )                                 | ❌        |                       |
| unnest ( anyarray )                                                      | ❌        |                       |
| unnest ( anyarray, anyarray [, ... ] )                                   | ❌        |                       |

## Date/Time Functions

See detailed list in the [Postgres docs](https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTIONS-DATETIME-TABLE).

| Function                                                                                                                       | Supported | Notes and limitations  |
|:-------------------------------------------------------------------------------------------------------------------------------| :-------- |:-----------------------|
| age ( timestamp, timestamp )                                                                                                   | ✅        |                        |
| age ( timestamp )                                                                                                              | ✅        |                        |
| clock_timestamp ( )                                                                                                            | ❌        |                        |
| current_date                                                                                                                   | ✅        |                        |
| current_time                                                                                                                   | ❌        |                        |
| current_time ( integer )                                                                                                       | ❌        |                        |
| current_timestamp                                                                                                              | ✅        |                        |
| current_timestamp ( integer )                                                                                                  | ❌        |                        |
| date_add ( timestamp with time zone, interval [, text ] )                                                                      | ❌        |                        |
| date_bin ( interval, timestamp, timestamp )                                                                                    | ❌        |                        |
| date_part ( text, timestamp )                                                                                                  | ❌        |                        |
| date_part ( text, interval )                                                                                                   | ❌        |                        |
| date_subtract ( timestamp with time zone, interval [, text ] )                                                                 | ❌        |                        |
| date_trunc ( text, timestamp )                                                                                                 | ❌        |                        |
| date_trunc ( text, timestamp with time zone, text )                                                                            | ❌        |                        |
| date_trunc ( text, interval )                                                                                                  | ❌        |                        |
| extract ( field from timestamp )                                                                                               | ✅        |                        |
| extract ( field from interval )                                                                                                | ✅        |                        |
| isfinite ( date )                                                                                                              | ❌        |                        |
| isfinite ( timestamp )                                                                                                         | ❌        |                        |
| isfinite ( interval )                                                                                                          | ❌        |                        |
| justify_days ( interval )                                                                                                      | ❌        |                        |
| justify_hours ( interval )                                                                                                     | ❌        |                        |
| justify_interval ( interval )                                                                                                  | ❌        |                        |
| localtime                                                                                                                      | 🟠        | returns timestamp      |
| localtime ( integer )                                                                                                          | ❌        |                        |
| localtimestamp                                                                                                                 | ✅        |                        |
| localtimestamp ( integer )                                                                                                     | ❌        |                        |
| make_date ( year int, month int, day int )                                                                                     | ❌        |                        |
| make_interval ( [ years int [, months int [, weeks int [, days int [, hours int [, mins int [, secs double precision ]]]]]]] ) | ❌        |                        |
| make_time ( hour int, min int, sec double precision )                                                                          | ❌        |                        |
| make_timestamp ( year int, month int, day int, hour int, min int, sec double precision )                                       | ❌        |                        |
| make_timestamptz ( year int, month int, day int, hour int, min int, sec double precision [, timezone text ] )                  | ❌        |                        |
| now ( )                                                                                                                        | 🟠        | missing timezone value |
| statement_timestamp ( )                                                                                                        | ❌        |                        |
| timeofday ( )                                                                                                                  | ❌        |                        |
| transaction_timestamp ( )                                                                                                      | ❌        |                        |
| to_timestamp ( double precision )                                                                                              | ❌        |                        |
