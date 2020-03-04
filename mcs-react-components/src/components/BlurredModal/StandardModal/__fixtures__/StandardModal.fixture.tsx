import * as React from 'react';
import StandardModal, { StandardModalProps } from '../StandardModal';

const onClose = (e: React.MouseEvent) => {
  return ;
};

const props: StandardModalProps = {
  onClose: onClose,
  opened: true,
};

const component = (_props: StandardModalProps) => (
  <StandardModal {..._props}>
    <div>This is the Standard Modal Content</div>
  </StandardModal>
);

component.displayName = "StandardModal";

export default {
  component,
  props,
};
