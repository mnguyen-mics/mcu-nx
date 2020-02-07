import * as React from 'react';
import { DatePicker, Radio, Input, InputNumber, Col, Select } from 'antd';
import moment from 'moment';
import { WrappedFieldProps } from 'redux-form';
import { DatePickerProps } from 'antd/lib/date-picker/interface';
import { FormItemProps } from 'antd/lib/form/FormItem';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

import FormFieldWrapper, { FormFieldWrapperProps } from '../../../../../../../components/Form/FormFieldWrapper';
import { RadioChangeEvent } from 'antd/lib/radio';
import { defineMessages, FormattedMessage } from 'react-intl';

const messages = defineMessages({
  absolute: {
    id: 'queryTool.datepicker.label.absolute',
    defaultMessage: 'Absolute'
  },
  relative: {
    id: 'queryTool.datepicker.label.relative',
    defaultMessage: 'Relative'
  },
  days: {
    id: 'queryTool.datepicker.label.days',
    defaultMessage: 'Days'
  },
  month: {
    id: 'queryTool.datepicker.label.month',
    defaultMessage: 'Month'
  },
  year: {
    id: 'queryTool.datepicker.label.year',
    defaultMessage: 'Year'
  },
  ago: {
    id: 'queryTool.datepicker.label.ago',
    defaultMessage: 'Ago'
  }
 
})

export interface FormRelativeAbsoluteDateProps  extends FormFieldWrapperProps {
  formItemProps: FormItemProps;
  datePickerProps?: DatePickerProps;
  unixTimstamp?: boolean;
  small?: boolean;
}

type DateType = 'ABSOLUTE' | 'RELATIVE'
type DateRelativePeriodType = 'd' | 'M' | 'y'

export interface FormRelativeAbsoluteDateState {
  datePickerType: DateType;
  relativePeriod: DateRelativePeriodType;
}

export default class FormRelativeAbsoluteDate extends React.Component<
  FormRelativeAbsoluteDateProps & WrappedFieldProps,
  FormRelativeAbsoluteDateState
> {

  constructor(props: FormRelativeAbsoluteDateProps & WrappedFieldProps) {
    super(props)
    this.state = {
      datePickerType: this.getValueType(props.input.value),
      relativePeriod: 'd'
    }
  }

  componentDidMount() {
    if (!this.props.input.value || this.props.input.value.length === 0) {
      if (this.state.datePickerType === 'RELATIVE') {
        this.props.input.onChange(['now-1d'])
      } else {
        if (!this.props.unixTimstamp) {
          this.props.input.onChange([moment().startOf('day').toISOString()])
        } else {
          this.props.input.onChange([moment().startOf('day').valueOf()])
        }
      }
    }
  }
  

  getValueType = (value: Array<string | number>): DateType => {
    if (value && value.length && value[0]) {
      if (typeof value[0] === 'string') {
        return (value[0] as string).indexOf('now') > -1 ? 'RELATIVE' : 'ABSOLUTE'
      }
    }
    return 'ABSOLUTE';
  }

  getNumericRelativeValue = (value: string): number => {
    if (value && typeof value === 'string') {
      if (value === 'now') {
        return 0
      } else if (value.indexOf('now-') > -1) {
        const parsedValue = parseInt(value.replace(/now\-/g, '').replace(/\//g, '').replace(/M/g, '').replace(/d/g, '').replace(/y/g, ''), 0)
        return  isNaN(parsedValue) ? 0 : parsedValue;
      }
      return 0;
    }
    return 0;
  }

  onValueChange = (e: number | undefined) => {
    if (!isNaN(e as number)) {
      return this.generateRelativeValue(e);
    }
  }

  generateRelativeValue = (value: number | undefined) => {
    return this.props.input.onChange([`now-${value}${this.state.relativePeriod}/${this.state.relativePeriod}`])
  }

  render() {
    let validateStatus = 'success' as
      | 'success'
      | 'warning'
      | 'error'
      | 'validating';
    if (this.props.meta.touched && this.props.meta.invalid) validateStatus = 'error';
    if (this.props.meta.touched && this.props.meta.warning) validateStatus = 'warning';

    // By default, input.value is initialised to '' by redux-form
    // But antd DatePicker doesn't like that
    // So we don't pass this this.props if equal to ''

    let value;

    if (this.state.datePickerType === 'ABSOLUTE') {
      value = this.props.input.value.length ? moment(this.props.input.value[0]) : moment().startOf('day');
    } else {
      value = this.getNumericRelativeValue(this.props.input.value[0]);
    }

    const onDatePickerChange = (date: moment.Moment, dateString: string) => {
      return this.props.unixTimstamp ? this.props.input.onChange([date.startOf('day').valueOf()]) : this.props.input.onChange([date.startOf('day')]);
    };

    const onRadioChange = (e: RadioChangeEvent) => {
      this.setState({ datePickerType: e.target.value })
      const newValue = e.target.value === 'ABSOLUTE' ?  this.props.unixTimstamp ? moment().startOf('day').valueOf() : moment().startOf('day').toISOString() : 'now'
      this.props.input.onChange([newValue]);
    }
    const onPeriodChange = (val: DateRelativePeriodType) => { this.setState({ relativePeriod: val }, () => this.generateRelativeValue(this.getNumericRelativeValue(this.props.input.value[0])))}
    return (
      <FormFieldWrapper
        help={this.props.meta.touched && (this.props.meta.warning || this.props.meta.error)}
        helpToolTipProps={this.props.helpToolTipProps}
        validateStatus={validateStatus}
        small={this.props.small}
        {...this.props.formItemProps}
      >
        <div style={{ marginBottom: 20 }}>
          <RadioGroup style={{ width: '100%' }} defaultValue={this.state.datePickerType} onChange={onRadioChange}>
            <RadioButton style={{ width: '50%' }} value="ABSOLUTE"><FormattedMessage {...messages.absolute} /></RadioButton>
            <RadioButton style={{ width: '50%' }} value="RELATIVE"><FormattedMessage {...messages.relative} /></RadioButton>
          </RadioGroup>
        </div>
        <div>
          {this.state.datePickerType === 'ABSOLUTE' ? <DatePicker
            allowClear={false}
            value={moment(value)}
            onChange={onDatePickerChange}
            style={{ width: "100%" }}
            defaultValue={moment().startOf('day')}
            {...this.props.datePickerProps}
          /> : <div>
             <InputGroup compact={true} >
                <Col span={15}>
                  <InputNumber style={{ width: '100%' }} defaultValue={1} value={value as number} onChange={this.onValueChange} />
                </Col>
                <Col span={7}>
                <Select defaultValue={this.state.relativePeriod} onChange={onPeriodChange} getPopupContainer={this.props.datePickerProps && this.props.datePickerProps.getCalendarContainer}>
                  <Select.Option value="d"><FormattedMessage {...messages.days} /></Select.Option>
                  <Select.Option value="M"><FormattedMessage {...messages.month} /></Select.Option>
                  <Select.Option value="y"><FormattedMessage {...messages.year} /></Select.Option>
                </Select>
                </Col>
                <Col span={2} style={{ height: 40, lineHeight: '40px' }}>
                  <FormattedMessage {...messages.ago} />
                </Col>
              </InputGroup>
          </div>}
        </div>
      </FormFieldWrapper>
    );
  }
}
