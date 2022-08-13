# Yaml-env

> This lib allows you to load yaml files with environement injection for an easy app config management.

## Install

```sh
npm i --save yaml-env
```

## How to use

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
import { loadConfiguration } from "yaml-env";

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
import { loadConfiguration } from "yaml-env";
export const config = loadConfiguration("config.yml");

// CommonJS
const { loadConfiguration } = require("yaml-env");
const config = loadConfiguration("config.yml");
module.exports = config;
```
