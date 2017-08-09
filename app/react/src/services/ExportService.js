import displayCampaignMessages from '../containers/Campaigns/Display/messages';
import segmentMessages from '../containers/Audience/Segments/Dashboard/messages';
import dateMessages from '../common/messages/dateMessages';
import exportMessages from '../common/messages/exportMessages';

const datenum = (v, date1904) => {
  let newV = v;
  if (date1904) {
    newV += 1462;
  }
  const epoch = Date.parse(newV);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
};

const s2ab = s => {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; i += 1) {
    view[i] = s.charCodeAt(i) & 0xFF; // eslint-disable-line
  }
  return buf;
};

function buildSheet(title, data, headers, filter, formatMessage) {
  const titleLine = [title];
  const sheet = [];
  const blankLine = [];

  sheet.push(titleLine);
  sheet.push([`${formatMessage(dateMessages.from)} ${filter.from} ${formatMessage(dateMessages.to)} ${filter.to}`]);
  sheet.push(blankLine);
  sheet.push(headers.map(h => h.translation));

  data.forEach(row => {
    const dataLine = headers.map(header => {
      return row[header.name];
    });
    sheet.push(dataLine);
  });

  return sheet;
}

function addSheet(title, data, headers, filter, formatMessage) {
  const formattedTitle = formatMessage(title);
  if (data.length) {
    const sheet = buildSheet(formattedTitle, data, headers, filter, formatMessage);
    return {
      name: formattedTitle,
      data: sheet
    };
  }
  return undefined;
}


/**
 * Export Specific Methods
 */

class Workbook {
  constructor() {
    this.SheetNames = [];
    this.Sheets = {};
  }
}

