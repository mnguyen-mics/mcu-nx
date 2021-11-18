import * as React from 'react';
import injectNotifications, {
  InjectedNotificationProps,
} from '../../containers/Notifications/injectNotifications';
import { compose } from 'recompose';
import { Spin } from 'antd';
import { lazyInject, TYPES } from '@mediarithmics-private/advanced-components';
import { IOrganisationService } from '@mediarithmics-private/advanced-components/lib/services/OrganisationService';
import { OrganisationResource } from '@mediarithmics-private/advanced-components/lib/models/organisation/organisation';

interface OrganisationNameProps {
  organisationId?: string;
}

interface State {
  organisation?: OrganisationResource;
  isLoading: boolean;
}

type Props = OrganisationNameProps & InjectedNotificationProps;

class OrganisationName extends React.Component<Props, State> {
  @lazyInject(TYPES.IOrganisationService)
  private _organisationService: IOrganisationService;
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }
  componentDidMount() {
    const { organisationId } = this.props;
    if (organisationId)
      this._organisationService
        .getOrganisation(organisationId)
        .then(res => {
          this.setState({
            organisation: res.data,
            isLoading: false,
          });
        })
        .catch(err => {
          this.setState({
            isLoading: false,
          });
        });
  }
  render() {
    const { organisation, isLoading } = this.state;
    return isLoading ? <Spin /> : organisation ? organisation.name : '-';
  }
}

export default compose<Props, OrganisationNameProps>(injectNotifications)(OrganisationName);
