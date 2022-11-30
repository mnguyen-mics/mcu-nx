import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import StandardModal, { StandardModalProps } from '../StandardModal';

const onClose = (e: React.MouseEvent) => {
  return;
};

it('renders the closed StandardModal', () => {
  const props: StandardModalProps = {
    onClose: onClose,
    opened: false,
  };

  const component = TestRenderer.create(
    <StandardModal {...props}>
      <div>This is the Standard Modal Content</div>
    </StandardModal>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
