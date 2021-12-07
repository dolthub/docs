# Doltpy Usage

This shows how to execute basic dolt commands using
Dolt's Python libraries.

Note: `doltcli` and `doltpy.cli` are
the same, but we default to `doltcli` in examples because Windows
and Conda users have additional dependency hurdles with `doltpy`.

Source code:

- [Setup and version control commands](https://github.com/dolthub/doltcli/blob/main/doltcli/dolt.py)

- [Standard read and write commands](https://github.com/dolthub/doltcli/blob/main/doltcli/utils.py)

- [Pandas read](https://github.com/dolthub/doltpy/blob/master/doltpy/cli/read.py)

- [Pandas write](https://github.com/dolthub/doltpy/blob/master/doltpy/cli/write.py)

## Setup

### Install

```bash
sudo bash -c 'curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | sudo bash'
pip3 install --user doltcli doltpy
```

### Create Repo

```python
>>> import doltcli as dolt
>>> db = dolt.Dolt.init("new-database-folder")
```

### Clone Repo

```python
>>> import doltcli as dolt
>>> db = dolt.Dolt.clone("max-hoffman/qm9")
```

### Connect to Existing Repo Folder

```python
>>> import doltcli as dolt
>>> db = dolt.Dolt("existing-database-folder")
```

## Version Control Commands

### Checkout New Branch

```python
>>> db.checkout(branch="new_branch", checkout_branch=True)
>>> db.sql("select DOLT_CHECKOUT('-b', 'new_branch')")
```

### Checkout Existing Branch

```python
>>> db.checkout(branch="existing_branch")
>>> db.sql("select DOLT_CHECKOUT('existing_branch')")
```

### Add a Table

```python
>>> db.add("table-to-add")
>>> db.add(".")
Status(is_clean=False, modified_tables={}, added_tables={'test': True})
>>> db.sql("select DOLT_ADD('.')")
```

### Commit a Change

```python
>>> db.commit(message="commit message")
>>> db.sql("select DOLT_COMMIT('-am', 'commit message')")
```

### Reset

```python
>>> db.checkout(".")
>>> db.reset()
>>> db.reset(soft=True)
>>> db.reset(".")
>>> db.reset("a-table")
>>> db.reset(hard=True)
```

### Log

```python
>>> db.log(1)
OrderedDict([('1uhml9dartkb8lndr643blsclgno9kbt', Commit(ref='1uhml9dartkb8lndr643blsclgno9kbt', timestamp='2021-06-24 13:42:37.149 -0700 PDT', author='Max Hoffman', email='max@dolthub.com', message='Initialize data repository', parents='', merge=False))])
>>> db.sql("select * from dolt_log", result_format="csv")
[OrderedDict([('commit_hash', '1uhml9dartkb8lndr643blsclgno9kbt'), ('committer', 'Max Hoffman'), ('email', 'max@dolthub.com'), ('date', '2021-06-24 13:42:37.149 -0700 PDT'), ('message', 'Initialize data repository')])]
```

### Merge

```python
>>> db.merge(branch="master")
```

### Remote

```python
>>> db.remote(name="origin", url="max-hoffman/qm9", add=True)
>>> db.remote(name="origin", url="aws://test-bucket", add=True)
>>> db.remote(name="origin", url="gs://test-bucket", add=True)
```

### Push

```python
>>> db.push(remote="origin", refspec="master")
```

### Pull

```python
>>> db.pull(remote="origin")
```

## Reading/Writing

### File

```python
>>> from doltcli import write_file
>>> write_file(
        dolt=db,
        table="test",
        file_handle=open("test.csv", "r"), # io.Text
        import_mode="create",
    )
>>> write_file(
        dolt=db,
        table="test",
        file="test.csv", # str or pathlib.Path
        import_mode="create",
    )
```

### Dictionary

```python
>>> from doltcli import write_rows
>>> write_rows(
        dolt=db,
        table="test",
        rows=[{"name": "User 1"}],
        import_mode="create",
    )
```

```python
>>> from doltcli import read_rows
>>> read_rows(dolt=db, table="test")
```

### Array

```python
>>> from doltcli import write_columns
>>> write_columns(
        dolt=db,
        table="test",
        columns={"name": ["User 1"]},
        import_mode="create",
    )
```

```python
>>> from doltcli import read_columns
>>> read_columns(dolt=db, table="test")
```

### Pandas

```python
>>> from doltpy.cli.write import write_pandas
>>> df = pd.DataFrame({'name' : ['User 1', 'User 2', 'User 3']})
>>> write_pandas(
        dolt=db,
        table="test",
        df=df,
        import_mode="create",
    )
```

```python
>>> from doltpy.cli.read import read_pandas
>>> df = read_pandas(
             dolt=db,
             table="test",
    )
```
