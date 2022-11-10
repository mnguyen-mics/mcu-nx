import XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import {
  Datapoint,
  Dataset,
} from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';
import {
  AggregateDataset,
  CountDataset,
  JsonDataset,
} from '../models/dashboards/dataset/dataset_tree';
import _ from 'lodash';

export class ExportService {
  s2ab(s: string) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; i += 1) {
      /* tslint:disable:no-bitwise */
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }

  exportDatasetToXslx(dataset: Dataset) {
    const workSheet = XLSX.utils.json_to_sheet(dataset);

    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet);

    const workBookOout = XLSX.write(workBook, {
      bookType: 'csv',
      type: 'binary',
    });

    FileSaver.saveAs(
      new Blob([this.s2ab(workBookOout)], { type: 'application/octet-stream' }),
      'chart_data_export.csv',
    );
  }

  exportMultipleDataset(
    datasetMap: Map<string, AggregateDataset | CountDataset | JsonDataset | undefined>,
    filename: string,
  ) {
    const workBook = XLSX.utils.book_new();
    let i = 1;
    datasetMap.forEach((dataset, title) => {
      if (dataset) {
        let data: Dataset | number[] | JsonDataset['rows'] | null = null;
        // dataset is an AggregateDataset
        if ('dataset' in dataset) {
          // remove 'buckets' properties
          const cleanedDataset = dataset.dataset.map(datapoint =>
            _.omit<Datapoint>(datapoint, 'buckets'),
          );
          data = cleanedDataset;
        }
        // dataset is a JsonDataset
        if ('rows' in dataset) {
          data = dataset.rows;
        }
        // dataset is a CountDataset
        if ('value' in dataset) {
          data = [{ value: dataset.value || 0 }];
        }
        if (!data) {
          return;
        }
        const workSheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workBook, workSheet, `${i} - ${title}`.substr(0, 31));
        i++;
      }
    });
    const workBookOut = XLSX.write(workBook, {
      type: 'binary',
    });

    FileSaver.saveAs(
      new Blob([this.s2ab(workBookOut)], { type: 'application/octet-stream' }),
      `${filename}.xlsx`,
    );
  }
}
