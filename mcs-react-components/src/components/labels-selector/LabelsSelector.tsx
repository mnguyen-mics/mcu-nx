import * as React from 'react';
import { Tag, Tooltip, Input, Button, Menu } from 'antd';
import { MenuInfo } from '../../../node_modules/rc-menu/lib/interface';
import McsIcon from '../mcs-icon';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Dropdown } from '../popupContainer/PopupContainer';
import { Label } from '../../models/labels/labels';

export interface LabelsSelectorProps {
  labels: Label[];
  selectedLabels: Label[];
  onChange: (a: Label[]) => void;
  buttonMessage?: string;
}

interface LabelsSelectorState {
  inputVisible: boolean;
  inputValue: string;
  input?: HTMLInputElement;
}

const messages = defineMessages({
  labelNoResults: {
    id: 'components.labelsSelector.noResults',
    defaultMessage: 'No Results',
  },
  labelButton: {
    id: 'components.labelsSelector.label.button',
    defaultMessage: 'Label',
  },
});

class LabelsSelector extends React.Component<
  LabelsSelectorProps,
  LabelsSelectorState
> {
  constructor(props: LabelsSelectorProps) {
    super(props);
    this.state = {
      inputVisible: false,
      inputValue: '',
    };
  }

  saveInputRef = (input: any) => this.setState({ input: input });

  handleClose = (removedLabel: Label) => {
    const labels = [
      ...this.props.selectedLabels.filter(
        selectedLabel => selectedLabel.id !== removedLabel.id,
      ),
    ];
    this.props.onChange(labels);
  };

  showInput = () => {
    this.setState(
      { inputVisible: true },
      () => this.state.input && this.state.input.focus(),
    );
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const selectedValue = this.props.labels.find(
      label => label.name === this.state.inputValue,
    );
    const labels = [...this.props.selectedLabels];
    if (selectedValue) {
      labels.push(selectedValue);
    }
    this.props.onChange(labels);
    this.setState({
      inputValue: '',
      inputVisible: true,
    });
  };

  handleVisibleChange = () => {
    this.setState({ inputValue: '', inputVisible: true });
  };

  render() {
    const { labels, selectedLabels, buttonMessage } = this.props;

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
        <Menu onClick={onClick} className="mcs-labelsSelector_dropdown" style={{}}>
          {results.length ? (
            results.map(label => {
              return <Menu.Item key={label.id}>{label.name}</Menu.Item>;
            })
          ) : (
            <Menu.Item disabled={true}>
              <FormattedMessage {...messages.labelNoResults} />
            </Menu.Item>
          )}
        </Menu>
      );
    };

    return (
      <div className="mcs-labelsSelector">
        {selectedLabels.map((label) => {
          const isLongTag = label.name.length > 20;
          const labelelem = (
            <Tag
              className="mcs-labelsSelector_tag"
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
              id="labelInput"
              ref={this.saveInputRef}
              type="text"
              size="small"
              style={{ width: 100 }}
              value={inputValue}
              onChange={this.handleInputChange}
              onPressEnter={this.handleInputConfirm}
              prefix={<McsIcon type="magnifier" />}
            />
          </Dropdown>
        )}
        {!inputVisible && (
          <Button
            size="small"
            className="mcs-labelsSelector_button"
            onClick={this.showInput}
          >
            <McsIcon type="plus" />
              {buttonMessage || messages.labelButton.defaultMessage}
          </Button>
        )}
      </div>
    );
  }
}

export default LabelsSelector;
