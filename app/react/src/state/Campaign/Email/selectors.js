import { createSelector } from 'reselect';

import { normalizeReportView, formatNormalizeReportView } from '../../../utils/MetricHelper';
import { normalizeArrayOfObject } from '../../../utils/Normalizer';

const getEmailPerformanceData = state => state.emailCampaignSingle.emailCampaignPerformance.report_view;

const getEmailBlast = state => state.emailCampaignSingle.emailBlastApi.data;
const getEmailBlastReportView = state => state.emailCampaignSingle.emailBlastPerformanceApi.report_view;


const getTableDataSource = createSelector(
  getEmailPerformanceData,
  normalizeReportView,
);

const flattenData = createSelector(
  getTableDataSource,
  formatNormalizeReportView,
);

const getEmailBlastById = createSelector(
  getEmailBlast,
  emailBlast => normalizeArrayOfObject(emailBlast, 'id'),
);

const convertDeliveryReportToObjectArray = createSelector(
  getEmailBlastReportView,
  (reportView) => normalizeReportView(reportView),
);

const getStatByBlastId = createSelector(
  convertDeliveryReportToObjectArray,
  (array) => normalizeArrayOfObject(array, 'blast_id'),
);

const getEmailBlastTableView = createSelector(
  getEmailBlastById,
  getStatByBlastId,
  (emailBlast, statistics) => {
    return Object.keys(emailBlast).map((blastId) => {
      return {
        ...statistics[blastId],
        ...emailBlast[blastId],
      };
    });
  },
);

export {
  getTableDataSource,
  flattenData,
  getEmailBlastTableView,
};
