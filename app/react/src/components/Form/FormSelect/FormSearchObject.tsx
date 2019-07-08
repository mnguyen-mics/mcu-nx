import * as React from 'react';
import { Select, Spin } from 'antd';

// TS Interface
import { WrappedFieldProps } from 'redux-form';
import { TooltipProps } from 'antd/lib/tooltip';
import { FormItemProps } from 'antd/lib/form/FormItem';

import FormFieldWrapper from '../FormFieldWrapper';
import { LabeledValue, SelectProps } from 'antd/lib/select';

const { Option } = Select;

export interface FormSearchObjectProps {
  formItemProps?: FormItemProps;
  selectProps?: SelectProps;
  helpToolTipProps?: TooltipProps;
  loadOnlyOnce?: boolean;
  fetchListMethod: (keyword: string) => Promise<LabeledValue[]>;
  fetchSingleMethod: (id: string) => Promise<LabeledValue>;
  type?: string;
  small?: boolean;
}

interface FormSearchObjectState {
  data: LabeledValue[];
  value?: LabeledValue[];
  fetching: boolean;
  initialFetch?: boolean;
  currentValue?: string;
}

type Props = FormSearchObjectProps & WrappedFieldProps;

class FormSearchObject extends React.Component<
  Props,
  FormSearchObjectState
  > {
  static defaultprops = {
    formItemProps: {},
    inputProps: {},
    helpToolTipProps: {},
  };

  constructor(props: Props) {
    super(props)
    this.state = {
      data: [],
      fetching: false
    }
  }

  componentDidMount() {
    const {
      input
    } = this.props;

    this.fetchInitialData(input.value);
    this.fetchData("")
  }

  componentDidUpdate(prevProps: Props, prevState: FormSearchObjectState) {

    const {
      type,
      input
    } = this.props;

    const {
      type: prevType
    } = prevProps;

    if (type !== prevType) {
      this.fetchInitialData(input.value);
      this.fetchData("")
    }
  }
  


  fetchInitialData = (values: string[]) => {
    const { fetchSingleMethod } = this.props;
    this.setState({ initialFetch: true })
    return Promise.all(values.map(i => fetchSingleMethod(i))).then(res => {
      this.setState({ value: res, initialFetch: false })
    })
  }

  fetchData = (value: string) => {
    const {
      fetchListMethod,
    } = this.props;

    this.setState({ fetching: true })
    fetchListMethod(
      value
    ).then(res => {
      this.setState({
        data: res,
        fetching: false
      })
    })
  }

  handleChange = (value: LabeledValue[]) => {
    const { input } = this.props;
    this.setState({ value, currentValue: undefined })
    input.onChange(value.map(i => i.key))
  }

  onSearch = (val: string) => {
    this.setState({ currentValue: val });
  }

  onInputKeyDown = () => {
    const { input } = this.props;
    const { value, currentValue } = this.state;
    const formattedValue: LabeledValue[] = [];
    if (value) {
      formattedValue.concat(value)
    }
    const finalValue = [...formattedValue.map(i => i.key)];
    if (currentValue) {
      finalValue.push(currentValue)
    }
    input.onChange(finalValue)
  } 

  render() {
    const {
      meta,
      formItemProps,
      helpToolTipProps,
      small,
      selectProps,
      loadOnlyOnce
    } = this.props;

    let validateStatus = 'success' as
      | 'success'
      | 'warning'
      | 'error'
      | 'validating';
    if (meta.touched && meta.invalid) validateStatus = 'error';
    if (meta.touched && meta.warning) validateStatus = 'warning';

    const options = this.state.data.map(d => <Option key={d.key} value={d.key}>{d.label}</Option>);

    return (
      <FormFieldWrapper
        help={meta.touched && (meta.warning || meta.error)}
        helpToolTipProps={helpToolTipProps}
        validateStatus={validateStatus}
        small={small}
        {...formItemProps}
      >
        <Spin spinning={this.state.initialFetch}>
          <Select
            mode="tags"
            labelInValue={true}
            value={this.state.value}
            placeholder={'Search'}
            defaultActiveFirstOption={false}
            filterOption={false}
            onSearch={loadOnlyOnce ? this.onSearch : this.fetchData}
            onInputKeyDown={loadOnlyOnce ? this.onInputKeyDown : undefined}
            onChange={this.handleChange}
            notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
            style={{ width: '100%' }}
            {...selectProps}
          >
            {options}
          </Select>
        </Spin>
        
      </FormFieldWrapper>
    );
  }
}

export default FormSearchObject;
