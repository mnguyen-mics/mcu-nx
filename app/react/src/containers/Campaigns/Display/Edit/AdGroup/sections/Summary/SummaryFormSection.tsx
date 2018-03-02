import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { FormattedMessage } from 'react-intl';
import { Col, Row } from 'antd';
import { getFormValues } from 'redux-form';

import { FormSection } from '../../../../../../../components/Form';
import { AdGroupFormData, AD_GROUP_FORM_NAME } from '../../domain';
import messages from '../../../messages';
import AudienceSegmentSummary from './AudienceSegmentSummary';
import LocationSummary from './LocationSummary';
import GeneralSettingSummary from './GeneralSettingSummary';

const Section: React.SFC = props => {
  if (!props.children) return null;
  return (
    <div className="section sectionPaddingTop">
      <Row className="textPadding">
        <Col span={16}>{props.children}</Col>
      </Row>
    </div>
  );
};

interface MapStateProps {
  adGroupFormData: AdGroupFormData;
}

type Props = MapStateProps;

class SummaryFormSection extends React.Component<Props> {
  render() {
    const { adGroupFormData } = this.props;
    return (
      <div>
        <FormSection
          title={messages.sectionTitleSummary}
          subtitle={messages.sectionSubtitleSummary}
        />
        <Row className="ad-group-summary-section">
          <Col span={16} className="content">
            <Section>
              <GeneralSettingSummary />
            </Section>

            <Section>
              <AudienceSegmentSummary />
            </Section>

            <Section>
              <LocationSummary />
            </Section>


            <Section>
              <FormattedMessage
                id="ad-group-form-summary-bidoptimizer"
                defaultMessage={`You have { bidOptimizerCountLabeled } 
                  { bidOptimizerCount , plural, 
                    zero {bid optimizer} one {bid optimizer} other {bid optimizers} }
                  attached to your ad group`}
                values={{
                  bidOptimizerCountLabeled: (
                    <span className="info-color">
                      {adGroupFormData.bidOptimizerFields.length}
                    </span>
                  ),
                  bidOptimizerCount: adGroupFormData.bidOptimizerFields.length,
                }}
              />
            </Section>

            <Section>
              <FormattedMessage
                id="ad-group-form-summary-creative"
                defaultMessage={`You have { creativeCountLabeled } 
                  { creativeCount , plural, 
                    zero {creative} one {creative} other {creatives} }
                  attached to your ad group`}
                values={{
                  creativeCountLabeled: (
                    <span className="info-color">
                      {adGroupFormData.adFields.length}
                    </span>
                  ),
                  creativeCount: adGroupFormData.adFields.length,
                }}
              />
            </Section>
          </Col>
        </Row>
      </div>
    );
  }
}

const getAdGroupFormData = (state: any): AdGroupFormData => {
  return getFormValues(AD_GROUP_FORM_NAME)(state) as AdGroupFormData;
};

export default compose(
  connect(state => ({ adGroupFormData: getAdGroupFormData(state) })),
)(SummaryFormSection);
