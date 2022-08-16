# @vicgrk/config

> This lib allows you to load yaml files with environement injection for an easy app config management.

**Warning: I developped this lib to be included in your source control repository ! This is why you never should sensitive informations (like secrets, API keys, ...) in it and why I included a environment injector.**

## Install

```sh
npm i --save @vicgrk/config
```

## How to use

In the root of your project, create a `configs` directory.

### Basic usage

The simpliest way of using this lib is to create a yml file inside your newly created directory (in my case, I called it `basic.yml`)

```yaml
name: My name
foo:
  bar: 0
```

Now in typescript, you can import your configuration with the `loadConfiguration` function with the filename of your yaml files :

```typescript
import { loadConfiguration } from "@vicgrk/config";

interface Configuration {
  name: string;
  foo: {
    bar: number;
  };
}

export const config = loadConfiguration<Configuration>("basic.yml");
console.log(config.name); // expected: My name
console.log(config.foo.bar); // expected: 0
```

The library is transpiled to es module and CommonJS so you can also use it in javascript no matter your build configuration

```javascript
// ESM
import { loadConfiguration } from "@vicgrk/config";
export const config = loadConfiguration("basic.yml");

// CommonJS
const { loadConfiguration } = require("@vicgrk/config");
const config = loadConfiguration("basic.yml");
module.exports = config;
```

You can create config files in subdirectories of your `configs` folder and import them by pointing the relative path of the config

```typescript
loadConfiguration("subfolder/config.yml");
```

### Environment Injection

To access sentive data with the type security, we can defined your template with environement variable relations.
Let's create a `config_with_env.yml` file in your `configs` folder

```yml
foo:
  bar: "{{ env.MY_ENVIRONMENT_VARIABLE }}"
```

Now in typescript:

```typescript
import { loadConfiguration } from "@vicgrk/config";

interface Configuration {
  foo: {
    bar: string;
  };
}

export const config = loadConfiguration<Configuration>("config_with_env.yml");
console.log(config.foo.bar); // expected to equal the value of process.env.MY_ENVIRONMENT_VARIABLE
```

You can also populate long strings like DSNs

```yml
redis:
  dsn: "redis://{{ env.REDIS_USER }}:{{ env.REDIS_PASSWORD }}@{{ env.REDIS_HOST }}:{{ env.REDIS_PORT }}"
```

this will return `redis://user:password@localhost:6379` with this given environment variables

```env
REDIS_USER=user
REDIS_PASSWORD=password
REDIS_HOST=localhost
REDIS_PORT=6379
```

You can also provide default values for your environment variables with `{{ env.MY_ENVIRONMENT:default_value }}`

## Type convertion

All string values present in your configuration are converted in numbers, boolean, according to this table

| Example value | Parsed type |
| ------------- | ----------- |
| "TEST"        | `string`    |
| ""            | `string`    |
| "233"         | `number`    |
| "233n"        | `BigNumber` |
| "true"        | `boolean`   |
| "false"       | `boolean`   |
| "null"        | `null`      |
| "undefined"   | `undefined` |

## .env files

I included a fork of `dotenv` npm package to include your .env file without any other action. By default, only the `.env` file is loaded However, you can set other env files to import :

```typescript
const config = loadConfiguration("config.yml", [
  ".env",
  ".env.dev",
  ".env.prod",
]);

// Or load 0 .env files :
const config = loadConfiguration("config.yml", []);
```

**WARNING: Environment injection is done synchrouslly so it's only loaded once for performance, make sure you load you're file in your global config if you use multiple config files (and thus config variables)**
