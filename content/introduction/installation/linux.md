# Linux

For Linux users we provide an installation script that will detect your architecture, download the appropriate binary, and place in `/usr/local/bin`:

```
sudo bash -c 'curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | sudo bash'
```

The use of `sudo` is required to ensure the binary lands in your path. The script can be examined before executing should you have any concerns.
