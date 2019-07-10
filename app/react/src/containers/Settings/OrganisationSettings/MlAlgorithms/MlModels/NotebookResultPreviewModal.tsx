import * as React from 'react';
import { Modal, Button } from 'antd';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import messages from './messages';
import IframeSupport from '../../../../Plugin/ConnectedFields/FormDataFile/HtmlEditor/IframeSupport';

export interface NotebookResultPreviewModalProps {
  html: string;
  opened: boolean;
  onClose: () => void;
}

interface NotebookResultPreviewModalState {
  opened: boolean;
}

type JoinedProps = NotebookResultPreviewModalProps & InjectedIntlProps;

class NotebookResultPreviewModal extends React.Component<
  JoinedProps,
  NotebookResultPreviewModalState
> {
  constructor(props: JoinedProps) {
    super(props);
  }

  render() {
    const { html, onClose, opened, intl } = this.props;

    const onClick = () => onClose();

    return (
      <Modal
        title={intl.formatMessage(messages.previewModalTitle)}
        visible={opened}
        onCancel={onClose}
        width={1280}
        footer={
          <Button key={1} onClick={onClick}>
            Ok
          </Button>
        }
      >
        <IframeSupport content={html} />
      </Modal>
    );
  }
}

export default injectIntl(NotebookResultPreviewModal);
