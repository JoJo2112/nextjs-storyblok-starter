// Bundler-provided `require.context` (Turbopack and webpack), for
// util/component-factory.ts.
interface RequireContext {
  keys(): string[];
  (id: string): unknown;
}

declare namespace NodeJS {
  interface Require {
    context(
      directory: string,
      useSubdirectories?: boolean,
      regExp?: RegExp
    ): RequireContext;
  }
}
