import * as React from 'react';
import { Row, Col } from 'antd';

import {
  EmptyCharts,
  LoadingChart,
} from '../../../../../components/EmptyCharts';
import PieChart from '../../../../../components/PieChart';
import withTranslations, {
  TranslationProps,
} from '../../../../Helpers/withTranslations';
import injectThemeColors, {
  InjectedThemeColorsProps,
} from '../../../../Helpers/injectThemeColors';
import { compose } from 'recompose';
import { FormattedMessage } from 'react-intl';

export interface EmailDeliveryReport {
  emailDelivered: number;
  emailOpened: number;
  emailUnsubscribed: number;
  emailClicks: number;
  emailSent: number;
}

export interface EmailPieChartsProps {
  deliveryReport?: EmailDeliveryReport;
  isLoading: boolean;
}

type Props = EmailPieChartsProps & TranslationProps & InjectedThemeColorsProps;

class EmailPieCharts extends React.Component<Props> {
  renderPieCharts = (deliveryReport: EmailDeliveryReport) => {
    const { translations } = this.props;

    const {
      emailClicks,
      emailDelivered,
      emailOpened,
      emailUnsubscribed,
      emailSent,
    } = deliveryReport;

    const generateRatio = (a: number, b: number) => {
      if (a === 0 || b === 0) return '0%';
      const ratio = a / b * 100;
      return `${Math.round(ratio)}%`;
    };

    const generateData = (type: string) => {
      const { colors } = this.props;

      switch (type) {
        case 'delivered':
          return [
            {
              key: 'delivered',
              value: emailDelivered ? emailDelivered : 0,
              color: colors['mcs-warning'],
            },
            {
              key: 'rest',
              value:
                emailDelivered === 0
                  ? 100
                  : Math.abs(emailSent - emailDelivered),
              color: '#eaeaea',
            },
          ];
        case 'opens':
          return [
            {
              key: 'delivered',
              value: emailOpened ? emailOpened : 0,
              color: colors['mcs-info'],
            },
            {
              key: 'rest',
              value:
                emailOpened === 0 ? 100 : Math.abs(emailSent - emailOpened),
              color: '#eaeaea',
            },
          ];
        case 'clicks2open':
          return [
            {
              key: 'clicks',
              value: emailClicks ? emailClicks : 0,
              color: colors['mcs-info'],
            },
            {
              key: 'rest',
              value:
                emailClicks === 0 ? 100 : Math.abs(emailOpened - emailClicks),
              color: '#eaeaea',
            },
          ];
        case 'clicks':
          return [
            {
              key: 'clicks',
              value: emailClicks ? emailClicks : 0,
              color: colors['mcs-info'],
            },
            {
              key: 'rest',
              value:
                emailClicks === 0 ? 100 : Math.abs(emailSent - emailClicks),
              color: '#eaeaea',
            },
          ];
        case 'unsubscribe':
          return [
            {
              key: 'unsubscribe',
              value: emailUnsubscribed ? emailUnsubscribed : 0,
              color: colors['mcs-info'],
            },
            {
              key: 'rest',
              value:
                emailUnsubscribed === 0
                  ? 100
                  : Math.abs(emailSent - emailUnsubscribed),
              color: '#eaeaea',
            },
          ];
        default:
          return [];
      }
    };

    const generateOptions = (
      isHalf: boolean,
      color: string,
      translationKey: string,
      ratioValeA: number,
      ratioValeB: number,
    ) => {
      const { colors } = this.props;

      let colorFormated = '';
      if (color === 'blue') {
        colorFormated = colors['mcs-info'];
      } else {
        colorFormated = colors['mcs-warning'];
      }
      const gray = '#eaeaea';

      const options = {
        innerRadius: true,
        isHalf: isHalf,
        text: {
          value: generateRatio(ratioValeA, ratioValeB),
          text: translations[translationKey],
        },
        colors: [colorFormated, gray],
      };

      return options;
    };

    return (
      <div>
        <Row>
          <Col span={7}>
            <PieChart
              identifier="pieDelivered1"
              dataset={generateData('delivered')}
              options={generateOptions(
                false,
                'orange',
                'DELIVERED',
                emailDelivered,
                emailSent,
              )}
            />
          </Col>
          <Col span={17}>
            <Row>
              <Col span={12}>
                <PieChart
                  identifier="pieOpens1"
                  dataset={generateData('opens')}
                  options={generateOptions(
                    true,
                    'blue',
                    'OPENS',
                    emailOpened,
                    emailSent,
                  )}
                />
              </Col>
              <Col span={12}>
                <PieChart
                  identifier="pieClicks1"
                  dataset={generateData('clicks')}
                  options={generateOptions(
                    true,
                    'blue',
                    'CLICKS',
                    emailClicks,
                    emailSent,
                  )}
                />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <PieChart
                  identifier="pieClicks2Opens1"
                  dataset={generateData('clicks2open')}
                  options={generateOptions(
                    true,
                    'blue',
                    'CLICKS_TO_OPENS',
                    emailClicks,
                    emailOpened,
                  )}
                />
              </Col>
              <Col span={12}>
                <PieChart
                  identifier="pieUnsubscribe1"
                  dataset={generateData('unsubscribe')}
                  options={generateOptions(
                    true,
                    'blue',
                    'UNSUBSCRIBE',
                    emailUnsubscribed,
                    emailSent,
                  )}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    const { deliveryReport, isLoading } = this.props;

    if (isLoading) return <LoadingChart />;

    if (!deliveryReport)
      return (
        <EmptyCharts
          title={
            <FormattedMessage
              id="email-campaign-overview"
              defaultMessage="No Data"
            />
          }
        />
      );

    return this.renderPieCharts(deliveryReport);
  }
}

export default compose<Props, EmailPieChartsProps>(
  withTranslations,
  injectThemeColors,
)(EmailPieCharts);
