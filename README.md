# create-clean-node

Create a Node.js or Express/EJS project with native TypeScript execution,
type checking before startup, and Vitest tests. Use Node.js 24.12.0 or newer.

## Test the local generator

From this repository, install its dependencies and link the CLI:

```sh
npm install
npm link
```

From the directory where you want to create a project:

```sh
create-clean-node my-app --projectType "Node.js"
cd my-app
npm test
npm start
```

Use `--projectType "Express.js"` for the Express/EJS template, or omit the options
to use the interactive prompts. The `create-my-template` command remains an alias.

The link uses this checkout, so edits to the generator or templates are available
the next time you create a project. Template `node_modules` directories are skipped;
each generated project installs its own dependencies.

If you switch Node versions with nvm, run `npm link` again in this repository for
that Node installation. To remove the local CLI link, run:

```sh
npm unlink --global create-clean-node
```
