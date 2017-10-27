import * as React from 'react';
import { compose } from 'recompose';
import { FieldArray, Field, GenericFieldArray, InjectedFormProps } from 'redux-form';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import CatalogService, {
  AudienceSegmentServiceItemPublicResource,
  ServiceCategoryTree,
} from '../../../../../../../services/CatalogService';
import AudienceSegmentService from '../../../../../../../services/AudienceSegmentService';
import * as SessionSelectors from '../../../../../../../state/Session/selectors';
import AudienceCatalog, { AudienceCatalogProps } from './AudienceCatalog';

const AudienceCatatogFieldArray = FieldArray as new() => GenericFieldArray<Field, AudienceCatalogProps>;

interface RouterMatchParams {
  organisationId: string;
  campaignId: string;
  adGroupId?: string;
}

interface AudienceCatalogContainerProps {
  getDefaultDatamart: (organisationId: string) => { id: string };
  RxF: InjectedFormProps;
}

interface AudienceCatalogContainerState {
  audienceCategoryTree: ServiceCategoryTree[];
  genderServiceItems: AudienceSegmentServiceItemPublicResource[];
  ageServiceItems: AudienceSegmentServiceItemPublicResource[];
  // TODO use an interface
  audienceSegments: AudienceSegmentResource[];
}

export interface AudienceSegmentResource {
  id: string;
  name: string;
}

export interface AudienceSegmentSelectionResource {
  id?: string;
  audienceSegmentId: string;
  exclude: boolean;
}

export interface AudienceSegmentFieldModel {
  id: string;
  resource: AudienceSegmentSelectionResource;
  deleted?: boolean;
}

type JoinedProps = AudienceCatalogContainerProps &
  RouteComponentProps<RouterMatchParams>;

const FORM_FIELD_ARRAY_NAME = 'audienceSegmentTable';

class AudienceCatalogContainer extends React.Component<JoinedProps, AudienceCatalogContainerState> {

  constructor(props: JoinedProps) {
    super(props);
    this.state = {
      audienceCategoryTree: [],
      genderServiceItems: [],
      ageServiceItems: [],
      audienceSegments: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchDetailedTargetingData = (): Promise<ServiceCategoryTree[]> => {
    const {
      match: {
        params: { organisationId },
      },
    } = this.props;

    return CatalogService.getCategoryTree(
      organisationId,
      { serviceFamily: ['AUDIENCE_DATA.AUDIENCE_SEGMENT'] },
    ).then(categoryTree => {

      function fetchServices(category: ServiceCategoryTree): Promise<ServiceCategoryTree> {

        const servicesP = CatalogService.getServices(organisationId, { parentCategoryId: category.node.id });
        const childrenCategoryP = Promise.all(category.children.map(fetchServices));

        return Promise.all([servicesP, childrenCategoryP])
          .then(([ services, childrenCategory ]) => {
            return {
              node: category.node,
              children: childrenCategory,
              services,
            };
          });
      }

      return Promise.all(categoryTree.map(category => {
        return fetchServices(category);
      }));
    });
  }

  fetchData = () => {
    const {
      match: {
        params: { organisationId },
      },
      getDefaultDatamart,
    } = this.props;

    const datamartId = getDefaultDatamart(organisationId).id;

    Promise.all([
      this.fetchDetailedTargetingData(),
      CatalogService.getServices(organisationId, { categorySubtype: ['AUDIENCE.GENDER'] }),
      CatalogService.getServices(organisationId, { categorySubtype: ['AUDIENCE.AGE'] }),
      AudienceSegmentService.getSegments(organisationId, datamartId, { maxResults: 500 })
        .then(res => res.data.filter((s: any) => s.id !== '4196')),
    ]).then(([audienceCategoryTree, genderServiceItems, ageServiceItems, audienceSegments]) => {

      this.setState(prevState => ({
        audienceCategoryTree,
        genderServiceItems,
        ageServiceItems,
        audienceSegments,
      }));
    });
  }

  render() {

    const {
      audienceCategoryTree,
      genderServiceItems,
      ageServiceItems,
      audienceSegments,
     } = this.state;

    const RxF = this.props.RxF;

    return (
      <AudienceCatatogFieldArray
        name={FORM_FIELD_ARRAY_NAME}
        component={AudienceCatalog}
        audienceCategoryTree={audienceCategoryTree}
        genderServiceItems={genderServiceItems}
        ageServiceItems={ageServiceItems}
        audienceSegments={audienceSegments}
        RxF={RxF}
      />
    );
  }

}

export default compose(
  withRouter,
  connect(
    state => ({
      getDefaultDatamart: SessionSelectors.getDefaultDatamart(state),
    }),
  ),
)(AudienceCatalogContainer);
