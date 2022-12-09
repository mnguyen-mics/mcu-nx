import 'jest';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import FormModalWrapper, { FormModalWrapperProps } from '../FormModalWrapper';

const onClose = (e: React.MouseEvent) => {
  return;
};

it('renders the FormModalWrapper', () => {
  const props: FormModalWrapperProps = {
    formId: 'formID',
    onClose: onClose,
  };

  const component = TestRenderer.create(<FormModalWrapper {...props} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
