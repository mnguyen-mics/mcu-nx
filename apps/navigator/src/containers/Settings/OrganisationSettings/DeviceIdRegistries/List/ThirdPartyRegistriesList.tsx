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
import injectNotifications, {
  InjectedNotificationProps,
} from '../../../../Notifications/injectNotifications';
import {
  DeviceIdRegistryDatamartSelectionResource,
  DeviceIdRegistryOfferResource,
  DeviceIdRegistryResource,
} from '../../../../../models/deviceIdRegistry/DeviceIdRegistryResource';
import { injectWorkspace, InjectedWorkspaceProps } from '../../../../Datamart';
import DeviceIdRegistryDatamartSelectionsEditForm from '../Edit/DeviceIdRegistryDatamartSelectionsEditForm';
import DeviceIdRegistrySubscriptionsEditForm from '../Edit/DeviceIdRegistrySubscriptionsEditForm';
import { ExclamationCircleOutlined } from '@ant-design/icons/lib/icons';
import { executeTasksInSequence, Task } from '../../../../../utils/PromiseHelper';
import { ICatalogService } from '../../../../../services/CatalogService';
import { AgreementType } from '../../../../../models/servicemanagement/PublicServiceItemResource';
import ThirdPartyRegistriesTable from './ThirdPartyRegistriesTable';
import {
  ThirdPartyDataRow,
  ThirdPartyOfferHeaderRow,
  ThirdPartyRegistryRow,
  thirdPartyRowIsRegistry,
} from './domain';
import RegistriesHelperService from './RegistriesHelperService';

interface RouterProps {
  organisationId: string;
}

type Props = RouteComponentProps<RouterProps> &
  InjectedNotificationProps &
  WrappedComponentProps &
  InjectedWorkspaceProps;

interface DeviceIdRegistryWithDatamartSelectionsResource extends DeviceIdRegistryResource {
  datamart_selections: DeviceIdRegistryDatamartSelectionResource[];
}

interface DeviceIdRegistriesListState {
  isLoadingThirdPartyRegistries: boolean;
  thirdPartyRegistries: ThirdPartyDataRow[];
  subscribedRegistryOffers: DeviceIdRegistryOfferResource[];
  availableRegistryOffers: DeviceIdRegistryOfferResource[];
  thirdPartyRegistriesTotal: number;
  subscribedRegistryOffersTotal: number;
  availableRegistryOffersTotal: number;
  isDatamartSelectionsDrawerVisible: boolean;
  isDatamartsSelectionModalVisible: boolean;
  isSubscriptionsDrawerVisible: boolean;
  currentRegistry?: DeviceIdRegistryWithDatamartSelectionsResource;
}

class DeviceIdRegistriesPage extends React.Component<Props, DeviceIdRegistriesListState> {
  @lazyInject(TYPES.IDeviceIdRegistryService)
  private _deviceIdRegistryService: IDeviceIdRegistryService;

  @lazyInject(TYPES.ICatalogService)
  private _catalogueService: ICatalogService;

  private _registriesHelperService: RegistriesHelperService = new RegistriesHelperService();

  constructor(props: Props) {
    super(props);

    this.state = {
      isLoadingThirdPartyRegistries: false,
      thirdPartyRegistries: [],
      subscribedRegistryOffers: [],
      availableRegistryOffers: [],
      thirdPartyRegistriesTotal: 0,
      subscribedRegistryOffersTotal: 0,
      availableRegistryOffersTotal: 0,
      isDatamartSelectionsDrawerVisible: false,
      isDatamartsSelectionModalVisible: false,
      isSubscriptionsDrawerVisible: false,
      currentRegistry: undefined,
    };
  }

  fetchAvailableRegistryOffers = (organisationId: string) => {
    const { notifyError } = this.props;

    const offersOptions = {
      ...getPaginatedApiParam(1, 500),
    };

    const availableOffers = this._deviceIdRegistryService.getDeviceIdRegistryOffers(offersOptions);

    return availableOffers
      .then(res => {
        this.setState({
          availableRegistryOffers: res.data,
          availableRegistryOffersTotal: res.data.length,
        });
      })
      .catch(err => {
        this.setState({
          availableRegistryOffers: [],
          availableRegistryOffersTotal: 0,
        });
        notifyError(err);
      });
  };

