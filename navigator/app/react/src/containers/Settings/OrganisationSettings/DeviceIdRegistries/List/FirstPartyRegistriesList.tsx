import * as React from 'react';
import messages from '../messages';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { Drawer, Modal } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { IDeviceIdRegistryService } from '../../../../../services/DeviceIdRegistryService';
import { lazyInject } from '../../../../../config/inversify.config';
import { TYPES } from '../../../../../constants/types';
import { getPaginatedApiParam } from '../../../../../utils/ApiHelper';
import { DataListResponse } from '@mediarithmics-private/advanced-components/lib/services/ApiService';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../../../Notifications/injectNotifications';
import {
  DeviceIdRegistryResource,
  DeviceIdRegistryType,
} from '../../../../../models/deviceIdRegistry/DeviceIdRegistryResource';
import { injectWorkspace, InjectedWorkspaceProps } from '../../../../Datamart';
import DeviceIdRegistriesEditForm from '../Edit/DeviceIdRegistriesEditForm';
import DeviceIdRegistryDatamartSelectionsEditForm from '../Edit/DeviceIdRegistryDatamartSelectionsEditForm';
import { ExclamationCircleOutlined } from '@ant-design/icons/lib/icons';
import { DeviceIdRegistryWithDatamartSelectionsResource } from './domain';
import FirstPartyRegistriesTable from './FirstPartyRegistriesTable';
import RegistriesHelperService from './RegistriesHelperService';

interface RouterProps {
  organisationId: string;
}

type Props = RouteComponentProps<RouterProps> &
  InjectedNotificationProps &
  WrappedComponentProps &
  InjectedWorkspaceProps;

interface FirstPartyRegistriesListState {
  isLoadingFirstPartyRegistries: boolean;
  firstPartyRegistries: DeviceIdRegistryWithDatamartSelectionsResource[];
  firstPartyRegistriesTotal: number;
  isNewRegistryDrawerVisible: boolean;
  isEditRegistryDrawerVisible: boolean;
  isDatamartSelectionsDrawerVisible: boolean;
  currentRegistry?: DeviceIdRegistryWithDatamartSelectionsResource;
}

class FirstPartyRegistriesList extends React.Component<Props, FirstPartyRegistriesListState> {
  @lazyInject(TYPES.IDeviceIdRegistryService)
  private _deviceIdRegistryService: IDeviceIdRegistryService;

  private _registriesHelperService: RegistriesHelperService = new RegistriesHelperService();

  constructor(props: Props) {
    super(props);

    this.state = {
      isLoadingFirstPartyRegistries: false,
      firstPartyRegistries: [],
      firstPartyRegistriesTotal: 0,
      isNewRegistryDrawerVisible: false,
      isEditRegistryDrawerVisible: false,
      isDatamartSelectionsDrawerVisible: false,
      currentRegistry: undefined,
    };
  }

  fetchFirstPartyRegistries = (organisationId: string) => {
    const { notifyError } = this.props;

    this.setState({
      isLoadingFirstPartyRegistries: true,
    });

    return Promise.all([
      this._deviceIdRegistryService.getDeviceIdRegistries(organisationId, {
        type: DeviceIdRegistryType.CUSTOM_DEVICE_ID,
        ...getPaginatedApiParam(1, 500),
      }),
      this._deviceIdRegistryService.getDeviceIdRegistries(organisationId, {
        type: DeviceIdRegistryType.MOBILE_VENDOR_ID,
        ...getPaginatedApiParam(1, 500),
      }),
      this._deviceIdRegistryService.getDeviceIdRegistries(organisationId, {
        type: DeviceIdRegistryType.INSTALLATION_ID,
        ...getPaginatedApiParam(1, 500),
      }),
    ])
      .then((results: DataListResponse<DeviceIdRegistryResource>[]) => {
        return results.reduce((acc: DeviceIdRegistryResource[], val) => {
          return acc.concat(val.data);
        }, []);
      })
      .then(registries => {
        return Promise.all(
          registries.map(registry =>
            this._deviceIdRegistryService
              .getDeviceIdRegistryDatamartSelections(organisationId, registry.id)
              .then(selections => {
                return {
                  datamart_selections: selections.data,
                  ...registry,
                } as DeviceIdRegistryWithDatamartSelectionsResource;
              }),
          ),
        );
      })
      .then(registries => {
        this.setState({
          isLoadingFirstPartyRegistries: false,
          firstPartyRegistries: registries,
          firstPartyRegistriesTotal: registries.length,
        });
      })
      .catch(err => {
        this.setState({
          isLoadingFirstPartyRegistries: false,
          firstPartyRegistries: [],
          firstPartyRegistriesTotal: 0,
        });
        notifyError(err);
      });
  };

