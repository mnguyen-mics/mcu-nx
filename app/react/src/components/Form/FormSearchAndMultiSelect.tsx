import * as React from 'react';
import { Col, Spin } from 'antd';
import { TooltipProps } from 'antd/lib/tooltip';
import { McsIcon } from '../';
import { Button } from '@mediarithmics-private/mcs-components-library';
import SearchAndMultiSelect, { MenuItemProps } from '../SearchAndMultiSelect';
import FormFieldWrapper, { FormFieldWrapperProps } from './FormFieldWrapper';

export interface FormSearchAndMultiSelectProps {
  label: string;
  placeholder?: string;
  datasource: MenuItemProps[];
  tooltipProps: TooltipProps;
  value: string[];
  loading?: boolean;
  handleClickOnRemove: (key: string) => void;
  handleClickOnItem: (key: string) => void;
  small?: boolean;
}

const FormSearchAndMultiSelect: React.SFC<
  FormSearchAndMultiSelectProps & FormFieldWrapperProps
> = props => {
  const {
    label,
    placeholder,
    datasource,
    loading,
    tooltipProps,
    value,
    handleClickOnRemove,
    handleClickOnItem,
    small,
  } = props;

  const selectedItemsView = loading ? (
    <div className="text-center">
      <Spin size="small" />
    </div>
  ) : (
    value.map(key => {
      const foundData = datasource.find(data => data.key === key);
      const handleClick = () => {
        handleClickOnRemove(key);
      };
      return (
        <div key={key} className="audience-service-item">
          {foundData ? foundData.label : ''}
          <Button className="remove-button" onClick={handleClick}>
            <McsIcon type="close" />
          </Button>
        </div>
      );
    })
  );

  const flexAlign = value.length > 0 ? 'top' : 'middle';

  return (
    <FormFieldWrapper
      label={label}
      rowProps={{ align: flexAlign }}
      helpToolTipProps={tooltipProps}
      small={small}
    >
      <Col span={24}>
        <div
          className={
            value.length || loading
              ? 'selected-audience-services-container'
              : ''
          }
        >
          {selectedItemsView}
        </div>
        <SearchAndMultiSelect
          onClick={handleClickOnItem}
          placeholder={placeholder}
          datasource={datasource}
          value={value}
        />
      </Col>
    </FormFieldWrapper>
  );
};

export default FormSearchAndMultiSelect;
