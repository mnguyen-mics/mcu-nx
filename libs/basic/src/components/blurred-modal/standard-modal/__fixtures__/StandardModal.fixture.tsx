import * as React from 'react';
import StandardModal, { StandardModalProps } from '../StandardModal';

const onClose = (e: React.MouseEvent) => {
  return;
};

const props: StandardModalProps = {
  onClose: onClose,
  opened: true,
};

export default (
  <StandardModal {...props}>
    <div>This is the Standard Modal Content</div>
  </StandardModal>
);
