import * as React from 'react';
import Actionbar from '../../../../components/ActionBar';
import { LayoutablePlugin } from '../../../../models/Plugins';
import { compose } from 'recompose';
import injectThemeColors, {
  InjectedThemeColorsProps,
} from '../../../Helpers/injectThemeColors';
import { McsIcon, ButtonStyleless } from '../../../../components';
import McsTabs from '../../../../components/McsTabs';
import { PluginLayout } from '../../../../models/plugin/PluginLayout';
import { PropertyResourceShape } from '../../../../models/plugin';
import PluginSectionGenerator from '../../PluginSectionGenerator';
import injectNotifications, { InjectedNotificationProps } from '../../../Notifications/injectNotifications';
import { reduxForm, InjectedFormProps } from 'redux-form';
import { Form, Spin, Icon } from 'antd';
import { ValidatorProps } from '../../../../components/Form/withValidators';
import ColoredButton from '../../../../components/ColoredButton';
import { ColorPalletteOption, getColorPalettes, rgbToHex, getPerceivedBrightness } from '../../../../utils/ColorHelpers';
import { generateFakeId } from '../../../../utils/FakeIdHelper';
import assetFileService from '../../../../services/Library/AssetsFilesService';

// const logoUrl = require('../../../../assets/images/appnexuslogo.jpg');
// const logoUrl = require('../../../../assets/images/rubiconlogo.jpg');


const FORM_NAME = 'pluginForm';
const BRIGHTNESS_THRESHOLD = 160;

export interface PluginCardModalContentProps<T> {
  plugin: T;
  onClose: () => void
  organisationId: string;
  save: (pluginValue: any, propertiesValue: PropertyResourceShape[]) => void;
  pluginProperties: PropertyResourceShape[];
  disableFields: boolean;
  pluginLayout?: PluginLayout;
  isLoading: boolean;
  pluginVersionId: string;
  initialValues?: any;
  editionMode: boolean;
}

type Props<T extends LayoutablePlugin> = PluginCardModalContentProps<T> &
  InjectedThemeColorsProps & InjectedNotificationProps & InjectedFormProps &
  ValidatorProps;

interface State {
  backgroundColor: string;
  color: string;
  loading: boolean;
  showConfiguration: boolean;
  imageUrl?: string;
}

class PluginCardModalContent<T extends LayoutablePlugin> extends React.Component<
  Props<T>,
  State
