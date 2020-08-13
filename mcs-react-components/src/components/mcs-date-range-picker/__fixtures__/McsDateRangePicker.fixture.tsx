import * as React from 'react';
import McsDateRangePicker, {
  McsDateRangePickerProps,
  McsDateRangeValue,
} from '../McsDateRangePicker';
import McsMoment from '../../../utils/McsMoment';
import { IntlProvider } from 'react-intl';

const handleDatePickerMenuChange = (dates: McsDateRangeValue) => dates;

const props: McsDateRangePickerProps = {
  values: { from: new McsMoment(1597147165831), to: new McsMoment(1597247165831) },
  onChange: handleDatePickerMenuChange,
  excludeToday:true,
  startDate:1587147165831
};
const component = (_props: McsDateRangePickerProps) => (
  <IntlProvider locale="en">
    <McsDateRangePicker {..._props} />
  </IntlProvider>
);

component.displayName = 'McsDateRangePicker';

export default {
  component,
  props,
};
