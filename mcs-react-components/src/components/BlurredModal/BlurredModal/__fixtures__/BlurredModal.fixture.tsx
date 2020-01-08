import * as React from 'react';
import BlurredModal, { BlurredModalProps } from '../BlurredModal';

const onClose = (e: any) => {
    return ;
}

const props: BlurredModalProps = {
    opened: true,
    blurred: true,
    formId: 'formID',
    footer: <div>This is the footer</div>,
    onClose: onClose
};

const component = (_props: BlurredModalProps) => (
    <BlurredModal {..._props}>
        <div>
          This is the Modal Content
        </div>
    </BlurredModal>
);
export default {
  component,
  props,
};