  fetchSubscribedThirdPartyRegistries = (organisationId: string) => {
    const { notifyError } = this.props;

    this.setState({ isLoadingThirdPartyRegistries: true }, () => {
      const offersOptions = {
        subscriber_id: organisationId,
        signed_agreement: true,
        ...getPaginatedApiParam(1, 500),
      };

      const subscribedOffers =
        this._deviceIdRegistryService.getDeviceIdRegistryOffers(offersOptions);

      return subscribedOffers
        .then(res => {
          return Promise.all(
            res.data.map(offer => {
              const agreementOptions = {
                service_offer_id: offer.id,
                ...getPaginatedApiParam(1, 500),
              };
              return this._catalogueService
                .findServiceAgreements(organisationId, agreementOptions)
                .then(res => {
                  const agreement = res.data.at(0); // we should only have one agreement (business assumption)
                  return {
                    agreement_id: agreement ? agreement.id : undefined,
                    ...offer,
                  };
                });
            }),
          );
        })
        .then(offers => {
          const thirdPartyDataRows: ThirdPartyDataRow[] = offers.flatMap(offer => {
            return [
              {
                _row_type: 'OFFER_HEADER',
                id: offer.id,
                name: offer.name,
              } as ThirdPartyOfferHeaderRow,
            ].concat(
              offer.device_id_registries.map(
                registry =>
                  ({
                    _row_type: 'REGISTRY',
                    ...registry,
                  } as ThirdPartyRegistryRow),
              ),
            );
          });
          const nbOfRegistries = offers.reduce(
            (acc: number, offer: DeviceIdRegistryOfferResource) => {
              return acc + offer.device_id_registries.length;
            },
            0,
          );
          this.setState({
            thirdPartyRegistriesTotal: nbOfRegistries,
            subscribedRegistryOffers: offers,
            subscribedRegistryOffersTotal: offers.length,
          });
          return thirdPartyDataRows;
        })
        .then(thirdPartyDataRows => {
          return Promise.all(
            thirdPartyDataRows.map(row => {
              if (thirdPartyRowIsRegistry(row)) {
                return this._deviceIdRegistryService
                  .getDeviceIdRegistryDatamartSelections(
                    organisationId,
                    (row as ThirdPartyRegistryRow).id,
                  )
                  .then(selections => {
                    return {
                      ...row,
                      datamart_selections: selections.data,
                    } as ThirdPartyRegistryRow;
                  });
              } else {
                return row;
              }
            }),
          );
        })
        .then(thirdPartyDataRowsWithSelections => {
          this.setState({
            isLoadingThirdPartyRegistries: false,
            thirdPartyRegistries: thirdPartyDataRowsWithSelections,
          });
        })
        .catch(err => {
          this.setState({
            isLoadingThirdPartyRegistries: false,
            thirdPartyRegistries: [],
            thirdPartyRegistriesTotal: 0,
            subscribedRegistryOffers: [],
            subscribedRegistryOffersTotal: 0,
          });
          notifyError(err);
        });
    });
  };

  makeEmptyState = () => {
    this.setState({
      isLoadingThirdPartyRegistries: false,
      thirdPartyRegistries: [],
      thirdPartyRegistriesTotal: 0,
      isDatamartSelectionsDrawerVisible: false,
      isSubscriptionsDrawerVisible: false,
      currentRegistry: undefined,
    });
  };

