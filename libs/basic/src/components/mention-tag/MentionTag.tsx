import React from 'react';
import { Tag, Tooltip } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';

export type Mention = 'ALPHA' | 'BETA';

interface State {}

export type MentionTagProps = {
  mention: Mention;
  tooltip?: string;
  className?: string;
  customContent?: string;
};

class MentionTag extends React.Component<MentionTagProps, State> {
  constructor(props: MentionTagProps) {
    super(props);
    this.state = {};
  }

  getMentionClass = (mention: Mention) => {
    const { className } = this.props;
    return `${className ? className : ''} mcs-mentionTag mcs-mentionTag_${mention
      .toString()
      .toLowerCase()}MentionTag`;
  };

  render() {
    const { mention, tooltip, customContent } = this.props;
    if (tooltip) {
      return (
        <Tooltip className='mcs-mentionTag_block' title={tooltip} placement='right'>
          <Tag className={this.getMentionClass(mention)}>{customContent || mention}</Tag>
          <InfoCircleFilled />
        </Tooltip>
      );
    } else {
      return <Tag className={this.getMentionClass(mention)}>{mention}</Tag>;
    }
  }
}

export default MentionTag;
