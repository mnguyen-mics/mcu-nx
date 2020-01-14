import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import BlurredModal, { BlurredModalProps } from '../BlurredModal';

const onClose = (e: any) => {
    return ;
}

it('renders the BlurredModal', () => {
  const props: BlurredModalProps = {
    opened: false,
    blurred: true,
    formId: 'formID',
    footer: <div>This is the footer</div>,
    onClose: onClose
  };

  const component = TestRenderer.create(
    <BlurredModal {...props} />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