  componentDidMount() {
    const {
      workspace: { organisation_id },
    } = this.props;

    this.fetchSubscribedThirdPartyRegistries(organisation_id);
    this.fetchAvailableRegistryOffers(organisation_id);
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
      this.fetchSubscribedThirdPartyRegistries(organisation_id);
      this.fetchAvailableRegistryOffers(organisation_id);
    }
  }

  editDatamartsSelectionAction = (registry: DeviceIdRegistryWithDatamartSelectionsResource) => {
    this.setState({
      currentRegistry: registry,
      isDatamartSelectionsDrawerVisible: true,
    });
  };

  editThirdPartyDatamartsSelectionAction = (registry: ThirdPartyRegistryRow) => {
    this.editDatamartsSelectionAction(registry);
  };

  unsubsribeFromOfferAction = (offer: ThirdPartyOfferHeaderRow) => {
    this.unsubscribeFromOffer(offer.id);
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
            this.refreshThirdPartyRegistries();
            notifySuccess({
              message: formatMessage(messages.datamartSelectionsEditionSuccess),
              description: '',
            });
          },
        );
      });
  };

  manageSubscriptionsOnClick = () => {
    this.setState({
      isSubscriptionsDrawerVisible: true,
    });
  };

  manageSubscriptionsOnClose = (isVisible: boolean) => () => {
    this.setState({
      isSubscriptionsDrawerVisible: isVisible,
    });
  };

  refreshThirdPartyRegistries = () => {
    const {
      workspace: { organisation_id },
    } = this.props;

    this.fetchSubscribedThirdPartyRegistries(organisation_id);
    this.fetchAvailableRegistryOffers(organisation_id);
  };

  hasRightToSubscribeToOffer(): boolean {
    const {
      workspace: { role },
    } = this.props;

    return role === 'CUSTOMER_ADMIN' || role === 'SUPER_ADMIN';
  }

  subscribeToOffer = (id: string) => {
    const {
      workspace: { organisation_id },
      intl: { formatMessage },
      notifySuccess,
      notifyError,
    } = this.props;
    const offer = this.state.availableRegistryOffers.find(offer => offer.id === id)!;

    if (this.hasRightToSubscribeToOffer()) {
      return this._catalogueService
        .createServiceAgreement(organisation_id, AgreementType.REGULAR)
        .then(agreementRes => {
          return this._catalogueService
            .addOfferToAgreement(organisation_id, agreementRes.data.id, id)
            .then(() => agreementRes.data.id);
        })
        .then(agreement_id => {
          return this._catalogueService.updateServiceAgreement(organisation_id, agreement_id, {
            signed: true,
          });
        })
        .then(() => {
          const selectionsTasks: Task[] = [];
          offer.device_id_registries.forEach(registry => {
            selectionsTasks.push(() =>
              this._registriesHelperService.selectAllDatamarts(
                organisation_id,
                registry.id,
                notifyError,
              ),
            );
          });
          return executeTasksInSequence(selectionsTasks);
        })
        .then(() => {
          this.setState(
            {
              isSubscriptionsDrawerVisible: false,
            },
            () => {
              this.refreshThirdPartyRegistries();
              notifySuccess({
                message: formatMessage(messages.offerSubscriptionSuccess),
                description: '',
              });
            },
          );
        })
        .catch(err => {
          notifyError(err);
        });
    } else {
      return Promise.resolve(
        Modal.error({
          className: 'mcs-modal--errorDialog',
          icon: <ExclamationCircleOutlined />,
          title: formatMessage(messages.subscriptionNotAllowedTitle),
          content: formatMessage(messages.subscriptionNotAllowedMessage),
          okText: 'OK',
          onOk() {
            // closing modal
          },
        }),
      ).then(() => {
        return;
      });
    }
  };

  unsubscribeFromOffer = (id: string) => {
    const {
      workspace: { organisation_id },
      intl: { formatMessage },
      notifySuccess,
      notifyError,
    } = this.props;
    const offer = this.state.subscribedRegistryOffers.find(offer => offer.id === id)!;
    const offerSelections = offer.device_id_registries.flatMap(registry => {
      const r = this.state.thirdPartyRegistries.find(
        thirdPartyRow => thirdPartyRowIsRegistry(thirdPartyRow) && thirdPartyRow.id === registry.id,
      )!;
      return (r as ThirdPartyRegistryRow).datamart_selections;
    });

    if (this.hasRightToUnsubscribeFromOffer()) {
      if (offerSelections.length !== 0) {
        return Modal.error({
          className: 'mcs-modal--errorDialog',
          icon: <ExclamationCircleOutlined />,
          title: formatMessage(messages.thirdPartyDatamartSelectionsExistTitle),
          content: formatMessage(messages.thirdPartyDatamartSelectionsExistMessage),
          okText: 'OK',
          onOk() {
            // closing modal
          },
        });
      } else {
        return Modal.confirm({
          title: formatMessage(messages.offerUnsubscriptionConfirmationTitle),
          content: (
            <FormattedMessage
              id={messages.offerUnsubscriptionConfirmationMessage.id}
              defaultMessage={messages.offerUnsubscriptionConfirmationMessage.defaultMessage}
              values={{
                offerName: <b>{`${offer.name}`}</b>,
              }}
            />
          ),
          icon: <ExclamationCircleOutlined />,
          okText: 'Yes',
          cancelText: formatMessage(messages.modalCancel),
          onOk: () => {
            if (!!offer.agreement_id) {
              return this._catalogueService
                .removeOfferFromAgreement(organisation_id, offer.agreement_id!, id)
                .then(() => {
                  return this._catalogueService.deleteServiceAgreement(
                    organisation_id,
                    offer.agreement_id!,
                  );
                })
                .then(() => {
                  this.setState(
                    {
                      isSubscriptionsDrawerVisible: false,
                    },
                    () => {
                      this.refreshThirdPartyRegistries();
                      notifySuccess({
                        message: formatMessage(messages.offerUnsubscriptionSuccess),
                        description: '',
                      });
                    },
                  );
                })
                .catch(err => {
                  notifyError(err);
                });
            } else {
              return Promise.reject(new Error("Can't unsubscribe from offer (missing agreement)"));
            }
          },
        });
      }
    } else {
      return Modal.error({
        className: 'mcs-modal--errorDialog',
        icon: <ExclamationCircleOutlined />,
        title: formatMessage(messages.unsubscriptionNotAllowedTitle),
        content: formatMessage(messages.unsubscriptionNotAllowedMessage),
        okText: 'OK',
        onOk() {
          // closing modal
        },
      });
    }
  };

  hasRightToUnsubscribeFromOffer(): boolean {
    return this.hasRightToSubscribeToOffer();
  }

  render() {
    const {
      intl: { formatMessage },
    } = this.props;

    const {
      isDatamartSelectionsDrawerVisible,
      isSubscriptionsDrawerVisible,
      isLoadingThirdPartyRegistries,
      thirdPartyRegistries,
      subscribedRegistryOffers,
      availableRegistryOffers,
    } = this.state;

    const subscribableRegistryOffers = availableRegistryOffers.filter(
      offer => !subscribedRegistryOffers.find(o => o.id === offer.id),
    );

    return (
      <div>
        <ThirdPartyRegistriesTable
          isLoadingThirdPartyRegistries={isLoadingThirdPartyRegistries}
          thirdPartyRegistries={thirdPartyRegistries}
          subscribedRegistryOffers={subscribableRegistryOffers}
          availableRegistryOffers={availableRegistryOffers}
          manageSubscriptionsOnClick={this.manageSubscriptionsOnClick}
          editThirdPartyDatamartsSelectionAction={this.editThirdPartyDatamartsSelectionAction}
          unsubsribeFromOfferAction={this.unsubsribeFromOfferAction}
        />

        <Drawer
          className='mcs-deviceRegistriesList_drawer'
          width='800'
          bodyStyle={{ padding: '0' }}
          title={formatMessage(messages.thirdPartyRegistrySubscriptionsDrawerTitle)}
          placement={'right'}
          closable={true}
          onClose={this.manageSubscriptionsOnClose(false)}
          visible={isSubscriptionsDrawerVisible}
          destroyOnClose={true}
        >
          <DeviceIdRegistrySubscriptionsEditForm
            subscribedOffers={subscribedRegistryOffers}
            subscribableOffers={subscribableRegistryOffers}
            subscribe={this.subscribeToOffer}
            unsubscribe={this.unsubscribeFromOffer}
          />
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
)(DeviceIdRegistriesPage);
