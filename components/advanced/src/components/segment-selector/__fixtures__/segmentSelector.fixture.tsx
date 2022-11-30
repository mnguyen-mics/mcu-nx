import 'reflect-metadata';
import * as React from 'react';
import SegmentSelector from '../SegmentSelector';
import { IocProvider } from '../../../inversify/inversify.react';
import { container } from '../../../inversify/inversify.config';
import { Provider } from 'react-redux';
import configureStore from '../../../redux/store';

const store = configureStore();

const dummyFunction = () => {
  return true;
};
export default (
  <Provider store={store}>
    <IocProvider container={container}>
      <SegmentSelector organisationId={'454'} datamartId={'455'} onSelectSegment={dummyFunction} />
    </IocProvider>
  </Provider>
);
