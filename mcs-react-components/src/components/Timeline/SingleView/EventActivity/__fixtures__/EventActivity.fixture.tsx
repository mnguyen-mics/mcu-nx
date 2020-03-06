import * as React from 'react';
import EventActivity, { EventActivityProps } from '../EventActivity';
import { IntlProvider } from 'react-intl';

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

const component = (_props: EventActivityProps) => (
  <IntlProvider locale="en">
    <EventActivity {..._props} />
  </IntlProvider>
);

component.displayName = "EventActivity";

export default {
  component,
  props,
};
