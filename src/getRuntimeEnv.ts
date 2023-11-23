export interface EnvConfig {
  [key: string]: string;
}

export function getRuntimeEnv<T extends keyof EnvConfig>(
  key: keyof EnvConfig
): EnvConfig[T] | undefined {
  const _window = (globalThis as any).window as { env?: EnvConfig };
  if (_window?.env) {
    return _window.env[key];
  }
  if (globalThis.process?.env) {
    return globalThis.process.env[key];
  }
}
