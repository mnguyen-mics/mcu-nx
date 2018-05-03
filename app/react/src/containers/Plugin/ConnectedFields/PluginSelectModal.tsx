import * as React from 'react';
import { Modal, Button, Select } from 'antd';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import messages from '../messages';
import { OptionProps } from 'antd/lib/select';
import PluginService from '../../../services/PluginService';
import { ButtonStyleless, McsIcon } from '../../../components';

const Option = Select.Option;

interface PluginSelectModalProps {
  input: any /*InputProps*/;
  type: string;
  options: {
    organisationId: string;
    pluginVersionId: string;
    disabled: boolean;
  };
}

interface State {
  open: boolean;
  id: string;
  selectedVersion: string;
  // displayValues: {
  //   elementName: string;
  //   versionName: string;
  // };
  elements: OptionProps[];
  pluginVersions: OptionProps[];
  loading: boolean;
}

type Props = PluginSelectModalProps & InjectedIntlProps;

class PluginSelectModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
      loading: false,
      id:
        props.input && props.input.value && props.input.value.id
          ? props.input.value.id
          : '',
      selectedVersion:
        props.input && props.input.value && props.input.value.version
          ? props.input.value.version
          : '',
      pluginVersions: [],
      elements: [],
    };
  }

  componentDidMount() {
    const {
      options: { pluginVersionId, organisationId },
      type,
    } = this.props;
    if (type === 'formAdLayout') {
      this.getAdLayouts(organisationId, pluginVersionId);
    } else if (type === 'stylesheet') {
      this.getStylesheets(organisationId);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const {
      options: { pluginVersionId, organisationId },
      type,
    } = this.props;

    const {
      options: {
        pluginVersionId: nextPluginVersionId,
        organisationId: nextOrganisationId,
      },
    } = nextProps;

    if (
      pluginVersionId !== nextPluginVersionId ||
      organisationId !== nextOrganisationId
    ) {
      if (type === 'formAdLayout') {
        this.getAdLayouts(nextOrganisationId, nextPluginVersionId);
      } else if (type === 'stylesheet') {
        this.getStylesheets(organisationId);
      }
    }
  }

  onIdChange = (value: string) => {
    const { type } = this.props;
    this.setState({
      id: value,
    });
    if (type === 'formAdLayout') {
      this.getNewAdlayoutVersion(value);
    } else if (type === 'stylesheet') {
      this.getNewStyleSheetsVersion(value);
    }
  };

  onVersionChange = (value: string) => {
    this.setState({
      selectedVersion: value,
    });
  };

  delete = () => {
    const { input } = this.props;
    this.setState({
      open: false,
      id: '',
      selectedVersion: '',
    });
    input.onChange({});
  };

  onConfirm = () => {
    const { input } = this.props;
    const { id, selectedVersion } = this.state;

    const value = {
      id: id,
      version: selectedVersion,
    };
    input.onChange(value);
    this.setState({
      open: false,
    });
  };

  showModal = () => {
    this.setState({
      open: true,
      id: '',
      selectedVersion: '',
    });
  };

  closeModal = () => {
    this.setState({
      open: false,
    });
  };

  getAdLayouts = (organisationId: string, rendererVersion: string) => {
    const {
      options: { disabled },
    } = this.props;

    PluginService.getAdLayouts(organisationId, rendererVersion)
      .then(resp => resp.data)
      .then(adLayouts => {
        this.setState({
          elements: adLayouts
            ? adLayouts.map(item => {
                return {
                  key: item.id,
                  disabled: disabled,
                  value: item.id,
                  name: item.name,
                  title: `${item.name} (${item.id})`,
                  text: `${item.name} (${item.id})`,
                };
              })
            : [],
        });
      });
  };

  getStylesheets = (organisationId: string) => {
    const {
      options: { disabled },
    } = this.props;

    PluginService.getStyleSheets(organisationId)
      .then(resp => resp.data)
      .then(styleSheets => {
        this.setState({
          elements: styleSheets
            ? styleSheets.map(item => {
                return {
                  key: item.id,
                  disabled: disabled,
                  value: item.id,
                  name: item.name,
                  title: `${item.name} (${item.id})`,
                  text: `${item.name} (${item.id})`,
                };
              })
            : [],
        });
      });
  };

  getNewAdlayoutVersion = (adLayoutId: string) => {
    const {
      options: { disabled, organisationId },
    } = this.props;

    this.setState({ loading: true });
    PluginService.getAdLayoutVersion(organisationId, adLayoutId)
      .then(resp => resp.data)
      .then(versions => {
        this.setState({
          pluginVersions: versions.map(item => {
            const title = `${item.filename} ${item.filename ? '-' : ''} ${
              item.status
            } (${item.id})`;
            return {
              key: item.id,
              disabled: disabled,
              value: item.id,
              title: title,
              text: title,
            };
          }),
        });
      })
      .then(() => {
        this.setState({
          loading: false,
        });
      });
  };

  getNewStyleSheetsVersion = (styleSheetId: string) => {
    const {
      options: { disabled, organisationId },
    } = this.props;

    this.setState({ loading: true });

    PluginService.getStyleSheetsVersion(organisationId, styleSheetId)
      .then(resp => resp.data)
      .then(versions => {
        this.setState({
          pluginVersions: versions.map(item => {
            const title = `${item.description} ${item.description ? '-' : ''} ${
              item.status
            } (${item.id})`;
            return {
              key: item.id,
              disabled: disabled,
              value: item.id,
              title: title,
              text: title,
            };
          }),
        });
      })
      .then(() => {
        this.setState({
          loading: false,
        });
      });
  };

  render() {
    const {
      input,
      options: { disabled: disabledElement },
      type,
    } = this.props;

    const { open, loading, elements, pluginVersions } = this.state;

    let selectedItem;

    if (input && input.value) {
      selectedItem = (
        elements.find(item => {
          return item.value === input.value.id;
        }) || {}
      ).title;
    }

    let changeButtonText;
    let chooseButtonText;
    let modalTitle;
    let firstSelectLabel;
    let secondSelectLabel;
    let noItemSelected;
    if (type === 'formAdLayout') {
      changeButtonText = (
        <FormattedMessage {...messages.adLayoutButtonChange} />
      );
      chooseButtonText = (
        <FormattedMessage {...messages.adLayoutButtonChoose} />
      );
      modalTitle = <FormattedMessage {...messages.adLayoutModalTitle} />;
      firstSelectLabel = (
        <FormattedMessage {...messages.adLayoutModalElement} />
      );
      secondSelectLabel = <FormattedMessage {...messages.adLayoutModalLabel} />;
      noItemSelected = <FormattedMessage {...messages.noAdLayoutSelected} />;
    } else {
      changeButtonText = (
        <FormattedMessage {...messages.styleSheetButtonChange} />
      );
      chooseButtonText = (
        <FormattedMessage {...messages.styleSheetButtonChoose} />
      );
      modalTitle = <FormattedMessage {...messages.styleSheetModalTitle} />;
      firstSelectLabel = (
        <FormattedMessage {...messages.styleSheetModalElement} />
      );
      secondSelectLabel = (
        <FormattedMessage {...messages.styleSheetModalVersions} />
      );
      noItemSelected = <FormattedMessage {...messages.noStyleSheetSelected} />;
    }

    return (
      <div>
        <Button onClick={this.showModal} disabled={disabledElement}>
          {input.value && input.value.id ? changeButtonText : chooseButtonText}
        </Button>
        <Modal
          title={modalTitle}
          visible={open}
          onOk={this.onConfirm}
          onCancel={this.closeModal}
          confirmLoading={loading}
          maskClosable={false}
        >
          {elements && elements.length ? (
            <div>
              {firstSelectLabel}
              <Select
                style={{ width: '100%' }}
                onChange={this.onIdChange}
                onSelect={this.onIdChange}
                value={this.state.id}
              >
                {elements.map(({ disabled, value, title }) => (
                  <Option {...{ disabled, value, title }} key={value}>
                    {title}
                  </Option>
                ))}
              </Select>
            </div>
          ) : null}
          <br />
          {pluginVersions && pluginVersions.length && !loading ? (
            <div>
              {secondSelectLabel}
              <Select
                style={{ width: '100%' }}
                onChange={this.onVersionChange}
                value={this.state.selectedVersion}
              >
                {pluginVersions.map(({ disabled, value, title }) => (
                  <Option {...{ disabled, value, title }} key={value}>
                    {title}
                  </Option>
                ))}
              </Select>
            </div>
          ) : null}
        </Modal>
        <span style={{ marginLeft: '20px' }}>
          {selectedItem ? (
            <span>
              {selectedItem}
              <ButtonStyleless
                onClick={this.delete}
                style={{ verticalAlign: 'bottom', marginLeft: '5px' }}
              >
                <McsIcon type="delete" className="big" />
              </ButtonStyleless>
            </span>
          ) : (
            noItemSelected
          )}
        </span>
      </div>
    );
  }
}

export default injectIntl(PluginSelectModal);
