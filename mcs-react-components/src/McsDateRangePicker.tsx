import * as React from 'react';
// import { Dropdown, Button, DatePicker, Menu, Icon } from 'antd';
import * as moment from 'moment';
// import { ClickParam } from 'antd/lib/menu';
// import { FormattedMessage, injectIntl, InjectedIntlProps, defineMessages } from 'react-intl';
import { injectIntl, InjectedIntlProps } from 'react-intl';

export type McsDateRangeValue = McsDateRangeAbsoluteValue | McsDateRangeRelativeValue;

export interface McsDateRangeAbsoluteValue {
  rangeType: 'absolute';
  from: moment.Moment;
  to: moment.Moment;
}

export interface McsDateRangeRelativeValue {
  rangeType: 'relative';
  lookbackWindow: moment.Duration;
}

export interface McsDateRangePickerProps {
  values: McsDateRangeValue;
  onChange: (values: McsDateRangeValue) => void;
  format?: string;
}

interface McsDateRangePickerState {
  showRangePicker?: boolean;
}

// interface Range {
//   name: 'TODAY' | 'YESTERDAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS';
//   from: moment.Moment;
//   to: moment.Moment;
//   message: FormattedMessage.MessageDescriptor;
// }

// const { RangePicker } = DatePicker;

// const currentTimeStampInt = parseInt(moment().format('X'), 10); // radix is needed
// const numberOfSecondsInOneDay = 3600 * 24;

// const messages = defineMessages({
//   today: { id: 'date_range_today', defaultMessage: 'Today' },
//   yesterday: { id: 'date_range_yesterday', defaultMessage: 'Yesterday' },
//   last7Days: { id: 'date_range_last_7_days', defaultMessage: 'Last 7 days' },
//   last30Days: { id: 'date_range_last_30_days', defaultMessage: 'Last 30 days' },
//   seconds: { id: 'date_range_seconds', defaultMessage: 'seconds' },
// });

// const ranges: Range[] = [
//   {
//     name: 'TODAY',
//     from : moment.unix(currentTimeStampInt).startOf('day'),
//     to: moment.unix(currentTimeStampInt + numberOfSecondsInOneDay).startOf('day'),
//     message: messages.today,  
//   },
//   {
//     name: 'YESTERDAY',
//     from : moment.unix(currentTimeStampInt - numberOfSecondsInOneDay).startOf('day'),
//     to: moment.unix(currentTimeStampInt).startOf('day'),
//     message: messages.yesterday,
//   },
//   {
//     name: 'LAST_7_DAYS',
//     from: moment.unix(currentTimeStampInt - (7 * numberOfSecondsInOneDay)).startOf('day'),
//     to: moment.unix(currentTimeStampInt + numberOfSecondsInOneDay).startOf('day'),
//     message: messages.last7Days,
//   },
//   {
//     name: 'LAST_30_DAYS',
//     from: moment.unix(currentTimeStampInt - (30 * numberOfSecondsInOneDay)).startOf('day'),
//     to: moment.unix(currentTimeStampInt + numberOfSecondsInOneDay).startOf('day'),
//     message: messages.last30Days,
//   },
// ];

class McsDateRangePicker extends React.Component<McsDateRangePickerProps & InjectedIntlProps, McsDateRangePickerState> {

  // static defaultProps: Partial<McsDateRangePickerProps> = {
  //   format: 'YYYY-MM-DD',
  // };

  // constructor(props: McsDateRangePickerProps & InjectedIntlProps){
  //   super(props);
  //   this.state = {
  //     showRangePicker: false,  
  //   }
  // }  

  // getSelectedRange(value: McsDateRangeRelativeValue): Range | undefined {    

  //   // Math.ceil(values.lookbackWindow!.asSeconds()).toString().concat(' ', intl.formatMessage(messages.seconds))
  //   //`${values.from!.format(format)} ~ ${values.to!.format(format)}`;
  //   return ranges.find((range) => {
  //     const ceil1 = Math.ceil(moment
  //       .duration({ from: range.from, to: range.to })
  //       .asSeconds(),
  //     );
  //     return (ceil1 === Math.ceil(values.lookbackWindow!.asSeconds())
  //       && (range.to.unix() === (values.to ? values.to.unix() : null)));
  //   });
    
  //   // return intl.formatMessage({ id: 'error', defaultMessage: 'Error'});
  // }

  // handleDatePickerMenuChange = (dates: [moment.Moment, moment.Moment]) => {
  //   const { onChange } = this.props;

  //   this.setState({ showRangePicker: false });

  //   onChange({
  //     rangeType: 'absolute',
  //     from: dates[0],
  //     to: dates[1],
  //   });
  // }

  // handleDropdownMenuClick = (param: ClickParam) => {
  //   const { onChange } = this.props;

  //   if (param.key === 'CUSTOM') {
  //     this.setState({
  //       showRangePicker: true,
  //     });
  //     return;
  //   }

  //   this.setState({ showRangePicker: false });

  //   const selectedRange = ranges.find(element => {
  //     return element.name.toLowerCase() === param.key.toLowerCase();
  //   });

  //   onChange({
  //     lookbackWindow: moment.duration({ to: selectedRange!.to, from: selectedRange!.from }),
  //     rangeType: 'relative'
  //   });
  // }

  // onDatePickerOpenChange = () => {
  //   this.setState({
  //     showRangePicker: false,
  //   });
  // }  

  // renderRangesDropdown = () => {

  //   const { values } = this.props;

  //   if (values.rangeType === 'relative'){

  //   }

  //   const selectedRangeInPreset = this.getSelectedPresettedRange(); 

  //   const menu = (
  //     <Menu onClick={this.handleDropdownMenuClick}>
  //       <Menu.ItemGroup title={<FormattedMessage id="LOOKBACK_WINDOW" defaultMessage="Lookback Window"/>}>
  //         {
  //           ranges.map((item) => {
  //             return (this.getSelectedPresettedRange() === translations[item.name]
  //               ? null
  //               : <Menu.Item key={item.name}>{translations[item.name]}</Menu.Item>
  //             );
  //           })
  //         }
  //         <Menu.Item key="CUSTOM"><FormattedMessage id="date_range_custom" defaultMessage="Custom"/></Menu.Item>
  //       </Menu.ItemGroup>
  //     </Menu>
  //   );

  //   const 

  //   return (
  //     <Dropdown overlay={menu} trigger={['click']}>
  //       <Button>
  //         <Icon type="calendar" />
  //         {this.getSelectedPresettedRange()}
  //         <Icon type="down" />
  //       </Button>
  //     </Dropdown>
  //   );
  // }

  render() {
    // const { values } = this.props;
    // const { showRangePicker } = this.state;

    return 'FIX ME';

    // return showRangePicker === true
    //   ? (
    //       <RangePicker
    //         allowClear={false}
    //         onChange={this.handleDatePickerMenuChange}
    //         defaultValue={[values.from!, values.to!]}
    //         disabledDate={(current) => current.isAfter(moment.now())}
    //         onOpenChange={this.onDatePickerOpenChange}
    //         open={showRangePicker}
    //       />
    //     )
    //   : this.renderRangesDropdown();
  }
}

// TODO replace any with correct type
export default injectIntl(McsDateRangePicker);
