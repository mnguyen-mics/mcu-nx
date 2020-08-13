import 'jest';
import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import McsDateRangePicker, {
  McsDateRangePickerProps,
  McsDateRangeValue,
} from '../McsDateRangePicker';
import McsMoment from '../../../utils/McsMoment';
import { IntlProvider } from 'react-intl';
jest.mock('cuid', () => () => '123');
it('should render a disabled date range picker', () => {
  const handleDatePickerMenuChange = (dates: McsDateRangeValue) => dates;
  const props: McsDateRangePickerProps = {
    values: {
      from: new McsMoment('now-15d'),
      to: new McsMoment('now-14d'),
    },
    onChange: handleDatePickerMenuChange,
    excludeToday: true,
    startDate: 1587147165831,
    disabled: true,
  };
  const component = TestRenderer.create(
    <IntlProvider locale="en">
      <McsDateRangePicker {...props} />
    </IntlProvider>,
  );
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});
it('should render a date range picker without the start date', () => {
  const handleDatePickerMenuChange = (dates: McsDateRangeValue) => dates;
  const props: McsDateRangePickerProps = {
    values: {
      from: new McsMoment('now-15d'),
      to: new McsMoment('now-14d'),
    },
    onChange: handleDatePickerMenuChange,
    excludeToday: true,
  };
  const component = TestRenderer.create(
    <IntlProvider locale="en">
      <McsDateRangePicker {...props} />
    </IntlProvider>,
  );
  const res = component.toJSON();
  expect(res).toMatchSnapshot();
});
