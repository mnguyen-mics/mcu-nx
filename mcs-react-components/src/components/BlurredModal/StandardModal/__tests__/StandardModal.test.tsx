import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import StandardModal, { StandardModalProps } from '../StandardModal';

const onClose = (e: any) => {
  return ;
}

it('renders the StandardModal', () => {
  const props: StandardModalProps = {
    onClose: onClose
  };

  const component = TestRenderer.create(
    <StandardModal {...props}>
      <div>
        This is the Modal Content
      </div>
      </StandardModal>
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
