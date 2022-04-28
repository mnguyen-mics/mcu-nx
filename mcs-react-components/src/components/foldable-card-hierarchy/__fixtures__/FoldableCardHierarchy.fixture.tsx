import * as React from 'react';
import FoldableCardHierarchy, { FoldableCardHierarchyResource } from '../FoldableCardHierarchy';

const hierachy: FoldableCardHierarchyResource = {
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
};

export default <FoldableCardHierarchy hierachy={hierachy} />;
