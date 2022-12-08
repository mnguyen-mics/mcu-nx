# mediarithmics React components

The mcs-react-components directory of the ux-components repository
contains the definition of our React components. Those definitions
consist of the code of the components, tests about them and fixtures
that are used in order to render them in a mocked environment, using react-cosmos.
Those components will then be used by mediarithmics front clients, like mediarithmics-navigator.

## Prerequisites

System :

- node.js (version >= 8.6.0)
- npm

### optional : set the version of nodejs

We use [nvm](https://github.com/creationix/nvm) to set the nodejs version.

## Developing components

- Clone the ux-components project
- `cd mcs-react-components`
- `npm install`

### Adding and using the library in client project

- Be sure to logged into the mediarithmics registry
  `npm adduser --registry=https://sf-npm.mediarithmics.com/repository/npm-mics/` and connect with you nexus credentials
- Add the following line into your `~/.npmrc` :
  `@mediarithmics-private:registry=https://sf-npm.mediarithmics.com/repository/npm-mics/`
- `npm install @mediarithmics-private/mcs-components-library`
- `'import { InfiniteList } from '@mediarithmics-private/mcs-components-library';` Import a component form library index main entry point
- `import { InfiniteListFilters } from '@mediarithmics-private/mcs-components-library/lib/components/infinite-list';` Import utilities/types exposed in the component itself

### Developing and testing in Navigator

- `cd ~/dev/ux-components/mcs-react-components` go into the library directory
- `npm build` build library
- To build the library you have two options:
  - `npm run build` build in production mode
  - `npm run watch` build in development mode with a watcher
- `npm link` creates global link
- `cd ~/dev/mediarithmics-navigator` go into the navigator directory
- `npm link @mediarithmics-private/mcs-components-library` link-install the package
- `npm start` run navigator locally

### Adding a new component to the library

When adding a new component to the library, the file structure associated to the component must be created.
In order to generate this file structure automatically, you can use the script `generate-component-folder.sh`, passing only the name of the new component (in kebab-case).

#### Component files structure

The file structure is the following. First, a directory named after the component name is created in
`ux-components/mcs-react-components/src/components/`. In this component directory, the structure is the
following, for a component named `MyComponent` :

```
.
├── __fixtures__
│   └── MyComponent.fixture.tsx
├── index.less
├── index.ts
├── MyComponent.tsx
└── __tests__
    └── MyComponent.test.tsx
```

In this example :

- `MyComponent.tsx` contains the code of the React component;
- `index.ts`, which is filled automatically, contains code to deal with the export of the component and its props;
- `index.less` will be used to add style to the component;
- the `__tests__` directory contains the tests of `MyComponent` in its file named `MyComponent.test.tsx`;
- the `__fixtures__` directory contains the fixture of `MyComponent` in `MyComponent.fixture.tsx`, which will be used
  by react-cosmos in order to mock an environment in which the component will be rendered, so that an example of the
  component can be seen.

Concerning class names and BEM methodology, see the [documentation](https://github.com/MEDIARITHMICS/mediarithmics-navigator#bem-methodology) in navigator.

#### Tests

Jest is used for snapshot tests. Jest is also used in conjunction with Enzyme for DOM tests.

The rules for the tests are the following :

- Placed in folder named `__tests__` (ideally next to the tested component);
- File names end with `_.test.ts(x)`.

#### React-Cosmos

We use [react-cosmos](https://github.com/react-cosmos/react-cosmos) as a dev tools for creating reusable React components.

Cosmos scans your project for components and enables you to:

- Render components under any combination of props, context and state;
- Mock every external dependency (eg. API responses, localStorage, etc);
- See app state evolve in real-time while interacting with running instances.

Cosmos looks for `*.fixture.ts(x)` named files and files inside `__fixtures__` dirs.

### Versionning

We follow [semver](https://semver.org/) rules for the versioning.

## Useful npm tasks

- `npm run cosmos` starts react-cosmos;
- `npm run test` run the tests;
- `npm run build` lint, test and build the library.

## Sandbox registry

If you wish to test publication, one can test it on the sandbox registry :

- `npm adduser --registry=https://sf-npm.mediarithmics.com/repository/npm-mics-sandbox/ --scope=@mediarithmics-private` connect with your nexus credentials;
- `npm publish --registry https://sf-npm.mediarithmics.com/repository/npm-mics-sandbox/` publish the library to sandbox registry;
- update mics registry in your `~/.npmrc` to point to `npm-mics-sandbox` instead of `npm-mics`;
- `npm install` to install in your client project (eg navigator).
