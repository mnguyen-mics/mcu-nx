#!/bin/sh

set -eu

echo "Enter your component name (in kebab-case) : "
read -r componentName
if [ -n "$componentName" ]
then
    KEBAB_CASE_COMPONENT=$componentName
    PASCAL_CASE_COMPONENT=$(echo "$componentName"|sed -r 's/(^|-)([a-z])/\U\2/g')

#### Base component
    mkdir mcs-react-components/src/components/"$KEBAB_CASE_COMPONENT"
    touch mcs-react-components/src/components/"$KEBAB_CASE_COMPONENT"/"$PASCAL_CASE_COMPONENT".tsx
    touch mcs-react-components/src/components/"$KEBAB_CASE_COMPONENT"/index.less
    cat <<EOF > mcs-react-components/src/components/"$KEBAB_CASE_COMPONENT"/index.ts
    import $PASCAL_CASE_COMPONENT from './$PASCAL_CASE_COMPONENT';

    export { ${PASCAL_CASE_COMPONENT}Props } from './$PASCAL_CASE_COMPONENT';

    export default $PASCAL_CASE_COMPONENT;
EOF

#### Fixtures
    mkdir mcs-react-components/src/components/"$KEBAB_CASE_COMPONENT"/__fixtures__
    cat <<EOF > mcs-react-components/src/components/"$KEBAB_CASE_COMPONENT"/__fixtures__/"$PASCAL_CASE_COMPONENT".fixture.tsx

    import * as React from 'react';
    import $PASCAL_CASE_COMPONENT, { ${PASCAL_CASE_COMPONENT}Props } from '../$PASCAL_CASE_COMPONENT';

    const props: ${PASCAL_CASE_COMPONENT}Props = {};

    const component = (_props: ${PASCAL_CASE_COMPONENT}Props) => <$PASCAL_CASE_COMPONENT {..._props} />;

    component.displayName = "$PASCAL_CASE_COMPONENT";

    export default {
      component,
      props,
    };
EOF

#### Tests
    mkdir mcs-react-components/src/components/"$KEBAB_CASE_COMPONENT"/__tests__
    cat <<EOF > mcs-react-components/src/components/"$KEBAB_CASE_COMPONENT"/__tests__/"$PASCAL_CASE_COMPONENT".test.tsx
    import 'jest';
    import * as React from 'react';
    import * as TestRenderer from 'react-test-renderer';
    import ${PASCAL_CASE_COMPONENT}, { ${PASCAL_CASE_COMPONENT}Props } from '../${PASCAL_CASE_COMPONENT}';

    it('renders the ${PASCAL_CASE_COMPONENT}', () => {
      const props: ${PASCAL_CASE_COMPONENT}Props = {};
      const component = TestRenderer.create(
        <${PASCAL_CASE_COMPONENT} {...props} />,
      );
      const res = component.toJSON();
      expect(res).toMatchSnapshot();
    });
EOF

fi
