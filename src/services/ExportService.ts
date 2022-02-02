import XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Dataset } from '@mediarithmics-private/mcs-components-library/lib/components/charts/utils';

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
      'template_import_user_segment.csv',
    );
  }
}
