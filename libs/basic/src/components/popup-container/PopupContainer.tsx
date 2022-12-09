import React from 'react';
import cuid from 'cuid';
import {
  Popover as AntdPopover,
  Dropdown as AntdDropdown,
  Select as AntdSelect,
  DatePicker as AntdDatePicker,
} from 'antd';
import { PopoverProps } from 'antd/lib/popover';
import { DropDownProps } from 'antd/lib/dropdown';
import { SelectProps } from 'antd/lib/select';
import { DatePickerProps } from 'antd/lib/date-picker';

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

export const Popover = withPopupContainer<PopoverProps>(AntdPopover as any);

export const Dropdown = withPopupContainer<DropDownProps>(AntdDropdown as any);

export const Select = withPopupContainer<SelectProps<any>>(AntdSelect as any);
export const DatePicker = withCalendarContainer<DatePickerProps>(AntdDatePicker);
