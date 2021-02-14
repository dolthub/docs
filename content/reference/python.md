---
title: Python
---

# Python

## Doltpy Overview

Doltpy is a Python API that exposes core Dolt features, as well as tools for common use cases of Dolt. It also facilitates interactions with DoltHub out of the box. Doltpy is open source, and distributed via `pip` on PyPi. You can install it by running `pip install doltpy`. See more detailed installation instructions [here](getting-started/installation).

## Core

### Overview and Example

This `doltpy.core` package contains tools for creating, cloning, and publishing Dolt datasets. We will illustrate using a CSV to create a simple repository, pushing it to DoltHub, and then cloning it, making a change, and pushing the change back to the remote. Here is the data we are going to work with:

```text
$ cat ~/temp/great_players.csv
name,id
rafa,1
roger,2
novak,3
```

First, let's initialize a new repository and write a basic CSV

```python
from doltpy.core import Dolt
from doltpy.core.write import bulk_import

repo = Dolt.init('~/temp/tennis-players')
bulk_import(repo, 'great_players', open('path/to/great_players.csv'), ['id'], 'create')
repo.add('great_players')
repo.commit('Added some great players')
repo.remote(add=True, name='origin', url='dolthub/great-players-example')
repo.push('origin', 'master')
```

I already created this repository, you can check it out on [DoltHub](https://www.dolthub.com/repositories/dolthub/great-players-example). To clone and make changes is also straight forward, let's start with an update to our data:

```text
$ cat ~/temp/great_players.csv
name,id
rafa,1
roger,2
novak,3
andy,4
```

Now let's clone the repo and import the updated data:

```python
from doltpy.core import Dolt
from doltpy.core.write import bulk_import

repo = Dolt.clone('dolthub/great-players-example')
bulk_import(repo, 'great_players', open('path/to/great_players.csv'), ['id'], 'update')
repo.add('great_players')
repo.commit('Added some great players')
repo.remote(add=True, name='origin', url='dolthub/great-players-example')
repo.push('origin', 'master')
```

And we are done. This exact sequence of updates was executed on the example repo, and you can see the [commit log](https://www.dolthub.com/repositories/dolthub/great-players-example), and [diff](https://www.dolthub.com/repositories/dolthub/great-players-example/compare/ht24tetekl12hmek03e6ldl0hbqm8l93).

### Full API

See doc strings on [GitHub](https://github.com/dolthub/doltpy/blob/master/doltpy/core/dolt.py).

## ETL

### Overview and Example

The `doltpy.etl` package contains tooling for ETL workflows that write or transform data in Dolt. We will show a simple example of pulling from a free API for FX rates, and then transforming the data into moving averages. This code is taken almost verbatim from an ETL job that actually writes to [this repository](https://www.dolthub.com/repositories/oscarbatori/fx-test-data).

First we setup some get that gets the data, returning a `pandas.DataFrame` with the JSON flattened into a table structure:

```python
import pandas as pd
import requests

def get_data() -> pd.DataFrame:
    r = requests.get(URL)
    if r.status_code == 200:
        data = r.json()
        exchange_rates = data['rates']
        return pd.DataFrame([{'currency': currency, 'rate': rate, 'timestamp': data['timestamp']}
                             for currency, rate in exchange_rates.items()])
    else:
        raise ValueError('Bad request, return code {}'.format(r.status_code))
```

Next we define code to write this to a table. `doltpy.etl` provides code to do this:

```python
from doltpy.etl import get_df_table_writer

raw_data_writer = get_df_table_writer('eur_fx_rates', get_data, ['currency', 'timestamp'])
```

Note that we pass our `get_data` function to `get_df_table_writer` which itself returns a function. The motivation for this is creating ETL workflows one often wants to import code before it's executed, thus we build a function that will perform the load, but delay executing it. If we wanted to execute it immediately we could just do:

```python
from dolt.core import Dolt

repo = Dolt('path/to/my/repo')
raw_data_writer(repo)
```

Often we want to define a loader for a number of tables in a repo. The loader abstraction takes a collection of `DoltTableWriter` functions and executes them sequentially. Define one as follows:

```python
from doltpy.etl import get_dolt_loader
from datetime import datetime

loader = get_dolt_loader([raw_data_writer],
                         commit=True,
                         message='Updated raw FX rates for date {}'.format(datetime.now()),
                         branch='master')
```

Notice that we passed a collection containing the table writer we just defined. We also define repository level considerations \(which branch to write to, whether to commit, and commit message\). All table writers executed by this loader will have their results attached to the commit this code generates. You can execute collections of loaders in the event you want to generate more than a single commit. For example, suppose we want to compute moving averages on our complete FX dataset, including the most recent load. In that case we need to read the whole table after the load:

```python
from doltpy.etl import get_table_transfomer
from doltpy.core.read import read_table

def get_raw_fx_rates(repo: Dolt):
    return read_table(repo, 'eur_fx_rates')

def get_average_rates(df: pd.DataFrame) -> pd.DataFrame:
    logger.info('Computing moving averages of currency rates')
    return df.groupby('currency').mean().reset_index()[['currency', 'rate']].rename(columns={'rate': 'average_rate'})

transformed_table_writer = get_table_transfomer(get_raw_fx_rates, 'eur_fx_rate_averages', ['currency'], get_average_rates)]
```

Here we defined our `get_data` function to read from the table `raw_data_writer` is configured to write to. To ensure that `raw_data_writer` executes first, we can define our loaders as follows:

```python
from doltpy.etl import get_dolt_loader
from datetime import datetime

loaders = [get_dolt_loader([raw_data_writer],
                           commit=True,
                           message='Updated raw FX rates for date {}'.format(datetime.now()),
                           branch='master'),
           get_dolt_loader([transformed_table_writer],
                           commit=True,
                           message='Updated FX averages for date {}'.format(datetime.now()),
                           branch='master')]
```

This will generate two commits, each showing the precise update.

### Full API

See doc strings on [GitHub](https://github.com/dolthub/doltpy/blob/master/doltpy/etl/loaders.py).

## SQL Sync

We provide a library for syncing between Dolt and existing relational database implementations. Usage is covered in an extensive example in the [guides section](../guides/sql-sync).
