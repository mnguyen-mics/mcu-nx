import * as React from 'react';
import { Select } from 'antd';
import { SelectValue } from 'antd/lib/select';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { WrappedFieldProps } from 'redux-form';

import FormFieldWrapper, { FormFieldWrapperProps } from '../FormFieldWrapper';
import { RestrictedSelectProps } from './DefaultSelect';

const Option = Select.Option;

export interface FormTagSelectProps extends FormFieldWrapperProps {
  formItemProps: FormItemProps;
  selectProps?: RestrictedSelectProps & { options: Array<{ label: string, value: string }> };
  small?: boolean;
  valueAsString?: boolean;
}

const TagSelect: React.SFC<FormTagSelectProps & WrappedFieldProps> = props => {

  const {
    formItemProps,
    helpToolTipProps,
    input,
    meta,
    selectProps,
    small,
  } = props;

  let validateStatus = 'success' as 'success' | 'warning' | 'error' | 'validating';
  const mode = 'multiple' as 'multiple' | 'tags' | 'combobox';

  if (meta.touched && meta.invalid) {
    validateStatus = 'error';
  }
  if (meta.touched && meta.warning) {
    validateStatus = 'warning';
  }


  const value = 
    input.value === ''
      ? [] 
      : (props.valueAsString && !Array.isArray(input.value)) ? input.value.split(',') : input.value;


  const onChange = (selectValue: SelectValue) => {
    if (props.valueAsString && Array.isArray(selectValue)) {
      return input.onChange(selectValue.join(','));
    }
    return input.onChange(selectValue);
  };

  const optionsToDisplay = selectProps!.options.map(({ label, ...option }) => (
    <Option {...option} key={option.value}>{label}</Option>
  ));

  const onBlur = () => input.onBlur(undefined);

  return (
    <FormFieldWrapper
      help={meta.touched && (meta.warning || meta.error)}
      helpToolTipProps={helpToolTipProps}
      validateStatus={validateStatus}
      small={small}
      {...formItemProps}
    >
      <Select
        {...selectProps}
        mode={mode}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={input.onFocus as () => any}
        value={value}
      >{optionsToDisplay}
      </Select>
    </FormFieldWrapper>
  );
};

export default TagSelect;
