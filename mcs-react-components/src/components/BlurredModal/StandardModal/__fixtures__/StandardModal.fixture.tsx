import * as React from 'react';
import StandardModal, { StandardModalProps } from '../StandardModal';

const onClose = (e: any) => {
  return ;
}

const props: StandardModalProps = {
  onClose: onClose,
  opened: true,
};

const component = (_props: StandardModalProps) => (
  <StandardModal {..._props} />
);

export default {
  component,
  props,
};
