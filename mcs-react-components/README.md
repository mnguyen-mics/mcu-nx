mediarithmics react components
=======================

This is the place were our react components & utilities live.
They are meant to be used by mediarithmics front clients. (eg: mediartihmics-navigator)

Prerequisites
-------------

* node.js (version >= 8.6.0)
* npm

#### optional : set the version of nodejs

We use [nvm](https://github.com/creationix/nvm) to set the nodejs version.

Getting started
---------------

### Developping components

* Clone the ux-components project
* `cd mcs-react-components`
* `npm install`

### Adding and using the library in client project

* Be sure to logged into the mediarithmics registry
`npm adduser --registry=https://sf-npm.mediarithmics.com/repository/npm-mics/` and connect with you nexus credentials
* Add the following line into your `~/.npmrc` : 
`@mediarithmics-private:registry=https://sf-npm.mediarithmics.com/repository/npm-mics/`
* `npm install @mediarithmics-private/mcs-components-library`
* `'import { InfiniteList } from '@mediarithmics-private/mcs-components-library';` Import a component form library index main entry point
* `import { InfiniteListFilters } from '@mediarithmics-private/mcs-components-library/lib/components/InfiniteList';` Import utilities/types exposed in the component itself

Developping and testing in Navigator
---------------

* `cd ~/dev/ux-components/mcs-react-components` go into the library directory
* `npm build` build library
* `npm link` creates global link
* `cd ~/dev/mediarithmics-navigator` go into the navigator directory
* `npm link @mediarithmics-private/mcs-components-library` link-install the package
* `npm start` run navigator locally

Tests
---------------

* Jest for snapshot tests
* Jest + Enzyme for DOM tests

Follow those rules :

* Placed in folder named `__tests__` (ideally next to the tested component)
* File names end with *.test.ts(x)*

React-Cosmos
---------------

We use [react-cosmos](https://github.com/react-cosmos/react-cosmos) as a dev tools for creating reusable React components

Cosmos scans your project for components and enables you to:

* Render components under any combination of props, context and state
* Mock every external dependency (eg. API responses, localStorage, etc)
* See app state evolve in real-time while interacting with running instances

Cosmos looks for `*.fixture.ts(x)` named files and files inside `__fixtures__` dirs

Versionning
---------------

* We follow [semver](https://semver.org/) rules for the versioning

Usefull npm tasks
---------------

* `npm run cosmos` starts react-cosmos
* `npm run test` run the tests
* `npm run build` lint, test and build the library

Sandbox registry
---------------

If you wish to test publication, one can test it on the sandbox registry

* `npm adduser --registry=https://sf-npm.mediarithmics.com/repository/npm-mics-sandbox/` connect with you nexus credentials
* `npm publish --registry https://sf-npm.mediarithmics.com/repository/npm-mics-sandbox/` publish the library to sandbox registry
* update mics registry in your `~/.npmrc` to point to `npm-mics-sandbox` instead of `npm-mics`
* `npm install` to install in your client project (eg navigator)
