import * as React from 'react';
import { Link } from 'react-router-dom';
import { withRouter, RouteComponentProps } from 'react-router';
import { Layout } from 'antd';
import { compose } from 'recompose';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';

import Scrollspy from '../Scrollspy';
import McsIcons from '../McsIcons';
import ButtonStyleless from '../ButtonStyleless';

const { Sider } = Layout;

export interface SideBarItem {
  sectionId: string;
  title: FormattedMessage.MessageDescriptor;
  onClick?: (sectionId: string) => void;
  type?: 'validated' // potential other values : 'error' | 'warning'
}

export interface SidebarWrapperProps {
  items: SideBarItem[];
  scrollId: string;
}

type Props = SidebarWrapperProps & RouteComponentProps<{}> & InjectedIntlProps;

class ScrollspySider extends React.Component<Props> {
  render() {
    const { items, scrollId, intl, match: { url } } = this.props;

    const scrollItems: string[] = items.map(d => d.sectionId);
    const options = items.map(item => {
      const iconAndText = (
        <div>
          <McsIcons type="check-rounded-inverted" />
          <span className="step-title">{intl.formatMessage(item.title)}</span>
        </div>
      );
      if (item.onClick) {
        const handleOnClick = () => item.onClick!(item.sectionId);
        return (
          <li key={item.sectionId}>
            <ButtonStyleless className={item.type} onClick={handleOnClick}>
              {iconAndText}
            </ButtonStyleless>
          </li>
        );
      }
      return (
        <li key={item.sectionId}>
          <Link to={`${url}#${item.sectionId}`}>{iconAndText}</Link>
        </li>
      );
    });

    return (
      <Sider className="stepper">
        <Scrollspy
          currentClassName="currentStep"
          items={scrollItems}
          rootEl={`#${scrollId}`}
        >
          {options}
        </Scrollspy>
      </Sider>
    );
  }
}

/*
 * Line below needed to extract Antd Sider component from its parent Form
 * See at https://ant.design/components/layout/
 */
// (ScrollspySider as any).__ANT_LAYOUT_SIDER = true; // eslint-disable-line

export default compose<Props, SidebarWrapperProps>(injectIntl, withRouter)(
  ScrollspySider,
);
