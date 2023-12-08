# vite-runtime-env-script-plugin

A plugin created to simplify the deployment process: there is no need to build a docker image every time you change environment variables.

## Installation

```console
yarn add vite-runtime-env-script-plugin
```

```console
npm install vite-runtime-env-script-plugin
```

## Usage

Add `runtimeEnvScript` plugin to `vite.config.js / vite.config.ts` and provide a list of environment variable names:

```js
// vite.config.js / vite.config.ts
import { runtimeEnvScript } from "vite-runtime-env-script-plugin";

export default {
  plugins: [runtimeEnvScript({ variables: ["BASE_URL"] })],
};
```

To access the environment variables use the built-in getter:

```ts
import { getRuntimeEnv } from "vite-runtime-env-script-plugin/getRuntimeEnv";

const baseURL = getRuntimeEnv("BASE_URL");
```

## Dockerfile

```Dockerfile
CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/template-runtime-env.js > /usr/share/nginx/html/runtime-env.js && nginx -g \"daemon off;\""]
```
