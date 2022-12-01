import * as React from 'react';
import {
  DeviceIdRegistryDatamartSelectionResource,
  DeviceIdRegistryResource,
  DeviceIdRegistryType,
} from '../../../../../models/deviceIdRegistry/DeviceIdRegistryResource';
import { Filter } from '../../../DatamartSettings/Common/domain';
import { SearchSetting } from '../../../../../utils/LocationSearchHelper';
import { Tooltip } from 'antd';
import { WarningOutlined } from '@ant-design/icons/lib/icons';

export interface DeviceIdRegistryFilter extends Filter {
  types: DeviceIdRegistryType[];
}

export interface DeviceIdRegistryTypeItem {
  key: DeviceIdRegistryType;
  value: DeviceIdRegistryType;
}

export const TYPE_SEARCH_SETTINGS: SearchSetting[] = [
  {
    paramName: 'types',
    defaultValue: undefined,
    deserialize: query => {
      if (query.types) {
        return query.types.split(',');
      }
      return [];
    },
    serialize: (value: DeviceIdRegistryType[]) => value.join(','),
    isValid: () => true,
  },
];

export interface DeviceIdRegistryWithDatamartSelectionsResource extends DeviceIdRegistryResource {
  datamart_selections: DeviceIdRegistryDatamartSelectionResource[];
}

export function renderRegistryName(
  record: DeviceIdRegistryWithDatamartSelectionsResource,
  formattedWarning: string,
) {
  return (
    <span>
      {record.name}{' '}
      {record.datamart_selections.length === 0 && (
        <span className='field-type'>
          <Tooltip placement='bottom' title={formattedWarning}>
            <WarningOutlined style={{ color: 'orange' }} />
          </Tooltip>
        </span>
      )}
    </span>
  );
}

export type RowType = 'OFFER_HEADER' | 'REGISTRY';

export class ThirdPartyOfferHeaderRow {
  _row_type: RowType = 'OFFER_HEADER';

  id: string;
  name: string;
}

export class ThirdPartyRegistryRow implements DeviceIdRegistryWithDatamartSelectionsResource {
  _row_type: RowType = 'REGISTRY';

  datamart_selections: DeviceIdRegistryDatamartSelectionResource[];
  id: string;
  name: string;
  description?: string | undefined;
  type: DeviceIdRegistryType;
  organisation_id: string;
}

export type ThirdPartyDataRow = ThirdPartyOfferHeaderRow | ThirdPartyRegistryRow;

export function thirdPartyRowIsOffer(row: ThirdPartyDataRow) {
  return row._row_type === 'OFFER_HEADER';
}

export function thirdPartyRowIsRegistry(row: ThirdPartyDataRow) {
  return row._row_type === 'REGISTRY';
}

export function isInstanceOfThirdPartyDataRow(object: any): object is ThirdPartyDataRow {
  return '_row_type' in object;
}
