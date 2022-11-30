import * as React from 'react';
import McsDateRangePicker, {
  McsDateRangePickerProps,
  McsDateRangeValue,
} from '../McsDateRangePicker';
import McsMoment from '../../../utils/McsMoment';

const handleDatePickerMenuChange = (dates: McsDateRangeValue) => dates;

const messages = {
  TODAY: 'Today',
  YESTERDAY: 'Yesterday',
  LAST_7_DAYS: 'Last 7 days',
  LAST_30_DAYS: 'Last 30 days',
  LOOKBACK_WINDOW: 'Lookback Window',
  CUSTOM: 'Custom',
  ABSOLUTE_TIME_RANGE: 'Absolute time range',
  RELATIVE_TIME_RANGE: 'Relative time ranges',
};

const props: McsDateRangePickerProps = {
  values: { from: new McsMoment(1597147165831), to: new McsMoment(1597247165831) },
  onChange: handleDatePickerMenuChange,
  excludeToday: true,
  startDate: 1587147165831,
  messages: messages,
};
export default <McsDateRangePicker {...props} />;