> {

  node?: HTMLDivElement | null;

  constructor(props: Props<T>) {
    super(props);
    this.state = {
      loading: true,
      backgroundColor: '',
      color: '',
      showConfiguration: true
    };
  }

  componentDidMount() {
    const {
      pluginLayout
    } = this.props;

    if (pluginLayout && pluginLayout.metadata && pluginLayout.metadata.small_icon_asset_id) {
      this.getData(pluginLayout.metadata.small_icon_asset_id);
    }

    document.addEventListener('mousedown', this.handleClick, false)
  }


  componentWillReceiveProps(nextProps: Props<T>) {
    const {
      pluginLayout
    } = this.props;

    const {
      pluginLayout: nextPluginLayout
    } = nextProps;

    if (nextPluginLayout && nextPluginLayout.metadata) {
      if (pluginLayout && pluginLayout.metadata.small_icon_asset_id !== nextPluginLayout.metadata.small_icon_asset_id || !pluginLayout && !!nextPluginLayout) {
        this.getData(nextPluginLayout.metadata.small_icon_asset_id);
      }
    }
    
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false)
  }

  handleClick = (e: any) => {
    if (this.node && this.node.contains(e.target)) {
      // click has been triggered from inside the node
      return;
    }
    this.props.onClose();
  }

  getData = (assetId: string) => { this.setState({ loading: true }); this.getImageUrl(assetId).then(result => { if (result) this.getPallette(`${(window as any).MCS_CONSTANTS.ASSETS_URL}${result.path}`)})}

  getImageUrl = (assetId: string) => {
    return assetFileService.getAssetFile(
      assetId
    ).then(result => {this.setState({ imageUrl: result ? result.path : '' }); return result})
  }


  getPallette = (url: string) => {
    const options: ColorPalletteOption = {
      paletteCount: 3,
      paletteType: 'dominant',
    };
    return getColorPalettes(url, options).then((palette: number[][]) => {

      this.setState({
        loading: false,
        backgroundColor: rgbToHex(palette[0]),
        color:
          getPerceivedBrightness(
            palette[0]![0],
            palette[0]![1],
            palette[0]![2],
          ) > BRIGHTNESS_THRESHOLD
            ? 'black'
            : 'white',
      });
      return {}
    })
    .catch((err) => {
      this.props.notifyError(err)
      this.setState({ loading: false })
    });
  };

  generateFormFromPluginLayout = (pluginLayout: PluginLayout) => {
    const {
      organisationId,
      plugin,
      pluginProperties,
      disableFields
    } = this.props;

    return pluginLayout.sections.map((section, index) => {
      const indexCondition = index !== pluginLayout.sections.length - 1;
      const fieldsCondition = section.fields !== null && section.fields.length !== 0;
      const advancedFieldsCondition = section.advanced_fields !== null && section.advanced_fields.length !== 0;
      const hrBooleanCondition = indexCondition && (fieldsCondition || advancedFieldsCondition);
      return (
        <div key={section.title}>
          <PluginSectionGenerator
            pluginLayoutSection={section}
            organisationId={organisationId}
            pluginProperties={pluginProperties}
            disableFields={!!disableFields}
            pluginVersionId={plugin.current_version_id!}
            small={true}
          />
          {hrBooleanCondition ? <hr /> : null}
        </div>
      );
    });

  };

  onSubmit = (formValues: any) => {
    const { editionMode, save } = this.props;
    if (editionMode === false) {
      formValues.id = formValues.id ? formValues.id : generateFakeId();
    }

    const pluginData = {
      ...formValues.plugin,
    };

    const formattedProperties = this.props.pluginProperties
      .filter(item => {
        return item.writable === true;
      })
      .map(item => {
        return {
          ...item,
          value: formValues.properties[item.technical_name]
            ? formValues.properties[item.technical_name].value
            : item.value,
        };
      });
    save(pluginData, formattedProperties);
  }

  renderForm = (pluginLayout: PluginLayout) => {
    const {
      handleSubmit,
    } = this.props;
    return (
      <Form
        className={
          this.state.loading ? 'hide-section' : 'edit-layout mcs-form-container'
        }
        layout='vertical'
        onSubmit={handleSubmit(this.onSubmit)}
      >
        {this.generateFormFromPluginLayout(pluginLayout)}
        <div style={{ height: 110, width: '100%' }} />
        
      </Form>
    )
  }

  public render() {

    const { onClose, handleSubmit, isLoading, pluginLayout } = this.props;
    const { backgroundColor, color, loading } = this.state;

    if (loading || !pluginLayout || isLoading) 
      return  (<div className="plugin-modal-loading"><Spin size="large"  /></div>);

    const items = [
      {
        title: 'Configuration',
        key: 'configuration',
        // display: <div> test beach </div>
        display: <div className="tab">{this.renderForm(pluginLayout!)}</div>
      },
      // {
      //   title: 'Documentation',
      //   key: 'documentation',
      //   display: <div className="tab"><Markdown source={markdown} /><div style={{ height: 50, width: '100%' }} /></div>
      // }
    ]

    const onActiveKeyChange = (activeKey: string) => {
      this.setState({ showConfiguration: activeKey === 'configuration' ? true : false })
    }

    return (
      <div className="plugin-modal" ref={node => this.node = node}>
        <style>
          {`.ant-tabs-ink-bar { background-color: ${backgroundColor}; height: 3px; }`}
        </style>
        <Actionbar
          paths={[
            {
              name: pluginLayout.metadata.display_name
            },
          ]}
          backgroundColor={backgroundColor}
          edition={true}
          inverted={color === 'black' ? true : false}
        >
        <ButtonStyleless
          onClick={onClose}
          style={{ marginRight: 0 }}
        >
          <McsIcon
            type="close"
            className="close-icon"
            style={{ cursor: 'pointer' }}
            
          />
        </ButtonStyleless>
          
        </Actionbar>
        <div
          className="body"
        >
          <div className="header">
            <div className="logo">
            {this.state.imageUrl && (<img src={`${(window as any).MCS_CONSTANTS.ASSETS_URL}${this.state.imageUrl}`} />)}
            </div>
            <div className="meta">
              <div>{pluginLayout.version}</div>
            </div>
            <div className="information">
              <div className="name">{pluginLayout.metadata.display_name}</div>
              <div className="description">{pluginLayout.metadata.description}</div>
            </div>
          </div>
           <div className="tabs">
            <McsTabs items={items} defaultActiveKey={'configuration'} onChange={onActiveKeyChange} />
          </div>
          {this.state.showConfiguration ? <div className="footer">
            <ButtonStyleless className={" m-r-20"} onClick={onClose}>Close</ButtonStyleless>
            <ColoredButton className="mcs-primary" backgroundColor={backgroundColor} color={color} onClick={handleSubmit(this.onSubmit)}> { isLoading ? (<Icon type="loading" />) : null} Save</ColoredButton>
          </div> : null}
        </div>
       
      </div>
    );
  }
}

export default compose<
  Props<LayoutablePlugin>,
  PluginCardModalContentProps<LayoutablePlugin>
>(
  injectThemeColors,
  reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
  }),
  injectNotifications
)(PluginCardModalContent);