const buildWorkbookSheet = data => {
  const ws = {};
  const range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
  for (let R = 0; R !== data.length; R += 1) {
    for (let C = 0; C !== data[R].length; C += 1) {
      if (range.s.r > R) {
        range.s.r = R;
      }
      if (range.s.c > C) {
        range.s.c = C;
      }
      if (range.e.r < R) {
        range.e.r = R;
      }
      if (range.e.c < C) {
        range.e.c = C;
      }
      const cell = { v: data[R][C] };
      if (cell.v === null) {
        continue; // eslint-disable-line
      }
      const cell_ref = XLSX.utils.encode_cell({ c: C, r: R }); // eslint-disable-line

      if (typeof cell.v === 'number') {
        cell.t = 'n';
      } else if (typeof cell.v === 'boolean') {
        cell.t = 'b';
      } else if (cell.v instanceof Date) {
        cell.t = 'n';
        cell.z = XLSX.SSF._table[14]; // eslint-disable-line
        cell.v = datenum(cell.v);
      } else {
        cell.t = 's';
      }

      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) {
    ws['!ref'] = XLSX.utils.encode_range(range); // eslint-disable-line
  }
  return ws;
};

/**
 * Export data and return a blob (to be used with fileSaver saveAs())
 * @param sheets Array of sheets. Contains sheet names and sheet data.
 * @param fileName File name of the exported file.
 * @param extension Extension of the exported file.
 */
const exportData = (sheets, fileName, extension) => {
  const newExtension = extension.replace('.', '');
  const workBook = new Workbook();

  for (let i = 0; i < sheets.length; i += 1) {
    let workbookSheet = {};
    workbookSheet = buildWorkbookSheet(sheets[i].data);
    // TODO rewrite export to csv
    // if (newExtension === 'csv') {
    //   workbookSheet = XLSX.utils.sheet_to_csv(workbookSheet); // eslint-disable-line
    //   return new Blob([workbookSheet], { type: 'text/csv;charset=utf-8' }), `${fileName}-${i}.${newExtension}`; // eslint-disable-line
    //   if (i + 1 === sheets.length) {
    //     return;
    //   }
    // } else {
    workBook.SheetNames.push(sheets[i].name);
    workBook.Sheets[sheets[i].name] = workbookSheet;
    // }
  }

  const output = XLSX.write(workBook, { bookType: 'xlsx', bookSST: false, type: 'binary' }); // eslint-disable-line
  saveAs(new Blob([s2ab(output)], { type: 'application/octet-stream' }), `${fileName}.${newExtension}`); // eslint-disable-line
};

/**
 * Display Campaigns
 */
const exportDisplayCampaigns = (organisationId, dataSource, filter, translations) => {

  const titleLine = [translations.DISPLAY_CAMPAIGNS_EXPORT_TITLE];
  const blankLine = [];

  const dataSheet = [];

  dataSheet.push(titleLine);
  dataSheet.push([`${translations.FROM} ${filter.from.format('YYYY-MM-DD')} ${translations.TO} ${filter.to.format('YYYY-MM-DD')}`]);
  dataSheet.push(blankLine);

  if (filter.keywords) {
    dataSheet.push(['Search keywords', filter.keywords]);
  }
  if (filter.statuses.length > 0) {
    dataSheet.push(['Displayed statuses', filter.statuses.join(', ')]);
  }

  dataSheet.push(blankLine);

  const headersMap = [
    { name: 'status', translation: translations.STATUS },
    { name: 'name', translation: translations.NAME },
    { name: 'impressions', translation: translations.IMPRESSIONS },
    { name: 'clicks', translation: translations.CLICKS },
    { name: 'cpm', translation: translations.CPM },
    { name: 'ctr', translation: translations.CTR },
    { name: 'cpc', translation: translations.CPC },
    { name: 'impressions_cost', translation: translations.IMPRESSIONS_COST },
    { name: 'cpa', translation: translations.CPA },
  ];

  const headersLine = headersMap.map(header => header.translation);

  dataSheet.push(headersLine);

  dataSource.forEach(row => {
    const dataLine = headersMap.map(header => {
      return row[header.name];
    });
    dataSheet.push(dataLine);
  });

  const sheets = [{
    name: translations.DISPLAY_CAMPAIGNS_EXPORT_TITLE,
    data: dataSheet,
  }];

  exportData(sheets, `${organisationId}_display-campaigns`, 'xlsx');
};

/**
 * Display Campaign Dashboard
 */
const exportDisplayCampaignDashboard = (organisationId, campaignData, mediasData, adGroupsData, adsData, filter, formatMessage) => {
  const headers = [
    { name: 'status', translation: formatMessage(displayCampaignMessages.status) },
    { name: 'name', translation: formatMessage(displayCampaignMessages.name) },
    { name: 'impressions', translation: formatMessage(displayCampaignMessages.impressions) },
    { name: 'clicks', translation: formatMessage(displayCampaignMessages.clicks) },
    { name: 'cpm', translation: formatMessage(displayCampaignMessages.cpm) },
    { name: 'ctr', translation: formatMessage(displayCampaignMessages.ctr) },
    { name: 'cpc', translation: formatMessage(displayCampaignMessages.cpc) },
    { name: 'impressions_cost', translation: formatMessage(displayCampaignMessages.impression_cost) },
    { name: 'cpa', translation: formatMessage(displayCampaignMessages.cpa) }
  ];

  const sheets = [
    addSheet(exportMessages.displayCampaignExportTitle, campaignData, headers, filter, formatMessage),
    addSheet(exportMessages.mediasExportTitle, mediasData, headers, filter, formatMessage),
    addSheet(exportMessages.adGroupsExportTitle, adGroupsData, headers, filter, formatMessage),
    addSheet(exportMessages.adsExportTitle, adsData, headers, filter, formatMessage)
  ].filter(x => x);

  if (sheets.length) {
    exportData(sheets, `${organisationId}_display-campaign`, 'xlsx');
  }
};

/**
 * Email Campaigns
 */
const exportEmailCampaigns = (organisationId, dataSource, filter, translations) => {

  const titleLine = [translations.EMAIL_CAMPAIGNS_EXPORT_TITLE];
  const blankLine = [];

  const dataSheet = [];

  dataSheet.push(titleLine);
  dataSheet.push([`${translations.FROM} ${filter.from.format('YYYY-MM-DD')} ${translations.TO} ${filter.to.format('YYYY-MM-DD')}`]);
  dataSheet.push(blankLine);

  if (filter.keywords) {
    dataSheet.push(['Search keywords', filter.keywords]);
  }
  if (filter.statuses.length > 0) {
    dataSheet.push(['Displayed statuses', filter.statuses.join(', ')]);
  }

  dataSheet.push(blankLine);

  const headersMap = [
    { name: 'status', translation: translations.STATUS },
    { name: 'name', translation: translations.NAME },
    { name: 'email_sent', translation: translations.EMAIL_SENT },
    { name: 'email_hard_bounced', translation: translations.EMAIL_HARD_BOUNCED },
    { name: 'email_soft_bounced', translation: translations.EMAIL_SOFT_BOUNCED },
    { name: 'clicks', translation: translations.CLICKS },
    { name: 'impressions', translation: translations.IMPRESSIONS },
  ];

  const headersLine = headersMap.map(header => header.translation);

  dataSheet.push(headersLine);

  dataSource.forEach(row => {
    const dataLine = headersMap.map(header => {
      return row[header.name];
    });
    dataSheet.push(dataLine);
  });

  const sheets = [{
    name: translations.EMAIL_CAMPAIGNS_EXPORT_TITLE,
    data: dataSheet,
  }];

  exportData(sheets, `${organisationId}_email-campaigns`, 'xlsx');
};

/**
 * Goals
 */
const exportGoals = (organisationId, dataSource, filter, translations) => {

  const titleLine = [translations.GOALS_EXPORT_TITLE];
  const blankLine = [];

  const dataSheet = [];

  dataSheet.push(titleLine);
  dataSheet.push([`${translations.FROM} ${filter.from.format('YYYY-MM-DD')} ${translations.TO} ${filter.to.format('YYYY-MM-DD')}`]);
  dataSheet.push(blankLine);

  if (filter.keywords) {
    dataSheet.push(['Search keywords', filter.keywords]);
  }
  if (filter.statuses.length > 0) {
    dataSheet.push(['Displayed statuses', filter.statuses.join(', ')]);
  }

  dataSheet.push(blankLine);

  const headersMap = [
    { name: 'name', translation: translations.NAME },
    { name: 'conversions', translation: translations.CONVERSIONS },
    { name: 'value', translation: translations.CONVERSION_VALUE },
  ];

  const headersLine = headersMap.map(header => header.translation);

  dataSheet.push(headersLine);

  dataSource.forEach(row => {
    const dataLine = headersMap.map(header => {
      return row[header.name];
    });
    dataSheet.push(dataLine);
  });

  const sheets = [{
    name: translations.GOALS_EXPORT_TITLE,
    data: dataSheet,
  }];

  exportData(sheets, `${organisationId}_goals`, 'xlsx');
};

/**
 * Audience Segments
 */
const exportAudienceSegments = (organisationId, datamartId, dataSource, filter, translations) => {

  const titleLine = [translations.AUDIENCE_SEGMENTS_EXPORT_TITLE];
  const blankLine = [];

  const dataSheet = [];

  dataSheet.push(titleLine);
  dataSheet.push([`${translations.FROM} ${filter.from.format('YYYY-MM-DD')} ${translations.TO} ${filter.to.format('YYYY-MM-DD')}`]);
  dataSheet.push(blankLine);

  if (filter.keywords) {
    dataSheet.push(['Search keywords', filter.keywords]);
  }
  if (filter.types.length > 0) {
    dataSheet.push(['Displayed types', filter.statuses.join(', ')]);
  }

  dataSheet.push(blankLine);

  const headersMap = [
    { name: 'type', translation: translations.TYPE },
    { name: 'name', translation: translations.NAME },
    { name: 'user_points', translation: translations.USER_POINTS },
    { name: 'user_accounts', translation: translations.USER_ACCOUNTS },
    { name: 'emails', translation: translations.EMAILS },
    { name: 'user_point_additions', translation: translations.ADDITION },
    { name: 'user_point_deletions', translation: translations.DELETION },
  ];

  const headersLine = headersMap.map(header => header.translation);

  dataSheet.push(headersLine);

  dataSource.forEach(row => {
    const dataLine = headersMap.map(header => {
      return row[header.name];
    });
    dataSheet.push(dataLine);
  });

  const sheets = [{
    name: translations.DISPLAY_CAMPAIGNS_EXPORT_TITLE,
    data: dataSheet,
  }];

  exportData(sheets, `${organisationId}_${datamartId}_audience-segments`, 'xlsx');
};

/**
 * Audience Segment Dashboard
 */
const exportAudienceSegmentDashboard = (organisationId, datamartId, segmentData, overlapData, filter, formatMessage) => {
  const overviewHeaders = [
    { name: 'day', translation: formatMessage(dateMessages.day) },
    { name: 'user_points', translation: formatMessage(segmentMessages.userPoints) },
    { name: 'user_accounts', translation: formatMessage(segmentMessages.userAccounts) },
    { name: 'emails', translation: formatMessage(segmentMessages.emails) },
    { name: 'desktop_cookie_ids', translation: formatMessage(segmentMessages.desktopCookieId) },
  ];

  const additionDeletionHeaders = [
    { name: 'day', translation: dateMessages.day.defaultMessage },
    { name: 'user_point_additions', translation: formatMessage(segmentMessages.userPointAddition) },
    { name: 'user_point_deletions', translation: formatMessage(segmentMessages.userPointDeletion) }
  ];

  const overlapHeaders = [
    { name: 'xKey', translation: formatMessage(segmentMessages.overlap) },
    { name: 'yKey', translation: formatMessage(segmentMessages.overlapNumber) }
  ];

  const sheets = [
    addSheet(exportMessages.audienceSegmentOverviewExportTitle, segmentData, overviewHeaders, filter, formatMessage),
    addSheet(exportMessages.audienceSegmentAdditionsDeletionsExportTitle, segmentData, additionDeletionHeaders, filter, formatMessage),
    addSheet(exportMessages.overlapExportTitle, overlapData, overlapHeaders, filter, formatMessage)
  ].filter(x => x);

  if (sheets.length) {
    exportData(sheets, `${organisationId}_${datamartId}_audience-segments`, 'xlsx');
  }
};

export default {
  exportData,
  exportGoals,
  exportEmailCampaigns,
  exportAudienceSegments,
  exportDisplayCampaigns,
  exportDisplayCampaignDashboard,
  exportAudienceSegmentDashboard
};
