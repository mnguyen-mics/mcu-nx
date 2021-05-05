import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import BlurredModal, { BlurredModalProps } from '../BlurredModal';

const onClose = (e: React.MouseEvent) => {
  return;
};

it('renders the BlurredModal', () => {
  const props: BlurredModalProps = {
    opened: false,
    blurred: true,
    formId: 'formID',
    onClose: onClose,
  };

  const component = TestRenderer.create(<BlurredModal {...props} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
