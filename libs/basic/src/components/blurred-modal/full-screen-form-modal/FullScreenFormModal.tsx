import React from 'react';
import { createPortal } from 'react-dom';

export interface FullScreenFormModalProps {
  opened?: boolean;
  blurred?: boolean;
  className?: string;
}

export default class FullScreenModal extends React.Component<FullScreenFormModalProps> {
  el: HTMLDivElement;

  constructor(props: FullScreenFormModalProps) {
    super(props);
    this.el = document.createElement('div');
  }

  setRootClassName = (remove?: boolean, blurred?: boolean) => {
    const appRoot = document.getElementById('mcs-full-page');
    if (appRoot && !remove && blurred) appRoot.classList.add('mcs-form-modal-blurred-open');
    if (appRoot && !remove && !blurred) appRoot.classList.add('mcs-form-modal-open');
    if (appRoot && remove) {
      appRoot.classList.remove('mcs-form-modal-blurred-open');
      appRoot.classList.remove('mcs-form-modal-open');
    }
  };

  componentDidMount() {
    const { blurred } = this.props;
    const modalRoot = document.getElementById('mcs-edit-modal');
    if (modalRoot) modalRoot.appendChild(this.el);
    if (this.props.opened) {
      this.setRootClassName(false, blurred);
    }
  }

  componentWillReceiveProps(nextProps: FullScreenFormModalProps) {
    const { blurred } = nextProps;
    if (!this.props.opened && nextProps.opened) {
      this.setRootClassName(false, blurred);
    } else if (this.props.opened && !nextProps.opened) {
      this.setRootClassName(true, blurred);
    }
  }

  componentWillUnmount() {
    const modalRoot = document.getElementById('mcs-edit-modal');
    if (modalRoot) {
      modalRoot.removeChild(this.el);
    }
    this.setRootClassName(true);
  }

  render() {
    return this.props.opened ? createPortal(this.props.children, this.el) : null;
  }
}
