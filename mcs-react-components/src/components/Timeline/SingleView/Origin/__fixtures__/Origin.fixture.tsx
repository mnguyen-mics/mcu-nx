import * as React from 'react';
import Origin, { OriginComponentProps } from '../Origin';
import { IntlProvider } from 'react-intl';

const props: OriginComponentProps = {
  origin: {
    $campaign_id: null,
    $campaign_name: null,
    $campaign_technical_name: null,
    $channel: 'referral',
    $creative_id: null,
    $creative_name: null,
    $creative_technical_name: null,
    $engagement_content_id: null,
    $gclid: null,
    $keywords: null,
    $log_id: null,
    $message_id: null,
    $message_technical_name: null,
    $referral_path: 'https://www.google.com/',
    $social_network: null,
    $source: 'www.google.com',
    $sub_campaign_id: null,
    $sub_campaign_technical_name: null,
    $ts: 1555507575217,
  },
};

const component = (_props: OriginComponentProps) => (
  <IntlProvider locale="en">
    <Origin {..._props} />
  </IntlProvider>
);

component.displayName = "Origin";

export default {
  component,
  props,
};
