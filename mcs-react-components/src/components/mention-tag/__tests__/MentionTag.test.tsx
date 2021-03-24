    import 'jest';
    import * as React from 'react';
    import * as TestRenderer from 'react-test-renderer';
    import MentionTag, { MentionTagProps } from '../MentionTag';
    import { MemoryRouter } from 'react-router';

    it('renders the MentionTag', () => {
      const props: MentionTagProps = {
        mention: 'ALPHA',
        tooltip: 'tooltip'
      };
      const component = TestRenderer.create(
        <MemoryRouter>
          <MentionTag {...props} />
        </MemoryRouter>,
      );
      const res = component.toJSON();
      expect(res).toMatchSnapshot();
    });
