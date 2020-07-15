import * as React from 'react';
import * as cuid_ from 'cuid';
import * as Antd from 'antd';
import { PopoverProps } from 'antd/lib/popover';
import { DropDownProps } from 'antd/lib/dropdown';
import { SelectProps } from 'antd/lib/select';
import { DatePickerProps } from 'antd/lib/date-picker/interface';

const cuid = cuid_;

function withPopupContainer<T>(Component: React.ComponentClass<any>) {
  return class EnhancedComponent extends React.Component<T> {
    randomId = cuid();

    attachToDOM = () => document.getElementById(this.randomId);

    render() {
      return (
        <span id={this.randomId}>
          <Component getPopupContainer={this.attachToDOM} {...this.props} />
        </span>
      );
    }
  };
}

function withCalendarContainer<T>(Component: React.ComponentClass<any>) {
  return class EnhancedComponent extends React.Component<T> {
    randomId = cuid();

    attachToDOM = () => document.getElementById(this.randomId);

    render() {
      return (
        <span id={this.randomId}>
          <Component getCalendarContainer={this.attachToDOM} {...this.props} />
        </span>
      );
    }
  };
}

export const Popover = withPopupContainer<PopoverProps>(Antd.Popover);

export const Dropdown = withPopupContainer<DropDownProps>(Antd.Dropdown);

export const Select = withPopupContainer<SelectProps>(Antd.Select);
export const DatePicker = withCalendarContainer<DatePickerProps>(
  Antd.DatePicker,
);
