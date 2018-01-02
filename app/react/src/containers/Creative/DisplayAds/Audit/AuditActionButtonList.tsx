import * as React from 'react';
import { Modal, Button } from 'antd';
import { CreativeAuditAction } from '../../../../models/creative/CreativeResource';
import { FormattedMessage, defineMessages } from 'react-intl';

export interface AuditActionButtonListProps {
  auditActions: CreativeAuditAction[];
  confirmAuditAction: (auditAction: CreativeAuditAction) => void;
}

export default class AuditActionButtonList extends React.Component<
  AuditActionButtonListProps
> {
  confirmMakeAuditAction = (auditAction: CreativeAuditAction) => {
    const { confirmAuditAction } = this.props;
    Modal.confirm({
      title: <FormattedMessage {...confirmAuditActionTitleMap[auditAction]} />,
      content: (
        <FormattedMessage {...confirmAuditActionContentMap[auditAction]} />
      ),
      onOk() {
        confirmAuditAction(auditAction);
      },
    });
  };

  render() {
    const { auditActions } = this.props;

    return (
      <div>
        {auditActions.map(auditAction => {
          const makeAudit = () => this.confirmMakeAuditAction(auditAction);
          return (
            <div key={auditAction} className="float-right m-l-10">
              <Button type="primary" onClick={makeAudit}>
                <FormattedMessage {...auditActionMessageMap[auditAction]} />
              </Button>
            </div>
          );
        })}
      </div>
    );
  }
}

export const auditActionMessageMap: {
  [key in CreativeAuditAction]: FormattedMessage.MessageDescriptor
} = defineMessages({
  START_AUDIT: {
    id: 'creatives.audit.action.start',
    defaultMessage: 'Start Audit',
  },
  FAIL_AUDIT: {
    id: 'creatives.audit.action.fail',
    defaultMessage: 'Fail Audit',
  },
  PASS_AUDIT: {
    id: 'creatives.audit.action.pass',
    defaultMessage: 'Pass Audit',
  },
  RESET_AUDIT: {
    id: 'creatives.audit.action.reset',
    defaultMessage: 'Reset Audit',
  },
});

export const confirmAuditActionTitleMap: {
  [key in CreativeAuditAction]: FormattedMessage.MessageDescriptor
} = defineMessages({
  START_AUDIT: {
    id: 'creatives.audit.action.start.confirm.title',
    defaultMessage: 'Submit your Creative to Audit',
  },
  FAIL_AUDIT: {
    id: 'creatives.audit.action.fail.confirm.title',
    defaultMessage: 'Fail your Creative Audit Status',
  },
  PASS_AUDIT: {
    id: 'creatives.audit.action.pass.confirm.title',
    defaultMessage: 'Pass your Creative Audit Status',
  },
  RESET_AUDIT: {
    id: 'creatives.audit.action.reset.confirm.title',
    defaultMessage: 'Reset your Creative Audit Status',
  },
});

export const confirmAuditActionContentMap: {
  [key in CreativeAuditAction]: FormattedMessage.MessageDescriptor
} = defineMessages({
  START_AUDIT: {
    id: 'creatives.audit.action.start.confirm.content',
    defaultMessage:
      "You are about to submit your creative to an external audit. It can take approximatly between 24 to 48 hours. You won't be able to modify your creative during the audit process. Are you sure you want to proceed ?",
  },
  FAIL_AUDIT: {
    id: 'creatives.audit.action.fail.confirm.content',
    defaultMessage: 'Are you sure you want to proceed ?',
  },
  PASS_AUDIT: {
    id: 'creatives.audit.action.pass.confirm.content',
    defaultMessage: 'Are you sure you want to proceed ?',
  },
  RESET_AUDIT: {
    id: 'creatives.audit.action.reset.confirm.content',
    defaultMessage:
      'You are about to reset your creative audit status, which means that you will need to pass the audit again to use it in a campaign. Are you sure you want to proceed ?',
  },
});
