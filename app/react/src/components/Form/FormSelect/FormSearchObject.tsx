import * as React from 'react';
import { Select, Spin } from 'antd';
import {debounce} from 'lodash';
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
  shouldFilterData?: boolean;
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
  filteredData: LabeledValue[];
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

  private debounce = debounce;

  constructor(props: Props) {
    super(props)
    this.state = {
      data: [],
      filteredData: [],
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

  fetchInitialData = (values?: string | string[]) => {
    const { fetchSingleMethod, selectProps } = this.props;
    this.setState({ initialFetch: true })

    if(selectProps && selectProps.mode === "default") {
      const singleValue = values as string;

      if(!singleValue) {
        this.setState({ initialFetch: false });
        return;
      }

      fetchSingleMethod(singleValue).then(res => {
        this.setState({ value: [res], initialFetch: false })
      });
    } else {
      const multipleValues = values as string[];
      Promise.all(multipleValues.map(i => fetchSingleMethod(i))).then(res => {
        this.setState({ value: res, initialFetch: false })
      });
    }
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
      }, () => {
        this.filterData()
      })
    })
  }

  handleChange = (value: LabeledValue | LabeledValue[]) => {
    const { 
      input,
      selectProps
    } = this.props;

    if(selectProps && selectProps.mode === "default") {
      const singleValue = value as LabeledValue;
      this.setState({ value: [singleValue], currentValue: undefined }, () => { this.filterData() });
      input.onChange(singleValue.key);
    } else {
      const multipleValues = value as LabeledValue[];
      this.setState({ value: multipleValues, currentValue: undefined }, () => { this.filterData() });
      input.onChange(multipleValues.map(i => i.key));
    }
  }

  onSearch = (val: string) => {
    this.setState({ currentValue: val });
    this.debounce(this.filterData, 300, { leading: false, trailing: true })()
  }

  filterData = () => {
    const {
      currentValue
    } = this.state;
    const {
      shouldFilterData
    } = this.props;
    if (shouldFilterData) {
      const getLatestTypedValue = (): string => {
        if (currentValue) {
          return currentValue
        }
        return ""
      }
      const typedValue = getLatestTypedValue();
      const opts = this.state.data.filter(v => {
        return v.key.toLocaleLowerCase().startsWith(typedValue)
      }).slice(0,100);
      this.setState({ filteredData: opts });
    } else {
      this.setState({ filteredData: this.state.data })
    }
   
  }

  onInputKeyDown = () => {
    const { input } = this.props;
    const { value, currentValue } = this.state;
    let formattedValue: LabeledValue[] = [];
    if (value) {
      formattedValue = formattedValue.concat(value)
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

    const {
      // currentValue,
      filteredData
    } = this.state;

    let validateStatus = 'success' as
      | 'success'
      | 'warning'
      | 'error'
      | 'validating';
    if (meta.touched && meta.invalid) validateStatus = 'error';
    if (meta.touched && meta.warning) validateStatus = 'warning';

    const options = filteredData.map(d => <Option key={d.key} value={d.key}>{d.label}</Option>);

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
            mode="multiple"
            labelInValue={true}
            value={this.state.value}
            placeholder={'Search'}
            defaultActiveFirstOption={true}
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
