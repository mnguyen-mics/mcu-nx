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
      from: new McsMoment('2020-08-02'),
      to: new McsMoment('2020-08-03'),
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
      from: new McsMoment('2020-08-02'),
      to: new McsMoment('2020-08-03'),
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
