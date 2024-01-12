import { loadEnv } from "vite";
import type { Plugin, ResolvedConfig, HtmlTagDescriptor } from "vite";

interface GetScriptOptions {
  mode: string;
  variables: string | string[];
}

function getScript({ mode, variables }: GetScriptOptions) {
  const scriptLines = ["window._env_={"];

  if (mode === "production") {
    for (let i = 0; i < variables.length; i++) {
      scriptLines.push(`['${variables[i]}']: '\${${variables[i]}}',`);
    }
  } else {
    const env = loadEnv(mode, process.cwd(), variables);
    for (let key in env) {
      scriptLines.push(`['${key}']: ${JSON.stringify(env[key])},`);
    }
  }

  return [...scriptLines, "}"].join("");
}

export interface PluginOptions {
  /**
   * List of environment variables or variable prefixes (case-sensitive).
   * @example ['BASE_URL'] | ['VITE']
   */
  variables: string | string[];
  /**
   * JS file name.
   * @default "runtime-env.js"
   */
  filename?: string;
}

export function runtimeEnvScript({
  variables,
  filename = "runtime-env.js",
}: PluginOptions): Plugin {
  let config: ResolvedConfig;

  return {
    name: "vite-runtime-env-script-plugin",
    enforce: "pre",

    configResolved(resolvedConfig: ResolvedConfig) {
      config = resolvedConfig;
    },

    transformIndexHtml() {
      const htmlTag: HtmlTagDescriptor = { tag: "script" };

      if (config.mode === "production") {
        htmlTag.attrs = { src: `/${filename}` };
      } else {
        htmlTag.children = getScript({
          mode: config.mode,
          variables,
        });
      }

      return [htmlTag];
    },

    generateBundle() {
      const templateContent = getScript({
        mode: config.mode,
        variables,
      });

      this.emitFile({
        type: "asset",
        fileName: `template-${filename}`,
        source: templateContent,
      });
    },
  };
}
