import { HtmlTagDescriptor, ResolvedConfig, loadEnv } from "vite";

declare const process: any;

interface PluginOptions {
  envPrefix?: string | string[];
  prod?: {
    src?: string;
    mode?: string;
    attrs?: HtmlTagDescriptor["attrs"];
  };
}

export const runtimeEnvScript = (options?: PluginOptions) => {
  const { envPrefix, prod }: PluginOptions = {
    envPrefix: "VITE",
    prod: {
      src: "runtime-env.js",
      mode: "production",
      ...options?.prod,
    },
    ...options,
  };
  let config: ResolvedConfig;

  const getChildren = (mode: string) => {
    const env = loadEnv(mode, process.cwd(), envPrefix);
    const envScript = ["window._env_={"];
    for (let key in env) {
      envScript.push(`${key}: ${JSON.stringify(env[key])},`);
    }
    return [...envScript, "}"].join("");
  };

  return {
    name: "vite-runtime-env-script-plugin",
    enforce: "pre" as const,
    configResolved: (resolvedConfig: ResolvedConfig) => {
      config = resolvedConfig;
    },
    transformIndexHtml: () => {
      const htmlTag: HtmlTagDescriptor = { tag: "script" };
      if (config.mode === prod.mode) {
        htmlTag.attrs = { src: prod.src, ...prod.attrs };
      } else {
        htmlTag.children = getChildren(config.mode);
      }
      return [htmlTag];
    },
  };
};
