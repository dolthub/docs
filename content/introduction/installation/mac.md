---
title: Mac 
---

### Homebrew

We publish a Homebrew formula with every release, so Mac users using Homebrew for package management can build Dolt from source with a single command:

```text
$ brew install dolt
==> Downloading https://homebrew.bintray.com/bottles/dolt-0.18.3.catalina.bottle.tar.gz
==> Downloading from https://d29vzk4ow07wi7.cloudfront.net/c03cc532d5045fa090cb4e0f141883685de3765bf1d221e400c750b3ae89e328?response-content-disposition=attachment%3Bfilename%3D%22dolt-0.18.3.catalina.bottle.tar.gz%22&Policy=eyJTdGF0
######################################################################## 100.0%
==> Pouring dolt-0.18.3.catalina.bottle.tar.gz
🍺  /usr/local/Cellar/dolt/0.18.3: 7 files, 56.9MB
```

This will install Dolt as follows:

```text
$ ls -ltr $(which dolt)
lrwxr-xr-x  1 oscarbatori  admin  30 Aug 26 16:49 /usr/local/bin/dolt -> ../Cellar/dolt/0.18.3/bin/dolt
```

### Install Script

For non-Homebrew OSX users, the download script for Linux can be used, as OSX is a `*nix` system. It will download the appropriate binary, and place it in `/usr/local/bin`:

```text
sudo bash -c 'curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | bash'
```