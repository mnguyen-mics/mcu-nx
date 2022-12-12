import React from 'react';
import FullScreenModal, { FullScreenFormModalProps } from '../full-screen-form-modal';
import FormModalWrapper, { FormModalWrapperProps } from '../form-modal-wrapper';

export interface BlurredModalProps extends FullScreenFormModalProps, FormModalWrapperProps {}

export default class BlurredModal extends React.Component<BlurredModalProps, any> {
  public render() {
    const { opened, formId, onClose, footer, className, children } = this.props;
    return (
      <FullScreenModal opened={opened} blurred={true} className={className ? className : ''}>
        <FormModalWrapper formId={formId} onClose={onClose} footer={footer}>
          {children}
        </FormModalWrapper>
      </FullScreenModal>
    );
  }
}
