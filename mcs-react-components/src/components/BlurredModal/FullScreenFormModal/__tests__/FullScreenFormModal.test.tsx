import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import FullScreenFormModal, {
  FullScreenFormModalProps,
} from '../FullScreenFormModal';

it('renders the FullScreenModal', () => {
  const props: FullScreenFormModalProps = {
    opened: true,
    blurred: true,
  };

  const component = TestRenderer.create(<FullScreenFormModal {...props} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
