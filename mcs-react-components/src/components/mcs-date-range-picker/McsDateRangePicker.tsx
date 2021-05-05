import * as React from 'react';
import { CalendarOutlined, DownOutlined } from '@ant-design/icons';
import { Button, DatePicker, Menu } from 'antd';
import moment from 'moment';
import { MenuInfo } from '../../../node_modules/rc-menu/lib/interface';
import { Dropdown } from '../popupContainer/PopupContainer';
import McsMoment, { convertMcsDateToMoment } from '../../utils/McsMoment';
import { InjectedIntlProps, defineMessages, injectIntl } from 'react-intl';

export interface McsDateRangeValue {
  from: McsMoment;
  to: McsMoment;
}

export interface McsDateRangePickerProps {
  values: McsDateRangeValue;
  onChange: (values: McsDateRangeValue) => void;
  format?: string;
  disabled?: boolean;
  excludeToday?: boolean;
  startDate?: number;
}

interface McsDateRangePickerState {
  showRangePicker?: boolean;
  ranges: Range[];
}

interface Range {
  name: 'TODAY' | 'YESTERDAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS';
  from: string;
  to: string;
}

const { RangePicker } = DatePicker;

const messages = defineMessages({
  TODAY: {
    id: 'components.mcsDateRangePicker.range.today',
    defaultMessage: 'Today',
  },
  YESTERDAY: {
    id: 'components.mcsDateRangePicker.range.yesterday',
    defaultMessage: 'Yesterday',
  },
  LAST_7_DAYS: {
    id: 'components.mcsDateRangePicker.range.last7days',
    defaultMessage: 'Last 7 days',
  },
  LAST_30_DAYS: {
    id: 'components.mcsDateRangePicker.range.last30days',
    defaultMessage: 'Last 30 days',
  },
  LOOKBACK_WINDOW: {
    id: 'components.mcsDateRangePicker.lookBackWindow',
    defaultMessage: 'Lookback Window',
  },
  CUSTOM: {
    id: 'components.mcsDateRangePicker.custom',
    defaultMessage: 'Custom',
  },
});

type Props = McsDateRangePickerProps & InjectedIntlProps;

class McsDateRangePicker extends React.Component<Props, McsDateRangePickerState> {
  static defaultProps: Partial<McsDateRangePickerProps> = {
    format: 'YYYY-MM-DD',
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      showRangePicker: false,
      ranges: [],
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
    const { values, format, intl } = this.props;
    const { ranges } = this.state;

    const selectedRange = ranges.find(range => {
      return range.from === values.from.raw() && range.to === values.to.raw();
    });

    if (selectedRange) {
      return intl.formatMessage(messages[selectedRange.name]);
    }
    return `${convertMcsDateToMoment(values.from.raw())!.format(format)} ~ ${convertMcsDateToMoment(
      values.to.raw(),
    )!.format(format)}`;
  }

  handleDatePickerMenuChange = (dates: [moment.Moment, moment.Moment]) => {
    const { onChange } = this.props;

    this.setState({ showRangePicker: false });

    onChange({
      from: new McsMoment(dates[0].format('YYYY-MM-DD')),
      to: new McsMoment(dates[1].format('YYYY-MM-DD')),
    });
  };

  handleDropdownMenuClick = (param: MenuInfo) => {
    const { ranges } = this.state;
    const { onChange } = this.props;

    if (param.key === 'CUSTOM') {
      this.setState({
        showRangePicker: true,
      });
      return;
    }

    this.setState({ showRangePicker: false });

    const selectedRange = ranges.find(element => {
      return element.name.toLowerCase() === param.key.toString().toLowerCase();
    });

    onChange({
      from: new McsMoment(selectedRange!.from),
      to: new McsMoment(selectedRange!.to),
    });
  };

  onDatePickerOpenChange = () => {
    this.setState({
      showRangePicker: false,
    });
  };

  renderRangesDropdown() {
    const { intl, disabled } = this.props;
    const { ranges } = this.state;

    const menu = (
      <Menu onClick={this.handleDropdownMenuClick}>
        <Menu.ItemGroup title={intl.formatMessage(messages.LOOKBACK_WINDOW)}>
          {ranges.map(item => {
            return this.getSelectedPresettedRange() ===
              intl.formatMessage(messages[item.name]) ? null : (
              <Menu.Item key={item.name}>{intl.formatMessage(messages[item.name])}</Menu.Item>
            );
          })}
          <Menu.Item key='CUSTOM'>{intl.formatMessage(messages.CUSTOM)}</Menu.Item>
        </Menu.ItemGroup>
      </Menu>
    );

    return (
      <Dropdown
        className='mcs-date-range-picker'
        overlay={menu}
        trigger={['click']}
        disabled={disabled}
      >
        <Button>
          <CalendarOutlined />
          {this.getSelectedPresettedRange()}
          <DownOutlined />
        </Button>
      </Dropdown>
    );
  }

  render() {
    const { values } = this.props;
    const { showRangePicker } = this.state;
    const fromMoment = values.from.toMoment();
    const toMoment = values.to.toMoment();
    return showRangePicker ? (
      <RangePicker
        allowClear={false}
        className='mcs-date-range-picker'
        onChange={this.handleDatePickerMenuChange}
        defaultValue={[fromMoment, toMoment]}
        disabledDate={this.disableDates}
        onOpenChange={this.onDatePickerOpenChange}
        open={showRangePicker}
      />
    ) : (
      this.renderRangesDropdown()
    );
  }
}

// TODO replace any with correct type
export default injectIntl(McsDateRangePicker);
