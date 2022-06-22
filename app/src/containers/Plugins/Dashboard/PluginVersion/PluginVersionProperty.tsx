import { Button, Checkbox, Col, Form, Input, Radio, Row, Select, Upload, UploadProps } from 'antd';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import messages from '../../messages';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { PropertyResourceModel } from './PluginVersionForm';
import {
  BooleanPropertyResource,
  DataFilePropertyResource,
  IntPropertyResource,
  PluginPropertyType,
  StringPropertyResource,
  UrlPropertyResource,
} from '@mediarithmics-private/advanced-components/lib/models/plugin';
import { UploadFile } from 'antd/lib/upload/interface';

export interface PluginVersionPropertyProps {
  propertyModel: PropertyResourceModel;
  onDelete: (key: string) => () => void;
  onChange: (key: string, fieldName: string, propertyType: PluginPropertyType) => (e?: any) => void;
}

type Props = PluginVersionPropertyProps & InjectedIntlProps;

interface State {
  propertyType: PluginPropertyType;
}

class PluginVersionProperty extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { propertyModel } = this.props;

    this.state = {
      propertyType: propertyModel.property.property_type,
    };
  }

  onSelectType = (key: string) => (propertyType: PluginPropertyType) => {
    const { onChange } = this.props;
    this.setState(
      {
        propertyType: propertyType,
      },
      () => {
        onChange(key, 'property_type', propertyType)();
      },
    );
  };

  renderTypeInput = () => {
    const { propertyType } = this.state;
    const {
      intl: { formatMessage },
      onChange,
      propertyModel,
    } = this.props;
    let input: React.ReactNode;
    let val;
    const label = !!propertyModel.property.writable
      ? formatMessage(messages.defaultValue)
      : formatMessage(messages.value);
    switch (propertyType) {
      case 'STRING':
        val = (propertyModel.property as StringPropertyResource).value.value;
        input = (
          <Form.Item
            label={<div className='mcs-pluginEdit-drawer-form-label'>{label}</div>}
            className='mcs-pluginEdit-drawer-form-item'
          >
            <Input
              className='mcs-pluginEdit-drawer-form-input mcs-pluginEdit-drawer-form-input-value'
              placeholder='value'
              onChange={onChange(propertyModel.key, 'value', propertyType)}
              value={val}
            />
          </Form.Item>
        );
        break;
      case 'URL':
        val = (propertyModel.property as UrlPropertyResource).value.url;
        input = (
          <Form.Item
            label={<div className='mcs-pluginEdit-drawer-form-label'>{label}</div>}
            className='mcs-pluginEdit-drawer-form-item'
          >
            <Input
              type='url'
              className='mcs-pluginEdit-drawer-form-input mcs-pluginEdit-drawer-form-input-value'
              placeholder='value'
              onChange={onChange(propertyModel.key, 'value', propertyType)}
              value={val}
            />
          </Form.Item>
        );
        break;
      case 'DOUBLE':
      case 'INT':
        val = (propertyModel.property as IntPropertyResource).value.value;
        input = (
          <Form.Item
            label={<div className='mcs-pluginEdit-drawer-form-label'>{label}</div>}
            className='mcs-pluginEdit-drawer-form-item'
          >
            <Input
              type='number'
              className='mcs-pluginEdit-drawer-form-input mcs-pluginEdit-drawer-form-input-value'
              placeholder='value'
              onChange={onChange(propertyModel.key, 'value', propertyType)}
              value={val}
            />
          </Form.Item>
        );
        break;
      case 'BOOLEAN':
        val = !!(propertyModel.property as BooleanPropertyResource).value.value;
        input = (
          <Form.Item
            label={<div className='mcs-pluginEdit-drawer-form-label'>{label}</div>}
            className='mcs-pluginEdit-drawer-form-item'
          >
            <Radio.Group onChange={onChange(propertyModel.key, 'value', propertyType)} value={val}>
              <Radio value={true}>True</Radio>
              <Radio value={false}>False</Radio>
            </Radio.Group>
          </Form.Item>
        );
        break;
      case 'DATA_FILE':
        val = (propertyModel.property as DataFilePropertyResource).value.value;
        const props: UploadProps = {
          onChange: info => {
            onChange(propertyModel.key, 'value', propertyType)(info);
          },
          action: '/',
          headers: {
            authorization: 'authorization-text',
          },
        };
        let file: UploadFile | undefined;
        const fileValue = propertyModel.property.value as any;
        const assetId = fileValue?.fileContent?.uid;
        if (fileValue && assetId) {
          file = {
            uid: assetId,
            name: fileValue.fileName,
            size: 0,
            type: '',
          };
        }
        input = (
          <Form.Item
            label={<div className='mcs-pluginEdit-drawer-form-label'>{label}</div>}
            className='mcs-pluginEdit-drawer-form-item'
          >
            <Upload
              className='mcs-pluginEdit-drawer-form-uploadButton'
              fileList={file ? [file] : []}
              {...props}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        );
        break;
      default:
        break;
    }
    return (
      <Col span='6' className='gutter-row'>
        {input}
      </Col>
    );
  };

  render() {
    const {
      intl: { formatMessage },
      propertyModel,
      onDelete,
      onChange,
    } = this.props;

    const { propertyType } = this.state;

    return (
      <Row className='mcs-pluginEdit-drawerForm-property' gutter={16}>
        <Col span='12' className='gutter-row'>
          <Form.Item
            label={
              <div className='mcs-pluginEdit-drawer-form-label'>{formatMessage(messages.name)}</div>
            }
            className='mcs-pluginEdit-drawer-form-item'
          >
            <Input
              className='mcs-pluginEdit-drawer-form-input mcs-pluginEdit-drawer-form-input-name'
              placeholder='Name'
              value={propertyModel.property.technical_name}
              onChange={onChange(propertyModel.key, 'technical_name', propertyType)}
            />
          </Form.Item>
        </Col>

        <Col span='5' className='gutter-row'>
          <Form.Item
            label={
              <div className='mcs-pluginEdit-drawer-form-label'>{formatMessage(messages.type)}</div>
            }
            className='mcs-pluginEdit-drawer-form-item'
          >
            <Select
              className='mcs-pluginEdit-drawer-form-input mcs-pluginEdit-drawer-form-input-type'
              placeholder='Type'
              dropdownClassName='mcs-pluginEdit-drawer-form-input-type_dropdown'
              options={[
                {
                  key: 'DOUBLE',
                  value: 'DOUBLE',
                  className: 'mcs-pluginEdit-drawer-form-input-type_double',
                },
                {
                  key: 'INT',
                  value: 'INT',
                  className: 'mcs-pluginEdit-drawer-form-input-type_int',
                },
                {
                  key: 'URL',
                  value: 'URL',
                  className: 'mcs-pluginEdit-drawer-form-input-type_url',
                },
                {
                  key: 'STRING',
                  value: 'STRING',
                  className: 'mcs-pluginEdit-drawer-form-input-type_string',
                },
                {
                  key: 'DATA_FILE',
                  value: 'DATA_FILE',
                  className: 'mcs-pluginEdit-drawer-form-input-type_dataFile',
                },
                {
                  key: 'BOOLEAN',
                  value: 'BOOLEAN',
                  className: 'mcs-pluginEdit-drawer-form-input-type_boolean',
                },
              ]}
              defaultValue={propertyType}
              onChange={this.onSelectType(propertyModel.key)}
            />
          </Form.Item>
        </Col>
        {this.renderTypeInput()}
        <Col span='1' className='gutter-row mcs-pluginEdit-drawer-delete'>
          <DeleteOutlined onClick={onDelete(propertyModel.key)} />
        </Col>
        <Row>
          <Checkbox
            onChange={onChange(propertyModel.key, 'writable', propertyType)}
            defaultChecked={!!propertyModel.property.writable}
          >
            {formatMessage(messages.overrideCheckboxText)}
          </Checkbox>
        </Row>
      </Row>
    );
  }
}

export default compose<Props, PluginVersionPropertyProps>(injectIntl)(PluginVersionProperty);
