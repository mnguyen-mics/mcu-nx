import 'reflect-metadata';
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import * as React from 'react';
import { RenderOnAuthenticated } from '@mediarithmics-private/advanced-components';
import { compose } from 'recompose';
import { NavigatorRoute } from '../../routes/domain';
import routes from '../../routes/routes';
import { LayoutManager } from '../../components/layoutManager';
import { InjectedIntlProps, injectIntl } from 'react-intl';

type JoinedProps = InjectedIntlProps & RouteComponentProps<{ organisationId: string }>;

const basePath = '/o/:organisationId(\\d+)';
class MainUsingKeycloak extends React.Component<JoinedProps> {
  render() {
    const renderSlashRoute = ({ match }: RouteComponentProps<{ organisationId: string }>) => {
      const redirectToUrl = '/o/1/home';
      return <Redirect to={{ pathname: redirectToUrl, state: this.props.location.state }} />;
    };

    const routeMapping = routes.map((route: NavigatorRoute) => {
      const renderRoute = () => {
        const ElementTag =
          route.layout === 'main'
            ? route.contentComponent
            : route.layout === 'edit'
            ? route.editComponent
            : route.contentComponent;
        return (
          <RenderOnAuthenticated
            requiredFeatures={route.requiredFeature}
            requireDatamart={route.requireDatamart}
          >
            <LayoutManager routeComponent={<ElementTag />} />
          </RenderOnAuthenticated>
        );
      };
      return <Route exact={true} path={`${basePath}${route.path}`} render={renderRoute} key={0} />;
    });

    return (
      <Switch>
        <Route exact={true} path='/' render={renderSlashRoute} />
        {routeMapping}
      </Switch>
    );
  }
}

export default compose<JoinedProps, {}>(injectIntl, withRouter)(MainUsingKeycloak);
