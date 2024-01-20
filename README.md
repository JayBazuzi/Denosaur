# denosaur - a Deno wrapper

[Deno](https://deno.land/) is awesome, but you have to install it machine-wide.
This will be a problem whenever there is a breaking change in Deno. It is also
an extra step before you can build a Deno repo, which violates the principle
that it should be trivial to clone and build any repo without special knowledge
about how that repo works.

To fix this problem, Denosaur will download the specified version of Deno into a
cache and the forward all arguments to it. Use it just like `deno`. Since
Denosaur is checked directly into your repo, it will never clash with another
repo on your machine or older versions of this repo.

## Getting Started

1. Copy `denosaur.sh` and `denosaur.cmd` into the root of your repository and
   name them `deno` and `deno.cmd` respectively.
2. Add a `.deno_version` file containing the version you want to use. (Include
   the `v` prefix.)

## Updating Deno

Edit your `.deno_version` file to indicate the new version. (Include the `v`
prefix.)

## Updating Denosaur

Copy the latest `denosaur` / `denosaur.cmd` into your repository as described in
Getting Started.

## Clearing the Denosaur cache

If Denosaur's cache of deno binaries ever gets corrupted, or to reclaim disk
space, delete `~/.cache/denosaur` (on Mac and Linux) or
`%LOCALAPPDATA%\denosaur` (on Windows).

## Why are breaking changes such a problem?

As Deno improves there will inevitably be breaking changes.

If I have multiple repositories on my machine that use different versions of
Deno, I have to switch Denos every time I switch projects.

Even with a single repository, if I check out an old release tag I may cross the
boundary of a breaking change, requiring that I switch Deno versions each time.

For the long-term health of projects built with Deno, it's important that
repositories be able to build and run with the exact (old) version of Deno they
were authored with.

## Contributing

Contributions welcome!

Please include tests for any feature or bugfix.

Because Batch and Bash are inherently hazardous languages, we bias towards
keeping Denosaur simple rather than making it feature rich.
