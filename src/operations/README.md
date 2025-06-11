# Operations Layer

This directory contains high level wrappers around `api()`.

## Adding a new helper

1. Create a new `.ts` file under the relevant resource folder (e.g. `boards/`).
2. Export your function and any public types from that file.
3. Re-export the helper in `operationsClient.ts` so consumers can use it through the factory.

Helpers should accept an `api` function as the first argument and return typed
results. See existing files for examples.
