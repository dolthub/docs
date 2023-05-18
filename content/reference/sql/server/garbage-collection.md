---
title: Garbage Collection
---

# When to run garbage collection on your SQL server

it is now safe, but it breaks all open connections to a running server
--shallow kind of happens in normal operation
so it won't do much
don't think it's safe on a cluster replica, but will fail

# Offline GC vs online GC

# Automated GC

suggest an event to do it
and we will eventually support automated gc
when it can be interruptable

# How online garbage collection works
