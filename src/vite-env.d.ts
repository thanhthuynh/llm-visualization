/**
 * Globals injected by vite.config.ts via `define`.
 */
declare const __BUILD_COMMIT__: string

/**
 * Vite/Vitest environment variables available via import.meta.env.
 * VITEST is set to true when tests run under Vitest.
 */
interface ImportMeta {
  readonly env: {
    readonly VITEST?: boolean
    readonly MODE: string
    readonly BASE_URL: string
    readonly PROD: boolean
    readonly DEV: boolean
    readonly SSR: boolean
    [key: string]: unknown
  }
}
