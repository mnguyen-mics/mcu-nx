import * as React from 'react';
import BlurredModal, { BlurredModalProps } from '../BlurredModal';

const onClose = (e: React.MouseEvent) => {
  return;
}

const props: BlurredModalProps = {
  opened: true,
  blurred: true,
  formId: 'formID',
  onClose: onClose
};

export default (
  <BlurredModal {...props}>
    <div>
      This is the Blurred Modal Content
        </div>
  </BlurredModal>
);
