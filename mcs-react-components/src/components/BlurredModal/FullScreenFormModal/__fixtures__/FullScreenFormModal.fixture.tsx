import * as React from 'react';
import FullScreenModal, { FullScreenFormModalProps } from '../FullScreenFormModal';

const props: FullScreenFormModalProps = {
  opened: true,
  blurred: true,
};

const component = (_props: FullScreenFormModalProps) => (
    <FullScreenModal {..._props} />
);

export default {
  component,
  props,
};
