# TestRPG - tests

This folder contains all testware as part of the assessment for TestCoders, by Erik van Deursen. It's a fork from the TestRPG repo.

## Specs

There are 3 specs covering functionality on the home and play pages:

1. play.e2e.ts: Open home page and navigate to play page, fill in character and adventure screens (happy flow)
2. validation.e2e.ts: Open login modal and navigate to play page, log out, validate on errors (error flow)
3. berserk.e2e.ts: Open play page and activate berserk mode :)

## Stack

WebdriverIO 9 & Jasmine

- "@wdio/globals": "^9.28.0",
- "@wdio/local-runner": "^9.28.0",
- "@wdio/jasmine-framework": "^9.29.0",
- "@wdio/spec-reporter": "^9.28.0",

Node is set to the latest LTS, using NVM (.nvmrc)

## Project structure

The project contains the following folders:

- /assets: Text file used for upload function
- /config: WDIO config file
- /feature: Locators and page helper functions
- /page: Class containing a method to access the url
- /specs: Contain the E2E specs files with test steps
- /utils: Utility functions

## Getting started

Use the following commands to run the specs:

- `pnpm run wdio:local`: Run all specs with default config locally
- `pnpm run wdio:ci`: Run all specs with CI config (headless)
- `pnpm run wdio:<local/ci> --spec=<tests/spec/filename>`: Run a single spec by passing in relative path and filename

## Additional commands

For code quality purposes, several other commands are available as well:
- `pnpm run format`: Format all files in the tests folder using Prettier
- `pnpm run lint`: Lint all files in the tests folder using ESLint
