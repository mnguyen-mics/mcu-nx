import * as React from 'react';
import DeviceCard, { DeviceCardProps } from '../DeviceCard';
import { IntlProvider } from 'react-intl';

const props: DeviceCardProps = {
  selectedDatamart: {
    creation_date: 1212,
    datafarm: 'datafarm',
    id: '1',
    name: 'my datamart',
    organisation_id: '001',
    region: 'fr',
    storage_model_version: 'v007',
    time_zone: 'paris/fr',
    token: 'token_1123',
    type: 'DATAMART',
  },
  userPointId: '123456',
};

const component = (_props: DeviceCardProps) => (
  <IntlProvider locale="en">
    <DeviceCard {..._props} />
  </IntlProvider>
);

component.displayName = "DeviceCard";

export default {
  component,
  props,
};
