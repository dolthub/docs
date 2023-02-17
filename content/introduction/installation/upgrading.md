# Upgrading

Dolt is constantly evolving. We release a new Dolt approximately once a week.

To check which version you have installed, run `dolt version` on the command line or `select dolt_version()` against a running SQL server. Make sure the version matches the latest as seen on the [GitHub releases page](https://github.com/dolthub/dolt/releases).

To upgrade, download the latest Dolt binary for your platform and replace the Dolt binary on your `PATH` with the downloaded one. Running the install process on most platforms again will do this for you.

If you are running a `dolt sql-server` you must restart the server to start using the new binary.
