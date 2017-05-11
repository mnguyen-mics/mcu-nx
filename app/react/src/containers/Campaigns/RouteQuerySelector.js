import moment from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD';

export const EMAIL_QUERY_SETTINGS = [
  {
    paramName: 'currentPage',
    defaultValue: 1,
    deserialize: query => parseInt(query.currentPage, 0),
    serialize: value => value.toString(),
    isValid: query => query.currentPage && !isNaN(parseInt(query.currentPage, 0))
  },
  {
    paramName: 'pageSize',
    defaultValue: 10,
    deserialize: query => parseInt(query.pageSize, 0),
    serialize: value => value.toString(),
    isValid: query => query.pageSize && !isNaN(parseInt(query.pageSize, 0))
  },
  {
    paramName: 'keywords',
    defaultValue: '',
    deserialize: query => query.keywords,
    serialize: value => value,
    isValid: () => true
  },
  {
    paramName: 'statuses',
    defaultValue: [],
    deserialize: query => {
      if (query.statuses) {
        return query.statuses.split(',');
      }
      return [];
    },
    serialize: value => value.join(','),
    isValid: query => !query.statuses || query.statuses.split(',').length > 0
  },
  {
    paramName: 'rangeType',
    defaultValue: 'absolute',
    deserialize: query => query.rangeType,
    serialize: value => value,
    isValid: query => query.rangeType
  },
  {
    paramName: 'from',
    defaultValue: moment().subtract(7, 'days'),
    deserialize: query => moment(query.from, DATE_FORMAT),
    serialize: value => value.format(DATE_FORMAT),
    isValid: query => moment(query.from, DATE_FORMAT).isValid()
  },
  {
    paramName: 'to',
    defaultValue: moment(),
    deserialize: query => moment(query.to, DATE_FORMAT),
    serialize: value => value.format(DATE_FORMAT),
    isValid: query => moment(query.to, DATE_FORMAT).isValid()
  }
];

export const DISPLAY_QUERY_SETTINGS = EMAIL_QUERY_SETTINGS;
export const GOAL_QUERY_SETTINGS = EMAIL_QUERY_SETTINGS;

export const isQueryValid = (query = {}, settings) => {
  // notEmpty and must forall settings query isValid
  return Object.keys(query).length > 0 &&
    settings.reduce((acc, setting) => {
      return acc && setting.isValid(query);
    }, true);
};

// add missing and/or replace invalid params with default value
export const buildDefaultQuery = (existingQuery = {}, settings) => {
  return settings.reduce((acc, setting) => {
    if (setting.isValid(existingQuery)) {
      acc[setting.paramName] = existingQuery[setting.paramName];
    } else {
      acc[setting.paramName] = setting.serialize(setting.defaultValue);
    }
    return acc;
  }, {});
};

// merge query with serialized params object
export const updateQueryWithParams = (query, params, settings) => {
  const serializedParams = Object.keys(params).reduce((acc, paramName) => {
    const setting = settings.find(s => s.paramName === paramName);
    if (setting) {
      acc[paramName] = setting.serialize(params[paramName]);
    }
    return acc;
  }, {});
  return {
    ...query,
    ...serializedParams
  };
};

// run deserialize function on object keys and return a new object
export const deserializeQuery = (query, settings) => {
  return settings.reduce((acc, setting) => {
    acc[setting.paramName] = setting.deserialize(query);
    return acc;
  }, {});
};

