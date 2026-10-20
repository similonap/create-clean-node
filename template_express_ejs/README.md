# Express and EJS TypeScript starter

Requires Node.js 24.12.0 or newer.

```sh
npm install
npm start
```

`npm start` checks the project with `tsc --noEmit`, then runs `index.ts` directly
with `node --watch`. Type errors prevent the server from starting. Once running,
Node restarts the server when `index.ts` or any module it imports changes, without
checking types again. `npm run typecheck` checks types without running the server,
and `npm run typecheck:watch` rechecks them whenever a file changes; run it in a
second terminal alongside `npm start`. `npm test` checks types and runs Vitest
once. Import test helpers from `vitest`.

Use ES modules, explicit `.ts` extensions for local imports, and `import type`
for type-only imports. TypeScript syntax that needs transformation, such as enums
or parameter properties, is rejected by the type checker because Node only strips
types. Use `import.meta.dirname` for paths relative to the current module.
