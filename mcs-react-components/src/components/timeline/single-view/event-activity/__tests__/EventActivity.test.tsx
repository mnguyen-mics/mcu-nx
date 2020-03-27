import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import EventActivity, { EventActivityProps } from '../EventActivity';
import { IntlProvider } from 'react-intl';

// Return a fixed timestamp when moment().format() is called
jest.mock('moment', () => () => ({format: () => '2019–11–13T12:34:56+00:00'}));

it('renders the EventActivity', () => {
  const props: EventActivityProps = {
    event: {
      $event_name: 'Recherche:Category',
      $properties: {
        $items: [],
        $referrer: 'https://www.google.com/',
        $url:
          'https://www.cdiscount.com/vin-champagne/r-vin+nuit+saint+georges.html#_his_',
        channel_id: '2748',
        pg_cat1: 'Accueil',
        pg_cat2: 'Vins Alcools',
        pg_cat3: 'Vin Rouge',
        pg_cat4: '',
        pg_cat5: '',
        pg_cat6: '',
        pg_homestore: '0',
        pg_name: 'Recherche',
        search_cat: '',
        search_keywords: 'vin nuit saint georges',
        usr_guid: '',
        usr_id: '',
      },
      $ts: 1555507575217,
    },
  };
  const component = TestRenderer.create(
    <IntlProvider locale="en">
      <EventActivity {...props} />
    </IntlProvider>,
  );
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});
