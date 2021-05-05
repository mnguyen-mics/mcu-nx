import * as React from 'react';
import FullScreenModal, { FullScreenFormModalProps } from '../full-screen-form-modal';
import { FormModalWrapperProps } from '../form-modal-wrapper';
import { Omit } from '../../../utils/Types';

export interface StandardModalProps
  extends FullScreenFormModalProps,
    Omit<FormModalWrapperProps, 'formId'> {
  isBackdrop?: boolean;
}

export default class StandardModal extends React.Component<StandardModalProps, any> {
  public render() {
    const { opened, onClose, children, isBackdrop } = this.props;
    const click = isBackdrop ? onClose : () => ({});
    return (
      <FullScreenModal opened={opened} blurred={false}>
        <div className='mcs-form-card-modal dark' onClick={click}>
          <div className='mcs-form-modal-container'>{children}</div>
        </div>
      </FullScreenModal>
    );
  }
}
