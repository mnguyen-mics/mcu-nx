import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import ProfileInfo, { ProfileInfoProps } from '../ProfileInfo';
import { IntlProvider } from 'react-intl';

it('renders the ProfileInfo', () => {
  const props: ProfileInfoProps = {
    profile: {
      $compartment_id: '1196',
      $creation_ts: 1533207442669,
      $items: [],
      $last_modified_ts: 1555517236970,
      $user_account_id: null,
      channel_id: '2748',
      usr_age: '',
      usr_gender: 'M.',
      usr_guid: '',
      usr_postalcode: '',
      usr_segment: '',
    },
  };
  const component = TestRenderer.create(
    <IntlProvider locale='en'>
      <ProfileInfo {...props} />
    </IntlProvider>,
  );
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});
