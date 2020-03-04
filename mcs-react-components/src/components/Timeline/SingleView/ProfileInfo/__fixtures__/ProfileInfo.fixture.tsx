import * as React from 'react';
import ProfileInfo, { ProfileInfoProps } from '../ProfileInfo';
import { IntlProvider } from 'react-intl';

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

const component = (_props: ProfileInfoProps) => (
  <IntlProvider locale="en">
    <ProfileInfo {..._props} />
  </IntlProvider>
);

component.displayName = "ProfileInfo";

export default {
  component,
  props,
};
