# Denow - a Deno wrapper

[Deno](https://deno.land/) is awesome, but one challenge is that you have to
install it machine-wide. This will be a problem whenever there is a breaking
change in Deno. And since a Deno bug fix can be a breaking change for a behavior
someone has come to rely on, this is a real risk for the long-term health of
Deno and Deno users. This can affect both old vs. new versions of a single
project, or trying to build two projects on the same machine.

To fix this problem, Denow will download the specified version of Deno into a
cache and the forward all arguments to it. Use it just like `deno`. Since Denow
is checked directly into your repo, it will never clash with another repo on
your machine or older versions of this repo.

## How to use it

1. Copy `denow` and `denow.cmd` into the root of your repository.
2. Add a `.deno_version` file containing the version you want to use.
3. Instead of running `deno`, run `./denow` (on Mac and Linux or Windows
   PowerShell) or `call denow.cmd` (on Windows cmd).

## Updating Deno

```
./denow run --allow-net --allow-write https://raw.githubusercontent.com/JayBazuzi/denow/main/update-deno.ts
```

## Updating Denow

```
./denow run --allow-net --allow-write https://raw.githubusercontent.com/JayBazuzi/denow/main/update-denow.ts
```

## Clearing the Denow cache

If Denow's cache of Denow binaries ever gets corrupted, or to reclaim disk
space, delete `~/.cache` (on Mac and Linux) or `%LOCALAPPDATA%\denow` (on
Windows).

## Contributing

Contributions welcome!

Please include tests for any feature or bugfix.

Because Batch and Bash are inherently unsafe languages, we bias towards keeping
Denow simple rather than making it feature rich.
