---
title: System Catalog Schema
---

The [Postgres `pg_catalog` schema](https://www.postgresql.org/docs/15/catalogs.html)
provides access to a variety of database metadata useful for inspecting your database and
also used by database tooling. Doltgres provides a subset of the data available in
`pg_catalog`, as described below. In general, all tables from Postgres's `pg_catalog`
exist, with the correct schema, but not all data is populated. If you need support for
`pg_catalog` metadata that is available in Postgres, but not yet available in Doltgres,
please [open a GitHub issue](https://github.com/dolthub/doltgresql/issues) to let us know
what you need.

## Tables

| Table                                                                                                     | Parses | Populated |
| :-------------------------------------------------------------------------------------------------------- | :----- | --------- |
| [pg_aggregate](https://www.postgresql.org/docs/current/catalog-pg-aggregate.html)                         | ✅     | ❌        |
| [pg_am](https://www.postgresql.org/docs/current/catalog-pg-am.html)                                       | ✅     | ❌        |
| [pg_amop](https://www.postgresql.org/docs/current/catalog-pg-amop.html)                                   | ✅     | ❌        |
| [pg_amproc](https://www.postgresql.org/docs/current/catalog-pg-amproc.html)                               | ✅     | ❌        |
| [pg_attrdef](https://www.postgresql.org/docs/current/catalog-pg-attrdef.html)                             | ✅     | 🟠        |
| [pg_attribute](https://www.postgresql.org/docs/current/catalog-pg-attribute.html)                         | ✅     | 🟠        |
| [pg_auth_members](https://www.postgresql.org/docs/current/catalog-pg-auth-members.html)                   | ✅     | ❌        |
| [pg_authid](https://www.postgresql.org/docs/current/catalog-pg-authid.html)                               | ✅     | ❌        |
| [pg_cast](https://www.postgresql.org/docs/current/catalog-pg-cast.html)                                   | ✅     | ❌        |
| [pg_class](https://www.postgresql.org/docs/current/catalog-pg-class.html)                                 | ✅     | 🟠        |
| [pg_collation](https://www.postgresql.org/docs/current/catalog-pg-collation.html)                         | ✅     | ❌        |
| [pg_constraint](https://www.postgresql.org/docs/current/catalog-pg-constraint.html)                       | ✅     | 🟠        |
| [pg_conversion](https://www.postgresql.org/docs/current/catalog-pg-conversion.html)                       | ✅     | ❌        |
| [pg_database](https://www.postgresql.org/docs/current/catalog-pg-database.html)                           | ✅     | 🟠        |
| [pg_db_role_setting](https://www.postgresql.org/docs/current/catalog-pg-db-role-setting.html)             | ✅     | ❌        |
| [pg_default_acl](https://www.postgresql.org/docs/current/catalog-pg-default-acl.html)                     | ✅     | ❌        |
| [pg_depend](https://www.postgresql.org/docs/current/catalog-pg-depend.html)                               | ✅     | ❌        |
| [pg_description](https://www.postgresql.org/docs/current/catalog-pg-description.html)                     | ✅     | ❌        |
| [pg_enum](https://www.postgresql.org/docs/current/catalog-pg-enum.html)                                   | ✅     | ❌        |
| [pg_event_trigger](https://www.postgresql.org/docs/current/catalog-pg-event-trigger.html)                 | ✅     | ❌        |
| [pg_extension](https://www.postgresql.org/docs/current/catalog-pg-extension.html)                         | ✅     | ❌        |
| [pg_foreign_data_wrapper](https://www.postgresql.org/docs/current/catalog-pg-foreign-data-wrapper.html)   | ✅     | ❌        |
| [pg_foreign_server](https://www.postgresql.org/docs/current/catalog-pg-foreign-server.html)               | ✅     | ❌        |
| [pg_foreign_table](https://www.postgresql.org/docs/current/catalog-pg-foreign-table.html)                 | ✅     | ❌        |
| [pg_index](https://www.postgresql.org/docs/current/catalog-pg-index.html)                                 | ✅     | 🟠        |
| [pg_inherits](https://www.postgresql.org/docs/current/catalog-pg-inherits.html)                           | ✅     | ❌        |
| [pg_init_privs](https://www.postgresql.org/docs/current/catalog-pg-init-privs.html)                       | ✅     | ❌        |
| [pg_language](https://www.postgresql.org/docs/current/catalog-pg-language.html)                           | ✅     | ❌        |
| [pg_largeobject](https://www.postgresql.org/docs/current/catalog-pg-largeobject.html)                     | ✅     | ❌        |
| [pg_largeobject_metadata](https://www.postgresql.org/docs/current/catalog-pg-largeobject-metadata.html)   | ✅     | ❌        |
| [pg_namespace](https://www.postgresql.org/docs/current/catalog-pg-namespace.html)                         | ✅     | 🟠        |
| [pg_opclass](https://www.postgresql.org/docs/current/catalog-pg-opclass.html)                             | ✅     | ❌        |
| [pg_opfamily](https://www.postgresql.org/docs/current/catalog-pg-opfamily.html)                           | ✅     | ❌        |
| [pg_parameter_acl](https://www.postgresql.org/docs/current/catalog-pg-parameter-acl.html)                 | ✅     | ❌        |
| [pg_partitioned_table](https://www.postgresql.org/docs/current/catalog-pg-partitioned-table.html)         | ✅     | ❌        |
| [pg_policy](https://www.postgresql.org/docs/current/catalog-pg-policy.html)                               | ✅     | ❌        |
| [pg_proc](https://www.postgresql.org/docs/current/catalog-pg-proc.html)                                   | ✅     | ❌        |
| [pg_publication](https://www.postgresql.org/docs/current/catalog-pg-publication.html)                     | ✅     | ❌        |
| [pg_publication_namespace](https://www.postgresql.org/docs/current/catalog-pg-publication-namespace.html) | ✅     | ❌        |
| [pg_publication_rel](https://www.postgresql.org/docs/current/catalog-pg-publication-rel.html)             | ✅     | ❌        |
| [pg_range](https://www.postgresql.org/docs/current/catalog-pg-range.html)                                 | ✅     | ❌        |
| [pg_replication_origin](https://www.postgresql.org/docs/current/catalog-pg-replication-origin.html)       | ✅     | ❌        |
| [pg_rewrite](https://www.postgresql.org/docs/current/catalog-pg-rewrite.html)                             | ✅     | ❌        |
| [pg_seclabel](https://www.postgresql.org/docs/current/catalog-pg-seclabel.html)                           | ✅     | ❌        |
| [pg_sequence](https://www.postgresql.org/docs/current/catalog-pg-sequence.html)                           | ✅     | ✅        |
| [pg_shdepend](https://www.postgresql.org/docs/current/catalog-pg-shdepend.html)                           | ✅     | ❌        |
| [pg_shdescription](https://www.postgresql.org/docs/current/catalog-pg-shdescription.html)                 | ✅     | ❌        |
| [pg_shseclabel](https://www.postgresql.org/docs/current/catalog-pg-shseclabel.html)                       | ✅     | ❌        |
| [pg_statistic](https://www.postgresql.org/docs/current/catalog-pg-statistic.html)                         | ✅     | ❌        |
| [pg_statistic_ext](https://www.postgresql.org/docs/current/catalog-pg-statistic-ext.html)                 | ✅     | ❌        |
| [pg_statistic_ext_data](https://www.postgresql.org/docs/current/catalog-pg-statistic-ext-data.html)       | ✅     | ❌        |
| [pg_subscription](https://www.postgresql.org/docs/current/catalog-pg-subscription.html)                   | ✅     | ❌        |
| [pg_subscription_rel](https://www.postgresql.org/docs/current/catalog-pg-subscription-rel.html)           | ✅     | ❌        |
| [pg_tablespace](https://www.postgresql.org/docs/current/catalog-pg-tablespace.html)                       | ✅     | ❌        |
| [pg_transform](https://www.postgresql.org/docs/current/catalog-pg-transform.html)                         | ✅     | ❌        |
| [pg_trigger](https://www.postgresql.org/docs/current/catalog-pg-trigger.html)                             | ✅     | ❌        |
| [pg_ts_config](https://www.postgresql.org/docs/current/catalog-pg-ts-config.html)                         | ✅     | ❌        |
| [pg_ts_config_map](https://www.postgresql.org/docs/current/catalog-pg-ts-config-map.html)                 | ✅     | ❌        |
| [pg_ts_dict](https://www.postgresql.org/docs/current/catalog-pg-ts-dict.html)                             | ✅     | ❌        |
| [pg_ts_parser](https://www.postgresql.org/docs/current/catalog-pg-ts-parser.html)                         | ✅     | ❌        |
| [pg_ts_template](https://www.postgresql.org/docs/current/catalog-pg-ts-template.html)                     | ✅     | ❌        |
| [pg_type](https://www.postgresql.org/docs/current/catalog-pg-type.html)                                   | ✅     | 🟠        |
| [pg_user_mapping](https://www.postgresql.org/docs/current/catalog-pg-user-mapping.html)                   | ✅     | ❌        |

## Views

| View                                                                                                                                   | Parses | Populated |
| :------------------------------------------------------------------------------------------------------------------------------------- | :----- | --------- |
| [pg_available_extension_versions](https://www.postgresql.org/docs/current/view-pg-available-extension-versions.html)                   | ✅     | ❌        |
| [pg_available_extensions](https://www.postgresql.org/docs/current/view-pg-available-extensions.html)                                   | ✅     | ❌        |
| [pg_backend_memory_contexts](https://www.postgresql.org/docs/current/view-pg-backend-memory-contexts.html)                             | ✅     | ❌        |
| [pg_config](https://www.postgresql.org/docs/current/view-pg-config.html)                                                               | ✅     | ❌        |
| [pg_cursors](https://www.postgresql.org/docs/current/view-pg-cursors.html)                                                             | ✅     | ❌        |
| [pg_file_settings](https://www.postgresql.org/docs/current/view-pg-file-settings.html)                                                 | ✅     | ❌        |
| [pg_group](https://www.postgresql.org/docs/current/view-pg-group.html)                                                                 | ✅     | ❌        |
| [pg_hba_file_rules](https://www.postgresql.org/docs/current/view-pg-hba-file-rules.html)                                               | ✅     | ❌        |
| [pg_ident_file_mappings](https://www.postgresql.org/docs/current/view-pg-ident-file-mappings.html)                                     | ✅     | ❌        |
| [pg_indexes](https://www.postgresql.org/docs/current/view-pg-indexes.html)                                                             | ✅     | 🟠        |
| [pg_locks](https://www.postgresql.org/docs/current/view-pg-locks.html)                                                                 | ✅     | ❌        |
| [pg_matviews](https://www.postgresql.org/docs/current/view-pg-matviews.html)                                                           | ✅     | ❌        |
| [pg_policies](https://www.postgresql.org/docs/current/view-pg-policies.html)                                                           | ✅     | ❌        |
| [pg_prepared_statements](https://www.postgresql.org/docs/current/view-pg-prepared-statements.html)                                     | ✅     | ❌        |
| [pg_prepared_xacts](https://www.postgresql.org/docs/current/view-pg-prepared-xacts.html)                                               | ✅     | ❌        |
| [pg_publication_tables](https://www.postgresql.org/docs/current/view-pg-publication-tables.html)                                       | ✅     | ❌        |
| [pg_replication_origin_status](https://www.postgresql.org/docs/current/view-pg-replication-origin-status.html)                         | ✅     | ❌        |
| [pg_replication_slots](https://www.postgresql.org/docs/current/view-pg-replication-slots.html)                                         | ✅     | ❌        |
| [pg_roles](https://www.postgresql.org/docs/current/view-pg-roles.html)                                                                 | ✅     | ❌        |
| [pg_rules](https://www.postgresql.org/docs/current/view-pg-rules.html)                                                                 | ✅     | ❌        |
| [pg_seclabels](https://www.postgresql.org/docs/current/view-pg-seclabels.html)                                                         | ✅     | ❌        |
| [pg_sequences](https://www.postgresql.org/docs/current/view-pg-sequences.html)                                                         | ✅     | ❌        |
| [pg_settings](https://www.postgresql.org/docs/current/view-pg-settings.html)                                                           | ✅     | ❌        |
| [pg_shadow](https://www.postgresql.org/docs/current/view-pg-shadow.html)                                                               | ✅     | ❌        |
| [pg_shmem_allocations](https://www.postgresql.org/docs/current/view-pg-shmem-allocations.html)                                         | ✅     | ❌        |
| [pg_stat_activity](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW)                     | ✅     | ❌        |
| [pg_stat_all_indexes](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ALL-INDEXES-VIEW)               | ✅     | ❌        |
| [pg_stat_all_tables](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ALL-TABLES-VIEW)                 | ✅     | ❌        |
| [pg_stat_archiver](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ARCHIVER-VIEW)                     | ✅     | ❌        |
| [pg_stat_bgwriter](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-BGWRITER-VIEW)                     | ✅     | ❌        |
| [pg_stat_database](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-DATABASE-VIEW)                     | ✅     | ❌        |
| [pg_stat_database_conflicts](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-DATABASE-CONFLICTS-VIEW) | ✅     | ❌        |
| [pg_stat_gssapi](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-GSSAPI-VIEW)                         | ✅     | ❌        |
| [pg_stat_io](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-IO-VIEW)                                 | ✅     | ❌        |
| [pg_stat_progress_analyze](https://www.postgresql.org/docs/current/progress-reporting.html#ANALYZE-PROGRESS-REPORTING)                 | ✅     | ❌        |
| [pg_stat_progress_basebackup](https://www.postgresql.org/docs/current/progress-reporting.html#BASEBACKUP-PROGRESS-REPORTING)           | ✅     | ❌        |
| [pg_stat_progress_cluster](https://www.postgresql.org/docs/current/progress-reporting.html#CLUSTER-PROGRESS-REPORTING)                 | ✅     | ❌        |
| [pg_stat_progress_copy](https://www.postgresql.org/docs/current/progress-reporting.html#COPY-PROGRESS-REPORTING)                       | ✅     | ❌        |
| [pg_stat_progress_create_index](https://www.postgresql.org/docs/current/progress-reporting.html#CREATE-INDEX-PROGRESS-REPORTING)       | ✅     | ❌        |
| [pg_stat_progress_vacuum](https://www.postgresql.org/docs/current/progress-reporting.html#VACUUM-PROGRESS-REPORTING)                   | ✅     | ❌        |
| [pg_stat_recovery_prefetch](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-RECOVERY-PREFETCH)        | ✅     | ❌        |
| [pg_stat_replication](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-VIEW)               | ✅     | ❌        |
| [pg_stat_replication_slots](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-REPLICATION-SLOTS-VIEW)   | ✅     | ❌        |
| [pg_stat_slru](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-SLRU-VIEW)                             | ✅     | ❌        |
| [pg_stat_ssl](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-SSL-VIEW)                               | ✅     | ❌        |
| [pg_stat_subscription](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-SUBSCRIPTION)                  | ✅     | ❌        |
| [pg_stat_subscription_stats](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-SUBSCRIPTION-STATS)      | ✅     | ❌        |
| [pg_stat_sys_indexes](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ALL-INDEXES-VIEW)               | ✅     | ❌        |
| [pg_stat_sys_tables](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ALL-TABLES-VIEW)                 | ✅     | ❌        |
| [pg_stat_user_functions](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-USER-FUNCTIONS-VIEW)         | ✅     | ❌        |
| [pg_stat_user_indexes](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ALL-INDEXES-VIEW)              | ✅     | ❌        |
| [pg_stat_user_tables](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ALL-TABLES-VIEW)                | ✅     | ❌        |
| [pg_stat_wal](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-WAL-VIEW)                               | ✅     | ❌        |
| [pg_stat_wal_receiver](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-WAL-RECEIVER-VIEW)             | ✅     | ❌        |
| [pg_stat_xact_all_tables](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ALL-TABLES-VIEW)            | ✅     | ❌        |
| [pg_stat_xact_sys_tables](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ALL-TABLES-VIEW)            | ✅     | ❌        |
| [pg_stat_xact_user_functions](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-USER-FUNCTIONS-VIEW)    | ✅     | ❌        |
| [pg_stat_xact_user_tables](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ALL-TABLES-VIEW)           | ✅     | ❌        |
| [pg_statio_all_indexes](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STATIO-ALL-INDEXES-VIEW)           | ✅     | ❌        |
| [pg_statio_all_sequences](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STATIO-ALL-SEQUENCES-VIEW)       | ✅     | ❌        |
| [pg_statio_all_tables](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STATIO-ALL-TABLES-VIEW)             | ✅     | ❌        |
| [pg_statio_sys_indexes](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STATIO-ALL-INDEXES-VIEW)           | ✅     | ❌        |
| [pg_statio_sys_sequences](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STATIO-ALL-SEQUENCES-VIEW)       | ✅     | ❌        |
| [pg_statio_sys_tables](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STATIO-ALL-TABLES-VIEW)             | ✅     | ❌        |
| [pg_statio_user_indexes](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STATIO-ALL-INDEXES-VIEW)          | ✅     | ❌        |
| [pg_statio_user_sequences](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STATIO-ALL-SEQUENCES-VIEW)      | ✅     | ❌        |
| [pg_statio_user_tables](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STATIO-ALL-TABLES-VIEW)            | ✅     | ❌        |
| [pg_stats](https://www.postgresql.org/docs/current/view-pg-stats.html)                                                                 | ✅     | ❌        |
| [pg_stats_ext](https://www.postgresql.org/docs/current/view-pg-stats-ext.html)                                                         | ✅     | ❌        |
| [pg_stats_ext_exprs](https://www.postgresql.org/docs/current/view-pg-stats-ext-exprs.html)                                             | ✅     | ❌        |
| [pg_tables](https://www.postgresql.org/docs/current/view-pg-tables.html)                                                               | ✅     | 🟠        |
| [pg_timezone_abbrevs](https://www.postgresql.org/docs/current/view-pg-timezone-abbrevs.html)                                           | ✅     | ❌        |
| [pg_timezone_names](https://www.postgresql.org/docs/current/view-pg-timezone-names.html)                                               | ✅     | ❌        |
| [pg_user](https://www.postgresql.org/docs/current/view-pg-user.html)                                                                   | ✅     | ❌        |
| [pg_user_mappings](https://www.postgresql.org/docs/current/view-pg-user-mappings.html)                                                 | ✅     | ❌        |
| [pg_views](https://www.postgresql.org/docs/current/view-pg-views.html)                                                                 | ✅     | 🟠        |
