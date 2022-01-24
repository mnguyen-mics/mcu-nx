import * as React from 'react';
import _ from 'lodash';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';
import { DashboardContentSchema } from '../../models/customDashboards/customDashboards';
import { StandardSegmentBuilderQueryDocument } from '../../models/standardSegmentBuilder/StandardSegmentBuilderResource';
import { AudienceSegmentShape } from '../../models/audienceSegment/AudienceSegmentResource';
import cuid from 'cuid';
import { injectDrawer } from '../drawer';
import DashboardLayout from '.';
import { InjectedDrawerProps } from '../..';

interface EditableDashboardLayoutProps {
  datamart_id: string;
  organisationId: string;
  updateSchema: (d: DashboardContentSchema) => void;
  schema: DashboardContentSchema;
  source?: AudienceSegmentShape | StandardSegmentBuilderQueryDocument;
}

type Props = EditableDashboardLayoutProps & InjectedIntlProps & InjectedDrawerProps;

class EditableDashboardLayout extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  private labelInitialSchemaWithIds(initialSchema: DashboardContentSchema) {
    const schemaCopy: DashboardContentSchema = JSON.parse(JSON.stringify(initialSchema));
    schemaCopy.sections.forEach(section => {
      section.cards.forEach(card => {
        card.charts.forEach(chart => {
          chart.id = cuid();
        });
      });
    });
    return schemaCopy;
  }

  render() {
    const { datamart_id, organisationId, openNextDrawer, closeNextDrawer, updateSchema, schema } =
      this.props;
    const identifiedSchema = this.labelInitialSchemaWithIds(schema);
    return (
      <DashboardLayout
        openNextDrawer={openNextDrawer}
        closeNextDrawer={closeNextDrawer}
        datamart_id={datamart_id}
        schema={identifiedSchema}
        editable={true}
        updateState={updateSchema}
        organisationId={organisationId}
      />
    );
  }
}

export default compose<Props, EditableDashboardLayoutProps>(
  injectIntl,
  injectDrawer,
)(EditableDashboardLayout);
