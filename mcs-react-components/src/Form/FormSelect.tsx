import * as React from 'react';
import { Select, Col } from 'antd';
import cuid from 'cuid';

// TS Interfaces
import { WrappedFieldProps } from 'redux-form';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { SelectProps, OptionProps } from 'antd/lib/select';

import FormFieldWrapper, { FormFieldWrapperProps } from './FormFieldWrapper';

export interface FormSelectProps {
  formItemProps?: FormItemProps;
  selectProps?: SelectProps;
  options?: OptionProps[];
}

const Option = Select.Option;

function documentGetElementById(id: string) {
  return () => document.getElementById(id) as HTMLElement;
}

class FormSelect extends React.Component<FormSelectProps & FormFieldWrapperProps & WrappedFieldProps> {

  static defaultprops = {
    formItemProps: {},
    selectProps: {},
    options: [],
    helpToolTipProps: {},
  };

  containerId = cuid();

  componentDidMount() {
    this.setDefaultValue();
  }

  componentDidUpdate() {
    this.setDefaultValue();
  }

  setDefaultValue = () => {
    const {
      options,
      input: {
        value,
        onChange,
      },
    } = this.props;

    if (options && options.length === 1 && (!value || value === '')) {
      onChange(options[0].value);
    }
  }

  render() {
    const {
      input: { value, onChange, onFocus },
      meta,
      formItemProps,
      selectProps,
      options,
      helpToolTipProps,
    } = this.props;

    let validateStatus = 'success' as 'success' | 'warning' | 'error' | 'validating';
    if (meta.touched && meta.invalid) validateStatus = 'error';
    if (meta && meta.touched && meta.warning) validateStatus = 'warning';

    const optionsToDisplay = options!.map(option => (
      <Option key={option.value} value={option.value}>{option.title}</Option>
    ));

    return (
        <FormFieldWrapper
          help={meta.touched && (meta.warning || meta.error)}
          helpToolTipProps={helpToolTipProps}
          validateStatus={validateStatus}
          {...formItemProps}
        >
          <Col span={22}>
            <div id={this.containerId}>
              <Select
                {...selectProps}
                getPopupContainer={documentGetElementById(this.containerId)}
                onChange={onChange}
                // difficulties to map some WrappedFieldInputProps with SelectProps
                onBlur={onChange as () => any}
                onFocus={onFocus as () => any}
                value={value}
              >
                {optionsToDisplay}
              </Select>
            </div>
          </Col>
        </FormFieldWrapper>
    );
  }
}

export default FormSelect;
