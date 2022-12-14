import 'jest';
import React from 'react';
import TestRenderer from 'react-test-renderer';
import Origin, { Props } from '../Origin';

// Return a fixed timestamp when moment().format() is called
jest.mock('moment', () => () => ({
  format: () => '2019–11–13T12:34:56+00:00',
}));

it('renders the Origin', () => {
  const props: Props = {
    title: 'Origin',
    noOriginText: 'Direct',
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
  const component = TestRenderer.create(<Origin {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});
