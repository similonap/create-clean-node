# Express and EJS TypeScript starter

Requires Node.js 24.12.0 or newer.

```sh
npm install
npm start
```

`npm start` watches TypeScript and JSON files with nodemon. Before each start or
restart, it checks the project with `tsc --noEmit`, then runs `index.ts` directly
with Node. Type errors prevent the server from starting; fixing and saving the
file triggers another check. `npm run typecheck` checks types without running the
server, and `npm test` checks types and runs Vitest once. Import test helpers from
`vitest`.

Use ES modules, explicit `.ts` extensions for local imports, and `import type`
for type-only imports. TypeScript syntax that needs transformation, such as enums
or parameter properties, is rejected by the type checker because Node only strips
types. Use `import.meta.dirname` for paths relative to the current module.
