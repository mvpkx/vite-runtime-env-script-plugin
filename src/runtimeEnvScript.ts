import { HtmlTagDescriptor, ResolvedConfig, Plugin, loadEnv } from "vite";

interface GetChildrenOptions {
  mode: string;
  html: boolean;
  envPrefix?: string | string[];
}

function getChildren({ mode, html, envPrefix }: GetChildrenOptions) {
  const env = loadEnv(mode, process.cwd(), envPrefix);

  const envScript = ["window._env_={"];

  for (let key in env) {
    const value = html ? JSON.stringify(env[key]) : `\$${key}`;
    envScript.push(`['${key}']: ${value},`);
  }

  return [...envScript, "}"].join("");
}
export interface PluginOptions {
  /**
   * List of environment variable prefixes (case-sensitive).
   * @example ['VITE']
   */
  envPrefix?: string | string[];
  prod?: {
    /**
     * JS file name.
     * @default "runtime-env.js"
     */
    src?: string;
    /**
     * Build mode.
     * @default "production"
     */
    mode?: string;
    /**
     * Additional script element attributes.
     */
    attrs?: HtmlTagDescriptor["attrs"];
  };
}

export function runtimeEnvScript(options?: PluginOptions): Plugin {
  const { envPrefix, prod }: PluginOptions = {
    prod: {
      src: "runtime-env.js",
      mode: "production",
      ...options?.prod,
    },
    ...options,
  };

  let config: ResolvedConfig;

  return {
    name: "vite-runtime-env-script-plugin",
    enforce: "pre",

    configResolved(resolvedConfig: ResolvedConfig) {
      config = resolvedConfig;
    },

    transformIndexHtml() {
      const htmlTag: HtmlTagDescriptor = { tag: "script" };

      if (config.mode === prod.mode) {
        htmlTag.attrs = { src: prod.src, ...prod.attrs };
      } else {
        htmlTag.children = getChildren({
          mode: config.mode,
          envPrefix,
          html: false,
        });
      }
      return [htmlTag];
    },

    generateBundle() {
      const templateContent = getChildren({
        mode: config.mode,
        envPrefix,
        html: true,
      });

      this.emitFile({
        type: "asset",
        fileName: prod.src,
        source: templateContent,
      });
    },
  };
}
