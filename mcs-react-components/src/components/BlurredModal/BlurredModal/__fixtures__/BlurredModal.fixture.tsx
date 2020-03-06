import * as React from 'react';
import BlurredModal, { BlurredModalProps } from '../BlurredModal';

const onClose = (e: React.MouseEvent) => {
    return ;
}

const props: BlurredModalProps = {
    opened: true,
    blurred: true,
    formId: 'formID',
    onClose: onClose
};

const component = (_props: BlurredModalProps) => (
    <BlurredModal {..._props}>
        <div>
          This is the Blurred Modal Content
        </div>
    </BlurredModal>
);

component.displayName = "BlurredModal";

export default {
  component,
  props,
};
