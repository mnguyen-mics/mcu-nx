import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import FoldableCardHierarchy, { FoldableCardHierarchyProps } from '../FoldableCardHierarchy';

it('renders the FoldableCardHierarchy', () => {
  const props: FoldableCardHierarchyProps = {
    hierachy: {
      foldableCard: {
        isDefaultActive: false,
        header: 'Org1',
        body: 'someOrg1Users',
      },
      children: [
        {
          foldableCard: {
            isDefaultActive: true,
            header: 'Org1.1',
            body: (
              <div>
                <div>someOrg11Users</div>
                <div>someOrg11Users</div>
              </div>
            ),
          },
          children: [
            {
              foldableCard: {
                isDefaultActive: false,
                header: 'Org1.1.1',
                body: 'someOrg111Users',
              },
              children: [],
            },
          ],
        },
        {
          foldableCard: {
            isDefaultActive: false,
            header: 'Org1.2',
            body: 'someOrg12Users',
          },
          children: [],
        },
      ],
    },
  };
  const component = TestRenderer.create(<FoldableCardHierarchy {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});
