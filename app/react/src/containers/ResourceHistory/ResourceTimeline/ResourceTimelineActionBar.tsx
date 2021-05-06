import * as React from 'react';
import { Actionbar, McsIcon } from '@mediarithmics-private/mcs-components-library';
import { FormatProperty } from './domain';
import messages from './messages';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { compose } from 'redux';

export interface ResourceTimelineActionBarProps {
  handleClose: () => void;
  formatProperty: FormatProperty;
}

type Props = ResourceTimelineActionBarProps & InjectedIntlProps;

export class ResourceTimelineActionBar extends React.Component<Props> {
  render() {
    const {
      handleClose,
      formatProperty,
      intl: { formatMessage },
    } = this.props;

    return (
      <Actionbar
        edition={true}
        pathItems={[
          formatMessage(formatProperty('history_title').message) ||
            formatMessage(messages.defaultTitle),
        ]}
      >
        <McsIcon type='close' className='close-icon' onClick={handleClose} />
      </Actionbar>
    );
  }
}

export default compose(injectIntl)(ResourceTimelineActionBar);