  makeEmptyState = () => {
    this.setState({
      isLoadingFirstPartyRegistries: false,
      firstPartyRegistries: [],
      firstPartyRegistriesTotal: 0,
      isNewRegistryDrawerVisible: false,
      isEditRegistryDrawerVisible: false,
      isDatamartSelectionsDrawerVisible: false,
      currentRegistry: undefined,
    });
  };

  componentDidMount() {
    const {
      workspace: { organisation_id },
    } = this.props;

    this.fetchFirstPartyRegistries(organisation_id);
  }

  componentDidUpdate(previousProps: Props) {
    const {
      match: {
        params: { organisationId: previousOrganisationId },
      },
    } = previousProps;

    const {
      match: {
        params: { organisationId },
      },
      workspace: { organisation_id },
    } = this.props;

    if (previousOrganisationId !== organisationId) {
      this.fetchFirstPartyRegistries(organisation_id);
    }
  }

  newRegistryOnClick = () => {
    this.setState({
      isNewRegistryDrawerVisible: true,
    });
  };

  newRegistryDrawerOnClose = () => {
    this.setState({
      isNewRegistryDrawerVisible: false,
    });
  };

  createRegistry = (registry: Partial<DeviceIdRegistryResource>) => {
    const {
      notifyError,
      notifySuccess,
      intl: { formatMessage },
      workspace: { organisation_id },
    } = this.props;

    return this._deviceIdRegistryService
      .createDeviceIdRegistry(registry)
      .then(res => {
        this.setState({
          isNewRegistryDrawerVisible: false,
        });
        return res.data;
      })
      .then(createdRegistry => {
        return this._registriesHelperService.selectAllDatamarts(
          organisation_id,
          createdRegistry.id,
          notifyError,
        );
      })
      .then(() => {
        return this.refreshFirstPartyRegistries();
      })
      .then(() => {
        notifySuccess({
          message: formatMessage(messages.newRegistryCreationSuccess),
          description: '',
        });
      })
      .catch(err => {
        notifyError(err);
        this.setState({
          currentRegistry: undefined,
        });
      });
  };

  editRegistryAction = (registry: DeviceIdRegistryWithDatamartSelectionsResource): void => {
    this.setState({
      currentRegistry: registry,
      isEditRegistryDrawerVisible: true,
    });
  };

  editRegistryDrawerOnClose = (isVisible: boolean) => () => {
    this.setState({
      isEditRegistryDrawerVisible: isVisible,
    });
  };

  updateRegistry = (id: string) => {
    const {
      workspace: { organisation_id },
    } = this.props;

    return (updatedData: Partial<DeviceIdRegistryResource>) => {
      const {
        notifyError,
        notifySuccess,
        intl: { formatMessage },
      } = this.props;

      return this._deviceIdRegistryService
        .updateDeviceIdRegistry(id, organisation_id, updatedData)
        .then(() => {
          this.setState(
            {
              isEditRegistryDrawerVisible: false,
              currentRegistry: undefined,
            },
            () => {
              this.refreshFirstPartyRegistries();
              notifySuccess({
                message: formatMessage(messages.registryEditionSuccess),
                description: '',
              });
            },
          );
        })
        .catch(err => {
          this.setState({
            currentRegistry: undefined,
          });
          notifyError(err);
        });
    };
  };

  deleteRegistryOnOk = (registry: DeviceIdRegistryWithDatamartSelectionsResource) => {
    const {
      workspace: { organisation_id },
      notifyError,
      notifySuccess,
      intl: { formatMessage },
    } = this.props;

    return this._deviceIdRegistryService
      .deleteDeviceIdRegistry(registry.id, organisation_id)
      .then(() => {
        this.refreshFirstPartyRegistries();
        notifySuccess({
          message: formatMessage(messages.registryDeletionSuccess),
          description: '',
        });
      })
      .catch(err => {
        notifyError(err);
      });
  };

  deleteRegistryAction = (registry: DeviceIdRegistryWithDatamartSelectionsResource) => {
    const {
      intl: { formatMessage },
    } = this.props;

    if (registry.datamart_selections.length !== 0) {
      return Modal.error({
        className: 'mcs-modal--errorDialog',
        icon: <ExclamationCircleOutlined />,
        title: formatMessage(messages.datamartSelectionsExistTitle),
        content: formatMessage(messages.datamartSelectionsExistMessage),
        okText: 'OK',
        onOk() {
          // closing modal
        },
      });
    } else {
      return Modal.confirm({
        title: formatMessage(messages.registryDeletionConfirmationTitle),
        content: (
          <FormattedMessage
            id={messages.registryDeletionConfirmationMessage.id}
            defaultMessage={messages.registryDeletionConfirmationMessage.defaultMessage}
            values={{
              registryName: <b>{`${registry.name}`}</b>,
            }}
          />
        ),
        icon: <ExclamationCircleOutlined />,
        okText: 'Yes',
        cancelText: formatMessage(messages.modalCancel),
        onOk: () => {
          this.deleteRegistryOnOk(registry);
        },
      });
    }
  };

