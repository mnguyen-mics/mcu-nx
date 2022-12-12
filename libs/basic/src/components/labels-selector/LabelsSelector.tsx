import * as React from 'react';
import { Tag, Tooltip, Input, Button, Menu, InputRef } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import McsIcon from '../mcs-icon';
import { Dropdown } from '../popup-container/PopupContainer';
import { Label } from '../../models/labels/labels';
import { AbstractMessages } from '../../utils/IntlHelper';

export interface LabelsSelectorMessages extends AbstractMessages {
  labelNoResults: string;
  labelButton: string;
}
export interface LabelsSelectorProps {
  className?: string;
  labels: Label[];
  selectedLabels: Label[];
  onChange: (a: Label[]) => void;
  buttonMessage?: string;
  messages: LabelsSelectorMessages;
}

interface LabelsSelectorState {
  inputVisible: boolean;
  inputValue: string;
  input?: HTMLInputElement;
}

class LabelsSelector extends React.Component<LabelsSelectorProps, LabelsSelectorState> {
  input: React.RefObject<InputRef>;
  constructor(props: LabelsSelectorProps) {
    super(props);
    this.input = React.createRef();
    this.state = {
      inputVisible: false,
      inputValue: '',
    };
  }

  handleClose = (removedLabel: Label) => {
    const labels = [
      ...this.props.selectedLabels.filter(selectedLabel => selectedLabel.id !== removedLabel.id),
    ];
    this.props.onChange(labels);
  };

  showInput = () => {
    this.setState(
      { inputVisible: true },
      () => this.input && this.input.current && this.input.current.focus(),
    );
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const selectedValue = this.props.labels.find(label => label.name === this.state.inputValue);
    const labels = [...this.props.selectedLabels];
    if (selectedValue) {
      labels.push(selectedValue);
    }
    this.props.onChange(labels);
    this.setState({
      inputValue: '',
      inputVisible: false,
    });
  };

  handleVisibleChange = () => {
    this.setState({ inputValue: '', inputVisible: false });
  };

  render() {
    const { labels, selectedLabels, buttonMessage, messages, className } = this.props;

    const { inputValue, inputVisible } = this.state;

    const onClose = (label: Label) => () => {
      this.handleClose(label);
    };

    const onClick = (a: MenuInfo) => {
      const foundLabel = this.props.labels.find(label => label.id === a.key);
      this.setState(
        {
          inputValue: foundLabel && foundLabel.name ? foundLabel.name : '',
        },
        () => {
          this.handleInputConfirm();
        },
      );
    };

    const results = labels.filter(label => {
      return (
        label.name.includes(this.state.inputValue) &&
        !selectedLabels.find(existingLabel => existingLabel.id === label.id)
      );
    });

    const overlayMenu = () => {
      return (
        <Menu onClick={onClick} className='mcs-labelsSelector_dropdown' style={{}}>
          {results.length ? (
            results.map(label => {
              return <Menu.Item key={label.id}>{label.name}</Menu.Item>;
            })
          ) : (
            <Menu.Item disabled={true}>{messages.labelNoResults}</Menu.Item>
          )}
        </Menu>
      );
    };

    return (
      <div className={`mcs-labelsSelector ${className ? className : ''}`}>
        {selectedLabels.map(label => {
          const isLongTag = label.name.length > 20;
          const labelelem = (
            <Tag
              className='mcs-labelsSelector_tag'
              key={label.id}
              closable={true}
              onClose={onClose(label)}
            >
              {isLongTag ? `${label.name.slice(0, 20)}...` : label.name}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={label.name} key={label.id}>
              {labelelem}
            </Tooltip>
          ) : (
            labelelem
          );
        })}
        {inputVisible && (
          <Dropdown
            overlay={overlayMenu()}
            visible={inputVisible}
            onVisibleChange={this.handleVisibleChange}
            trigger={['click']}
          >
            <Input
              autoFocus={true}
              id='labelInput'
              ref={this.input}
              type='text'
              size='small'
              value={inputValue}
              onChange={this.handleInputChange}
              onPressEnter={this.handleInputConfirm}
              prefix={<McsIcon type='magnifier' />}
            />
          </Dropdown>
        )}
        {!inputVisible && (
          <Button size='small' className='mcs-labelsSelector_button' onClick={this.showInput}>
            <McsIcon type='plus' />
            {buttonMessage || messages.labelButton}
          </Button>
        )}
      </div>
    );
  }
}

export default LabelsSelector;
