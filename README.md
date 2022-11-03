[![npm version](https://badge.fury.io/js/systelab-wdio-builder.svg)](https://badge.fury.io/js/systelab-wdio-builder)

# systelab-wdio-builder

Angular builder for running e2e tests using webdriver.io runner. Fork from [@migalons/angular-wdio-builder](https://github.com/migalons/angular-wdio-builder) repository (not maintained).

Enables including a WDIO launcher into Angular workspace (angular.json).

## Peer dependencies

- _@wdio/cli_

WDIO client is not installed. You must install this package by yourself, among other related packages (@wdio/async, services, plugins, etc.)

## Requirements

- @angular/cli >= @14.0.0

## Usage

### Install 

npm install systelab-wdio-builder --save-dev

### Angular workspace

For enabling your e2e test using angular builders, you just need to use this builder for running your e2e test:

```
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "my-awesome-project": {
      ...
      "architect": {
        ...
        "e2e": {
          "builder": "systelab-wdio-builder:test",
          "options": {
            "wdioConfig": "e2e/wdio.conf.js",
            "devServerTarget": "my-awesome-project:serve"
          },
          "configurations": {
            "production": {
              "wdioConfig": "e2e/wdio-prod.conf.js",
              "devServerTarget": "my-awesome-project:serve:production"
            },
            "dev": {
              "wdioOptions": {
                  "port": 4567  // whatever options accepted by wdio cli
              }
              "devServerTarget": "my-awesome-project:serve:production",
              "port": 4201,
              "host": "0.0.0.0",
              "disableHostCheck: true"
            }
          }
        }
      }
    }
  ...
}
```

This builders, accepts three parameters:

- wdioConfig: URL for WDIO CLI configuration (defaults to "./e2e/wdio.conf.js).
- wdioOptons: Custom options for overriding provided configuration (wdioConfig). See [wdio cli options](https://webdriver.io/docs/clioptions.html) for more information.
- devServerTarget: Project target and configuration to be scheduled before running e2e test (i.e. serve app).
- port: Serve angular application using a custom port
- host: Host to listen on
- disableHostCheck: Don't verify connected clients are part of allowed hosts.

