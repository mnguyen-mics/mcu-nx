import * as React from 'react';
import { CalendarOutlined, ClockCircleOutlined, DownOutlined } from '@ant-design/icons';
import { Button, DatePicker, Menu } from 'antd';
import moment from 'moment';
import { MenuInfo } from '../../../node_modules/rc-menu/lib/interface';
import { Dropdown } from '../popup-container/PopupContainer';
import McsMoment, { convertMcsDateToMoment } from '../../utils/McsMoment';
import OnOutsideClick from 'react-outclick';
import { AbstractMessages } from '../../utils/IntlHelper';

export interface McsDateRangeValue {
  from: McsMoment;
  to: McsMoment;
}

export interface McsDateRangePickerProps {
  className?: string;
  values: McsDateRangeValue;
  onChange: (values: McsDateRangeValue) => void;
  format?: string;
  disabled?: boolean;
  excludeToday?: boolean;
  startDate?: number;
  messages: McsDateRangePickerMessages;
}

interface McsDateRangePickerState {
  showDropdown?: boolean;
  datePickerOpen?: boolean;
  ranges: Range[];
  rangeType: 'ABSOLUTE' | 'RELATIVE';
}

export interface McsDateRangePickerMessages extends AbstractMessages {
  TODAY: string;
  YESTERDAY: string;
  LAST_7_DAYS: string;
  LAST_30_DAYS: string;
  LOOKBACK_WINDOW: string;
  CUSTOM: string;
  ABSOLUTE_TIME_RANGE: string;
  RELATIVE_TIME_RANGE: string;
}

interface Range {
  name: 'TODAY' | 'YESTERDAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS';
  from: string;
  to: string;
}

const { RangePicker } = DatePicker;

type Props = McsDateRangePickerProps;
const defaultFormat = 'YYYY-MM-DD';

class McsDateRangePicker extends React.Component<Props, McsDateRangePickerState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showDropdown: false,
      ranges: [],
      rangeType: 'RELATIVE',
    };
  }

  componentDidMount() {
    const { excludeToday, startDate } = this.props;
    const ranges: Range[] = [
      {
        name: 'TODAY',
        from: 'now',
        to: 'now',
      },
      {
        name: 'YESTERDAY',
        from: 'now-1d',
        to: 'now-1d',
      },
    ];

    if (!startDate) {
      ranges.push(
        {
          name: 'LAST_7_DAYS',
          from: excludeToday ? 'now-8d' : 'now-7d',
          to: excludeToday ? 'now-1d' : 'now',
        },
        {
          name: 'LAST_30_DAYS',
          from: excludeToday ? 'now-31d' : 'now-30d',
          to: excludeToday ? 'now-1d' : 'now',
        },
      );
    }

    this.setState({
      ranges,
    });
  }

  disableDates = (current: moment.Moment) => {
    const { startDate } = this.props;
    return (
      current && (current.valueOf() > Date.now() || (!!startDate && current.valueOf() < startDate))
    );
  };

  getSelectedPresettedRange() {
    const { values, format, messages } = this.props;
    const { ranges } = this.state;

    const selectedRange = ranges.find(range => {
      return range.from === values.from.raw() && range.to === values.to.raw();
    });

    if (selectedRange) {
      return messages[selectedRange.name];
    }
    return `${convertMcsDateToMoment(values.from.raw())!.format(
      format || defaultFormat,
    )} ~ ${convertMcsDateToMoment(values.to.raw())!.format(format || defaultFormat)}`;
  }

  handleDatePickerMenuChange = (dates: [moment.Moment, moment.Moment]) => {
    const { onChange } = this.props;
    this.setState({
      rangeType: 'ABSOLUTE',
    });
    onChange({
      from: new McsMoment(dates[0].format('YYYY-MM-DD')),
      to: new McsMoment(dates[1].format('YYYY-MM-DD')),
    });
  };

  handleDropdownMenuClick = (param: MenuInfo) => {
    const { ranges } = this.state;
    const { onChange } = this.props;

    if (param.key !== 'CUSTOM') {
      this.setState({
        showDropdown: false,
        rangeType: 'RELATIVE',
      });

      const selectedRange = ranges.find(element => {
        return element.name.toLowerCase() === param.key.toString().toLowerCase();
      });

      onChange({
        from: new McsMoment(selectedRange!.from),
        to: new McsMoment(selectedRange!.to),
      });
    }
  };

  onDatePickerOpenChange = (open: boolean) => {
    this.setState({
      showDropdown: open,
      datePickerOpen: open,
    });
  };

  onDropdownClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    this.setState({ showDropdown: true });
  };

  handleClick = () => {
    const { showDropdown, datePickerOpen } = this.state;

    if (showDropdown && !datePickerOpen) {
      this.setState({ showDropdown: false });
    }
  };

  renderRangesDropdown() {
    const { disabled, values, messages, className } = this.props;
    const { ranges, showDropdown, rangeType } = this.state;
    const fromMoment = values.from.toMoment();
    const toMoment = values.to.toMoment();
    const menu = (
      <Menu onClick={this.handleDropdownMenuClick} className={'mcs-dateRangePicker_menu'}>
        <Menu.ItemGroup
          title={'Absolute time range'}
          className={
            'mcs-dateRangePicker_menu_timeType mcs-dateRangePicker_menu_timeType--absolute'
          }
        >
          <Menu.Item
            className={'mcs-dateRangePicker_menu_item mcs-dateRangePicker_menu_item--rangePicker'}
            key='CUSTOM'
          >
            <RangePicker
              allowClear={false}
              className='mcs-dateRangePicker_rangePicker'
              onChange={this.handleDatePickerMenuChange}
              defaultValue={[fromMoment, toMoment]}
              disabledDate={this.disableDates}
              onOpenChange={this.onDatePickerOpenChange}
              value={[fromMoment, toMoment]}
            />
          </Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup
          title={messages.RELATIVE_TIME_RANGE}
          className={'mcs-dateRangePicker_menu_timeType'}
        >
          {ranges.map(item => {
            return (
              <Menu.Item
                className={
                  this.getSelectedPresettedRange() === messages[item.name]
                    ? 'mcs-dateRangePicker_menu_item mcs-dateRangePicker_menu_item--selected'
                    : 'mcs-dateRangePicker_menu_item'
                }
                key={item.name}
              >
                {messages[item.name]}
              </Menu.Item>
            );
          })}
        </Menu.ItemGroup>
      </Menu>
    );

    return (
      <OnOutsideClick onOutsideClick={this.handleClick} display={'inline'}>
        <Dropdown
          className={`mcs-dateRangePicker ${className ? className : ''}`}
          overlay={menu}
          trigger={['click']}
          disabled={disabled}
          visible={showDropdown}
        >
          <Button onClick={this.onDropdownClick}>
            {rangeType === 'ABSOLUTE' ? <CalendarOutlined /> : <ClockCircleOutlined />}
            {this.getSelectedPresettedRange()}
            <DownOutlined />
          </Button>
        </Dropdown>
      </OnOutsideClick>
    );
  }

  render() {
    return this.renderRangesDropdown();
  }
}

export default McsDateRangePicker;
