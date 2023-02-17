# Build from Source

For those interested in building from source, clone the [Dolt repo from GitHub](https://github.com/dolthub/dolt) and use `go install`. Note, you must have [Golang installed](https://go.dev/doc/install) on the machine you are compiling on.

```
$ git clone git@github.com:dolthub/dolt.git
Cloning into 'dolt'...
remote: Enumerating objects: 25, done.
remote: Counting objects: 100% (25/25), done.
remote: Compressing objects: 100% (25/25), done.
remote: Total 87117 (delta 4), reused 6 (delta 0), pack-reused 87092
Receiving objects: 100% (87117/87117), 93.77 MiB | 13.94 MiB/s, done.
Resolving deltas: 100% (57066/57066), done.v
$ cd dolt/go && go install ./cmd/dolt
```

This will create a binary named `dolt` at `~/go/bin/dolt`, unless you have `$GO_HOME` set to something other than `~/go`.
