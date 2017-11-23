import React from 'react';
import { Col, Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import cuid from 'cuid';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { WrappedFieldProps } from 'redux-form';

import FormFieldWrapper, { FormFieldWrapperProps } from './FormFieldWrapper';

const Option = Select.Option;

export interface FormTagSelectProps {
  formItemProps: FormItemProps;
  selectProps?: SelectProps & { options: [{ label: string, value: string }] };
}

function documentGetElementById(id: string) {
  return () => document.getElementById(id) as HTMLElement;
}

const FormTagSelect: React.SFC<FormTagSelectProps & FormFieldWrapperProps & WrappedFieldProps> = props => {

  const {
    formItemProps,
    helpToolTipProps,
    input: { value, onChange, onFocus, onBlur },
    meta,
    selectProps,
  } = props;

  let validateStatus = 'success' as 'success' | 'warning' | 'error' | 'validating';
  const mode = 'multiple' as 'multiple' | 'tags' | 'combobox';

  if (meta.touched && meta.invalid) {
    validateStatus = 'error';
  }
  if (meta.touched && meta.warning) {
    validateStatus = 'warning';
  }

  const displayOptions = selectProps!.options.map(({ label, ...option }) => (
    <Option {...option} key={option.value}>{label}</Option>
  ));

  const containerId = cuid();

  return (
    <FormFieldWrapper
      help={meta.touched && (meta.warning || meta.error)}
      helpToolTipProps={helpToolTipProps}
      validateStatus={validateStatus}
      {...formItemProps}
    >
      <Col span={22}>
        <div id={containerId}>
          <Select
            {...selectProps}
            mode={mode}
            value={value || []}
            onChange={onChange}
            getPopupContainer={documentGetElementById(containerId)}
            // difficulties to map some WrappedFieldInputProps with SelectProps
            onBlur={onBlur as () => any}
            onFocus={onFocus as () => any}
          >
            {displayOptions}
          </Select>
        </div>
      </Col>
    </FormFieldWrapper>
  );
};

export default FormTagSelect;