  editDatamartsSelectionAction = (registry: DeviceIdRegistryWithDatamartSelectionsResource) => {
    this.setState({
      currentRegistry: registry,
      isDatamartSelectionsDrawerVisible: true,
    });
  };

  datamartsSelectionDrawerOnClose = () => {
    this.setState({
      currentRegistry: undefined,
      isDatamartSelectionsDrawerVisible: false,
    });
  };

  handleDatamartSelectionsSave = (deviceIdRegistryId: string, selectedDatamartIds: string[]) => {
    const {
      notifyError,
      notifySuccess,
      intl: { formatMessage },
      workspace: { organisation_id },
    } = this.props;

    const previousSelections = this.state.currentRegistry!.datamart_selections;

    this._registriesHelperService
      .updateDatamartSelections(
        organisation_id,
        deviceIdRegistryId,
        selectedDatamartIds,
        previousSelections,
        notifyError,
      )
      .then(() => {
        this.setState(
          {
            currentRegistry: undefined,
            isDatamartSelectionsDrawerVisible: false,
          },
          () => {
            this.refreshFirstPartyRegistries();
            notifySuccess({
              message: formatMessage(messages.datamartSelectionsEditionSuccess),
              description: '',
            });
          },
        );
      });
  };

  refreshFirstPartyRegistries = () => {
    const {
      workspace: { organisation_id },
    } = this.props;

    this.fetchFirstPartyRegistries(organisation_id);
  };

  hasRightToCreateRegistry = () => {
    const {
      workspace: { role },
    } = this.props;

    return (
      role === 'ORGANISATION_ADMIN' ||
      role === 'COMMUNITY_ADMIN' ||
      role === 'CUSTOMER_ADMIN' ||
      role === 'SUPER_ADMIN'
    );
  };

  render() {
    const {
      intl: { formatMessage },
    } = this.props;

    const {
      isLoadingFirstPartyRegistries,
      firstPartyRegistries,
      isNewRegistryDrawerVisible,
      isEditRegistryDrawerVisible,
      isDatamartSelectionsDrawerVisible,
    } = this.state;

    return (
      <div>
        <FirstPartyRegistriesTable
          isLoadingFirstPartyRegistries={isLoadingFirstPartyRegistries}
          firstPartyRegistries={firstPartyRegistries}
          newRegistryOnClick={this.newRegistryOnClick}
          editRegistryAction={this.editRegistryAction}
          deleteRegistryAction={this.deleteRegistryAction}
          editDatamartsSelectionAction={this.editDatamartsSelectionAction}
          hasRightToCreateRegistry={this.hasRightToCreateRegistry}
        />

        <Drawer
          className='mcs-deviceRegistriesList_drawer'
          width='800'
          bodyStyle={{ padding: '0' }}
          title={formatMessage(messages.newFirstPartyRegistryDrawerTitle)}
          placement={'right'}
          closable={true}
          onClose={this.newRegistryDrawerOnClose}
          visible={isNewRegistryDrawerVisible}
          destroyOnClose={true}
        >
          <DeviceIdRegistriesEditForm save={this.createRegistry} />
        </Drawer>

        <Drawer
          className='mcs-deviceRegistriesList_drawer'
          width='800'
          bodyStyle={{ padding: '0' }}
          title={formatMessage(messages.editFirstPartyRegistryDrawerTitle)}
          placement={'right'}
          closable={true}
          onClose={this.editRegistryDrawerOnClose(false)}
          visible={isEditRegistryDrawerVisible}
          destroyOnClose={true}
        >
          {this.state.currentRegistry && (
            <DeviceIdRegistriesEditForm
              initialValues={this.state.currentRegistry}
              deviceIdRegistry={this.state.currentRegistry!}
              save={this.updateRegistry(this.state.currentRegistry!.id)}
            />
          )}
        </Drawer>

        <Drawer
          className='mcs-deviceRegistriesList_drawer'
          width='800'
          bodyStyle={{ padding: '0' }}
          title={
            this.state.currentRegistry &&
            formatMessage(messages.registryDatamartSelectionsDrawerTitle, {
              registryName: `${this.state.currentRegistry.name}`,
            })
          }
          placement={'right'}
          closable={true}
          onClose={this.datamartsSelectionDrawerOnClose}
          visible={isDatamartSelectionsDrawerVisible}
          destroyOnClose={true}
        >
          {this.state.currentRegistry && (
            <DeviceIdRegistryDatamartSelectionsEditForm
              initialSelections={this.state.currentRegistry!.datamart_selections}
              deviceIdRegistry={this.state.currentRegistry!}
              handleSave={this.handleDatamartSelectionsSave}
            />
          )}
        </Drawer>
      </div>
    );
  }
}

export default compose<Props, {}>(
  withRouter,
  injectNotifications,
  injectIntl,
  injectWorkspace,
)(FirstPartyRegistriesList);
