import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import McsDateRangePicker, {
  McsDateRangePickerProps,
  McsDateRangeValue,
} from '../McsDateRangePicker';
import McsMoment from '../../../utils/McsMoment';
jest.mock('cuid', () => () => '123');

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
it('should render a disabled date range picker', () => {
  const handleDatePickerMenuChange = (dates: McsDateRangeValue) => dates;

  const props: McsDateRangePickerProps = {
    values: {
      from: new McsMoment('2020-08-03'),
      to: new McsMoment('2020-08-04'),
    },
    onChange: handleDatePickerMenuChange,
    excludeToday: true,
    startDate: 1587147165831,
    disabled: true,
    messages,
  };
  const component = TestRenderer.create(<McsDateRangePicker {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});
it('should render a date range picker without the start date', () => {
  const handleDatePickerMenuChange = (dates: McsDateRangeValue) => dates;
  const props: McsDateRangePickerProps = {
    values: {
      from: new McsMoment('2020-08-02'),
      to: new McsMoment('2020-08-03'),
    },
    onChange: handleDatePickerMenuChange,
    excludeToday: true,
    messages,
  };
  const component = TestRenderer.create(<McsDateRangePicker {...props} />);
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});
