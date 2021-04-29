import * as React from 'react';
import FormFieldWrapper, { FormFieldWrapperProps } from '../FormFieldWrapper';
import McsIcon from '../../../mcs-icon';
import { Input } from 'antd';
import { FormItemProps } from 'antd/lib/form';

type Props = FormItemProps &
FormFieldWrapperProps

const props: Props = {
  helpToolTipProps: {
    title: 'This is the tooltip title',
  },
  renderFieldAction: () => {
    return <McsIcon type={'close'} />;
  },
  label: 'Label',
  
};

export default (
  <FormFieldWrapper {...props}>
    <Input />
  </FormFieldWrapper>
);
