import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import DeviceCard, { DeviceCardProps } from '../DeviceCard';
import { IntlProvider } from 'react-intl';

it('renders the DeviceCard', () => {
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
  const component = TestRenderer.create(
    <IntlProvider locale="en">
      <DeviceCard {...props} />
    </IntlProvider>,
  );
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});
