---
title: Installation
description: Details on how to install Dolt.
---

# Dolt

Dolt is a data format and a database. The Dolt database provides a command line interface and a MySQL compatible Server for reading and writing data. There are several options for installation, detailed in the following sections.

## Linux

For Linux users we provide an installation script that will detect your architecture, download the appropriate binary, and place in `/usr/local/bin`:

```
sudo bash -c 'curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | sudo bash'
```

The use of `sudo` is required to ensure the binary lands in your path. The script can be examined before executing should you have any concerns.

## Windows

We provide both `.msi` files and `.zip` files.

### MSI Files

The easiest way to install Dolt on Windows is to use our MSI files that are provided with each release, they can be found in the Assets section of our release. Grab the latest [here](https://github.com/dolthub/dolt/releases/latest).

### `.zip` Archive

For those preferring to install Dolt manually a zipped archive is provided with the requisite executables. It can be found in assets along with our [latest release](https://github.com/dolthub/dolt/releases/latest).

## OSX

### Homebrew

We publish a Homebrew formula with every release, so Mac users using Homebrew for package management can build Dolt from source with a single command:

```
$ brew install dolt
==> Downloading https://homebrew.bintray.com/bottles/dolt-0.18.3.catalina.bottle.tar.gz
==> Downloading from https://d29vzk4ow07wi7.cloudfront.net/c03cc532d5045fa090cb4e0f141883685de3765bf1d221e400c750b3ae89e328?response-content-disposition=attachment%3Bfilename%3D%22dolt-0.18.3.catalina.bottle.tar.gz%22&Policy=eyJTdGF0
######################################################################## 100.0%
==> Pouring dolt-0.18.3.catalina.bottle.tar.gz
🍺  /usr/local/Cellar/dolt/0.18.3: 7 files, 56.9MB
```

This will install Dolt as follows:

```
$ ls -ltr $(which dolt)
lrwxr-xr-x  1 oscarbatori  admin  30 Aug 26 16:49 /usr/local/bin/dolt -> ../Cellar/dolt/0.18.3/bin/dolt
```

### Install Script

For non-Homebew OSX users, the download script for Linux can be used, as OSX is a `*nix` system. It will download the appropriate binary, and place it in `/usr/local/bin`:

```
sudo bash -c 'curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | bash'
```

## Build from source

For those interested in building from source, it's relatively straight forward to do. Just clone the repo and use `go install`:

```
$ git clone git@github.com:dolthub/dolt.git
Cloning into 'dolt'...
remote: Enumerating objects: 25, done.
remote: Counting objects: 100% (25/25), done.
remote: Compressing objects: 100% (25/25), done.
remote: Total 87117 (delta 4), reused 6 (delta 0), pack-reused 87092
Receiving objects: 100% (87117/87117), 93.77 MiB | 13.94 MiB/s, done.
Resolving deltas: 100% (57066/57066), done.v
$ cd dolt/go && go install ./cmd/dolt ./cmd/git-dolt ./cmd/git-dolt-smudge

```

This will create a binary named `dolt` at `~/go/bin/dolt`, unless you have `$GO_HOME` set to something other than `~/go`.

### Set your config variables and connect to DoltHub

After installing Dolt, the first thing you should do is set config variables. This is the information that will be used on each Dolt commit that you push. [See CLI reference](../../reference/cli/#dolt-config). If you already have a DoltHub account, just run `dolt login`, which automatically sets the variables for you. This will also prompt you to create and save a new credential key on DoltHub, which allows the CLI to authenticate.

If you don't have a DoltHub account yet, you can set the config variables manually:

```
dolt config --global --add user.name <your name>
dolt config --global --add user.email <your email>
```

After you [sign up for DoltHub](https://dolthub.com/signin), run `dolt login` from the command line to complete authentication.

## Conclusion

One important limitation is we do not support 32-bit architectures. If you need a 32-bit build, or you think we have missed an important software distribution channel please submit an issue and we will take a look promptly.

# Doltpy

Doltpy is a Python API for using Dolt via Python. It wraps the API offered by the Dolt command line interface, and additionally provides utility functions for common operations performed in Dolt. For example, it provides tooling for easily defining a procedure that clones a Dolt database hosted on DoltHub, makes arbitrary changes, commits, and pushes the changes back to DoltHub.

Doltpy is distributed as a Python packages, and thus is available via `pip`.

## `pip install` via PyPi

Doltpy is a package on PyPi, and thus you can install it with `pip install doltpy`:

```
$ pip install doltpy
```

## From Source

For those interested in installing from source, or even development, it's easy enough to clone the GitHub repository and install Doltpy as an editable package:

```
$ git clone git@github.com:dolthub/doltpy.git
Cloning into 'doltpy'...
remote: Enumerating objects: 430, done.
remote: Counting objects: 100% (430/430), done.
remote: Compressing objects: 100% (249/249), done.
remote: Total 733 (delta 212), reused 336 (delta 146), pack-reused 303
Receiving objects: 100% (733/733), 223.94 KiB | 1.17 MiB/s, done.
Resolving deltas: 100% (376/376), done.
$ cd doltpy/
$ pip install -e .
.
.
.
Successfully installed doltpy
```

## Conclusion

Doltpy supports Python 3.7 and 3.8. Older versions of Python may work, though they are not tested. If you find any issues with Doltpy, we'd be grateful for an issue on our GitHub [page](https://github.com/dolthub/doltpy/issues).
