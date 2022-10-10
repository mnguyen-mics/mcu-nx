import { AudienceSegmentShape } from '../../models/audienceSegment/AudienceSegmentResource';
import { ChannelResource } from '../../models/channel/ChannelResource';
import { DecoratorsOptions } from '../../models/dashboards/dataset/common';
import { AggregateDataset } from '../../models/dashboards/dataset/dataset_tree';
import { UserAccountCompartmentResource } from '../../models/datamart/DatamartResource';
import { DataListResponse } from '../../services/ApiService';
import { IChannelService } from '../../services/ChannelService';
import { ICompartmentService } from '../../services/CompartmentService';
import { DecoratorsTransformation } from '../transformations/DecoratorsTransformation';
import {
  GetSegmentsOption,
  IAudienceSegmentService,
} from './../../services/AudienceSegmentService';

const X_KEY = 'key';

const channels = ['Channel One', 'Channel Two', 'Channel Three'];
const segments = ['Segment One', 'Segment Two', 'Segment Three'];
const compartments = ['Compartment One', 'Compartment Two', 'Compartment Three'];

class ChannelServiceMock implements IChannelService {
  getChannels(
    organisationId: string,
    datamartId: string,
    options?: object,
  ): Promise<DataListResponse<ChannelResource>> {
    return Promise.resolve({
      data: channels.map((name, i) => {
        return {
          creation_ts: 0,
          datamart_id: datamartId,
          id: `${i}`,
          name: name,
          organisation_id: organisationId,
          token: 'token',
        } as ChannelResource;
      }),
      count: channels.length,
    } as DataListResponse<ChannelResource>);
  }
}

class AudienceSegmentServiceMock implements IAudienceSegmentService {
  getSegments(
    organisationId?: string,
    options?: GetSegmentsOption,
  ): Promise<DataListResponse<AudienceSegmentShape>> {
    return Promise.resolve({
      data: segments.map((name, i) => {
        return {
          id: `${i}`,
          organisation_id: organisationId,
          name: name,
          datamart_id: '1',
          persisted: true,
          type: 'USER_LIST',
          paused: false,
        } as AudienceSegmentShape;
      }),
      count: segments.length,
    } as DataListResponse<AudienceSegmentShape>);
  }
}

class CompartmentServiceMock implements ICompartmentService {
  getCompartments(
    organisationId?: string,
  ): Promise<DataListResponse<UserAccountCompartmentResource>> {
    return Promise.resolve({
      data: compartments.map((name, i) => {
        return {
          id: `${i}`,
          organisation_id: organisationId,
          token: 'token',
          name: name,
          archived: false,
        } as UserAccountCompartmentResource;
      }),
      count: compartments.length,
    } as DataListResponse<UserAccountCompartmentResource>);
  }
}

const datasetDecoratorsTransformation = new DecoratorsTransformation(
  new ChannelServiceMock(),
  new CompartmentServiceMock(),
  new AudienceSegmentServiceMock(),
);

test('List of key / value dataset', done => {
  const dataset: AggregateDataset = {
    type: 'aggregate',
    metadata: {
      seriesTitles: ['count'],
    },
    dataset: [
      {
        key: '0',
        count: 2,
      },
      {
        key: '1',
        count: 3,
      },
      {
        key: '2',
        count: 6,
      },
    ],
  };

  const decoratorsOptions: DecoratorsOptions = {
    model_type: 'CHANNELS',
  };

  datasetDecoratorsTransformation
    .applyGetDecorators(dataset, X_KEY, decoratorsOptions, '1', '1')
    .then(decorated => {
      expect(decorated).toEqual({
        dataset: [
          {
            count: 2,
            key: channels[0],
          },
          {
            count: 3,
            key: channels[1],
          },
          {
            count: 6,
            key: channels[2],
          },
        ],
        metadata: {
          seriesTitles: ['count'],
        },
        type: 'aggregate',
      });
      done();
    });
});

test('Aggregate dataset with buckets decorated recursively', done => {
  const point1: any = {
    key: '0',
    count1: 2,
    count2: 4,
    buckets: [
      {
        key: '0',
        count1: 2,
        count2: 4,
      },
      {
        key: '1',
        count1: 3,
        count2: 5,
      },
    ],
  };

  const decoratorsOptions: DecoratorsOptions = {
    buckets: {
      model_type: 'SEGMENTS',
    },
  };

  const dataset: AggregateDataset = {
    type: 'aggregate',
    metadata: {
      seriesTitles: ['count'],
    },
    dataset: [
      point1,
      {
        key: '1',
        count1: 3,
        count2: 6,
      },
      {
        key: '2',
        count1: 6,
      },
    ],
  };

  datasetDecoratorsTransformation
    .applyGetDecorators(dataset, X_KEY, decoratorsOptions, '1', '1')
    .then(formatted => {
      expect(formatted).toEqual({
        dataset: [
          {
            key: '0',
            count1: 2,
            count2: 4,
            buckets: [
              {
                key: segments[0],
                count1: 2,
                count2: 4,
              },
              {
                key: segments[1],
                count1: 3,
                count2: 5,
              },
            ],
          },
          {
            key: '1',
            count1: 3,
            count2: 6,
          },
          {
            key: '2',
            count1: 6,
          },
        ],
        metadata: {
          seriesTitles: ['count'],
        },
        type: 'aggregate',
      });
      done();
    });
});
