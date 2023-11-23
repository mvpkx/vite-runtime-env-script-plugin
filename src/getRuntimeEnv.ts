export interface EnvConfig {
  [key: string]: string;
}

declare const window: { _env_?: EnvConfig };

export function getRuntimeEnv<T extends keyof EnvConfig>(
  key: keyof EnvConfig
): EnvConfig[T] | undefined {
  return window?._env_?.[key];
}
