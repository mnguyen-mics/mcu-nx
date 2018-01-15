import * as React from 'react';
import { Button, Modal, Row, Col } from 'antd';
import moment from 'moment';
import { FormattedMessage, defineMessages } from 'react-intl';
import {
  AuditStatusResource,
  CreativeAuditAction,
  DisplayAdResource,
  AuditStatus,
} from '../../../../models/creative/CreativeResource';
import AuditStatusRenderer from './AuditStatusRenderer';
import AuditActionButtonList from './AuditActionButtonList';

interface AuditComponentProps {
  creative: DisplayAdResource;
  auditStatuses: AuditStatusResource[];
  onMakeAuditAction: (auditAction: CreativeAuditAction) => void;
}

interface State {
  modalVisible: boolean;
}

class AuditComponent extends React.Component<AuditComponentProps, State> {
  constructor(props: AuditComponentProps) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  toggleDisplayModal = () => {
    this.setState(prevState => ({
      modalVisible: !prevState.modalVisible,
    }));
  };

  render() {
    const { auditStatuses, creative, onMakeAuditAction } = this.props;

    const auditDetailsMessage = (
      <FormattedMessage
        id="creatives.audit.status.details.button-label"
        defaultMessage="Audit Details"
      />
    );

    const auditDetailsButton = auditStatuses.length > 0 && (
      <div className="float-right m-l-10">
        <Button onClick={this.toggleDisplayModal}>{auditDetailsMessage}</Button>
      </div>
    );

    return (
      <div>
        <div>
          <div className={'float-left'} style={{ lineHeight: '34px' }}>
            <AuditStatusRenderer auditStatus={creative.audit_status} />
          </div>
          <AuditActionButtonList
            auditActions={creative.available_user_audit_actions}
            confirmAuditAction={onMakeAuditAction}
          />
          {auditDetailsButton}
        </div>
        <Modal
          title={auditDetailsMessage}
          visible={this.state.modalVisible}
          onCancel={this.toggleDisplayModal}
        >
          {auditStatuses.map(auditStatus => {
            return (
              <Row key={auditStatus.date}>
                <Col span={auditStatus.feedback ? 8 : 12}>
                  {auditStatus.display_network}:{' '}
                  <FormattedMessage
                    {...auditStatusMessageMap[auditStatus.status]}
                  />
                </Col>
                {auditStatus.feedback ? (
                  <Col span={8}>{auditStatus.feedback}</Col>
                ) : null}
                <Col span={auditStatus.feedback ? 8 : 12}>
                  {moment(auditStatus.date).format('DD/MM/YYYY HH:mm:ss')}
                </Col>
              </Row>
            );
          })}
        </Modal>
      </div>
    );
  }
}

export default AuditComponent;

export const auditStatusMessageMap: {
  [key in AuditStatus]: FormattedMessage.MessageDescriptor
} = defineMessages({
  AUDIT_PENDING: {
    id: 'creatives.audit.status.pending',
    defaultMessage: 'Audit Pending',
  },
  AUDIT_FAILURE: {
    id: 'creatives.audit.status.failed',
    defaultMessage: 'Audit Failed',
  },
  AUDIT_SUCCESS: {
    id: 'creatives.audit.status.passed',
    defaultMessage: 'Audit Success',
  },
});
