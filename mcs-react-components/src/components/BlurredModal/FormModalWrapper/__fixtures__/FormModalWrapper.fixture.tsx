import * as React from 'react';
import FormModalWrapper, { FormModalWrapperProps } from '../FormModalWrapper';

const onClose = (e: any) => {
  return ;
}

const props: FormModalWrapperProps = {
  formId: 'formID',
  onClose: onClose,
  footer: <div>This is the footer</div>
};

const component = (_props: FormModalWrapperProps) => (
  <FormModalWrapper {..._props}>
    <div>
      This is the Modal Content
    </div>
  </FormModalWrapper>
);

export default {
  component,
  props,
};
