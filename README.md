# advanced-components

Library to share common complex components across multiple applications:
They are meant to be used by mediarithmics front clients. (eg: mediarithmics-navigator)

## Prerequisites

- node.js (version >= 8.6.0)
- npm

#### optional : set the version of nodejs

We use [nvm](https://github.com/creationix/nvm) to set the nodejs version.

## Getting started

### Developing components

- Clone the advanced-components project
- `npm install`

### Adding and using the library in client project

- Be sure to logged into the mediarithmics registry
  `npm adduser --registry=https://sf-npm.mediarithmics.com/repository/npm-mics/` and connect with you nexus credentials
- Add the following line into your `~/.npmrc` :
  `@mediarithmics-private:registry=https://sf-npm.mediarithmics.com/repository/npm-mics/`
- `npm install @mediarithmics-private/advanced-components`
- `'import { TopBar, Logo } from '@mediarithmics-private/advanced-components'` Import a component form library index main entry point


## Developing and testing in Navigator

- `cd ~/dev/advanced-components` go into the library directory
- `npm build` build library
- To build the library you have two options:
  - `npm run build` build in production mode
  - `npm run dev:watch` build in development mode with a watcher
- `npm link` creates global link
- `cd ~/dev/mediarithmics-navigator` go into the navigator directory
- `npm link @mediarithmics-private/advanced-components` link-install the package
- `npm start` run navigator locally

Adding a new component to the library can be tedious, especially the creation of the file structure (with the tests, the fixtures folders and files). To generate those, you can use the script `generate-component-folder.sh`, passing only the name of the new component (in kebab-case).

## Tests

- Jest for snapshot tests
- Jest + Enzyme for DOM tests

Follow those rules :

- Placed in folder named `__tests__` (ideally next to the tested component)
- File names end with _.test.ts(x)_

## React-Cosmos

We use [react-cosmos](https://github.com/react-cosmos/react-cosmos) as a dev tools for creating reusable React components

Cosmos scans your project for components and enables you to:

- Render components under any combination of props, context and state
- Mock every external dependency (eg. API responses, localStorage, etc)
- See app state evolve in real-time while interacting with running instances

Cosmos looks for `*.fixture.ts(x)` named files and files inside `__fixtures__` dirs

## Versionning

- We follow [semver](https://semver.org/) rules for the versioning

## Useful npm tasks

- `npm run cosmos` starts react-cosmos
- `npm run test` run the tests
- `npm run build` lint, test and build the library

## Sandbox registry

If you wish to test publication, one can test it on the sandbox registry

- `npm adduser --registry=https://sf-npm.mediarithmics.com/repository/npm-mics-sandbox/ --scope=@mediarithmics-private` connect with you nexus credentials
- `npm publish --registry https://sf-npm.mediarithmics.com/repository/npm-mics-sandbox/` publish the library to sandbox registry
- update mics registry in your `~/.npmrc` to point to `npm-mics-sandbox` instead of `npm-mics`
- `npm install` to install in your client project (eg navigator)
