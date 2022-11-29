import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import FormFieldWrapper, { FormFieldWrapperProps } from '../FormFieldWrapper';
import McsIcon from '../../../mcs-icon';
import { FormItemProps } from 'antd/lib/form';

type Props = FormItemProps & FormFieldWrapperProps;

it('Should render the FormFieldWrapper', () => {
  const props: Props = {
    helpToolTipProps: {
      title: 'This is the tooltip title',
    },
    renderFieldAction: () => {
      return <McsIcon type={'close'} />;
    },
  };
  const component = TestRenderer.create(
    <FormFieldWrapper {...props}>
      <div>Content</div>
    </FormFieldWrapper>,
  );
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});
