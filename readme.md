# @vicgrk/config

> This lib allows you to load yaml files with environement injection for an easy app config management.

## Install

```sh
npm i --save @vicgrk/config
```

## How to use

This library will automatically load a .env file and inject it into your project environment.

### Configuration file

In the root of your project, create a `configs` directory
Inside this folder, create a `config.yml` file and add some yml content

```yaml
name: My name
foo:
  bar: 0
  environment_injection:
    basic: "{{ env.BASIC }}"
    in_template: "postgres://{{ env.POSTGRES_USER }}:{{ env.POSTGRES_PASSWORD }}@{{ env.POSTGRES_HOST}}:{{ env.POSTGRES_PASSWORD }}/{{ env.POSTGRES_DATABASE }}"
```

### Typescript

```typescript
import { loadConfiguration } from "@vicgrk/config";

interface Configuration {
  name: string;
  foo: {
    bar: number;
    environment_injection: {
      basic: string;
      in_template: string;
    };
  };
}

export const config = loadConfiguration<Configuration>("config.yml");
```

### Javascript

```javascript
// ESM
import { loadConfiguration } from "@vicgrk/config";
export const config = loadConfiguration("config.yml");

// CommonJS
const { loadConfiguration } = require("@vicgrk/config");
const config = loadConfiguration("config.yml");
module.exports = config;
```

## Load other .env files

When loading your configuration, you can pass a list of env files as an array. This example
will try to load 3 env files at the root of your project

```javascript
const config = loadConfiguration("config.yml", [
  ".env",
  ".env.dev",
  ".env.prod",
]);
```
