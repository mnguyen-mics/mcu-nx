import * as React from 'react';
import { IntlProvider } from 'react-intl';
import CollectionSelector, { CollectionSelectorProps } from '../CollectionSelector';
import { SelectableItem, SearchFilter } from '../../../utils';
import faker from 'faker';
import { DataResponse, DataListResponse } from '../../../utils/ApiResponses';

const items: Data[] = [];

for (let i = 0; i <= 47; i++) {
  items.push({
    id: i.toString(),
    text: faker.random.words(2),
  });
}

const respItems: Array<DataResponse<Data>> = [];

for (let i = 0; i <= 47; i++) {
  respItems.push({
    status: 'ok',
    data: items[i],
  });
}
const getDataById = (id: string): DataResponse<Data> => {
  for (const i in items) {
    if (items[i].id === id) return { status: 'ok', data: items[i] };
  }
  return { status: 'ok', data: { id: '1', text: faker.random.words(3) } };
};

interface Data extends SelectableItem {
  text: string;
}
const fetchData = (id: string): Promise<DataResponse<Data>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(getDataById(id));
    }, 300);
  });
};

const fetchDataList = (filter: SearchFilter): Promise<DataListResponse<Data>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: filter.keywords
          ? items.filter(item => item.text.includes(filter.keywords))
          : items.slice(
              (filter.currentPage - 1) * filter.pageSize,
              filter.pageSize * filter.currentPage,
            ),
        count: items.length < filter.pageSize ? items.length : filter.pageSize,
        status: 'ok',
        first_result: 0,
        max_results: 48,
        total: filter.keywords
          ? items.filter(item => item.text.includes(filter.keywords)).length
          : items.length,
      });
    }, 300);
  });
};

const close = () => undefined;
const save = () => undefined;
const renderCollectionItem = (element: Data) => <div>{getDataById(element.id).data.text}</div>;

const props: CollectionSelectorProps<Data> = {
  actionBarTitle: 'Welcome to the Collection Selector',
  addButtonText: 'Add',
  noElementText: 'Nothing to see here',
  displayFiltering: true,
  searchPlaceholder: 'Insert your keywords here',
  fetchData: fetchData,
  fetchDataList: fetchDataList,
  save: save,
  close: close,
  renderCollectionItem: renderCollectionItem,
  selectedIds: Object.keys(Array.apply(0, Array(12))),
};

export default (
  <IntlProvider locale='en'>
    <CollectionSelector {...props} />
  </IntlProvider>
);
