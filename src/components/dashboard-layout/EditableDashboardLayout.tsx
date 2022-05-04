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
import {
  QueryExecutionSource,
  QueryExecutionSubSource,
} from '../../models/platformMetrics/QueryExecutionSource';

interface EditableDashboardLayoutProps {
  datamart_id: string;
  organisationId: string;
  updateSchema: (d: DashboardContentSchema) => void;
  schema: DashboardContentSchema;
  source?: AudienceSegmentShape | StandardSegmentBuilderQueryDocument;
  queryExecutionSource: QueryExecutionSource;
  queryExecutionSubSource: QueryExecutionSubSource;
}

type Props = EditableDashboardLayoutProps & InjectedIntlProps & InjectedDrawerProps;

class EditableDashboardLayout extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  private labelInitialSchemaWithIds(initialSchema: DashboardContentSchema) {
    const schemaCopy: DashboardContentSchema = JSON.parse(JSON.stringify(initialSchema));
    schemaCopy.sections.forEach(section => {
      if (section.id === undefined) section.id = cuid();
      section.cards.forEach(card => {
        if (card.id === undefined) card.id = cuid();
        card.charts.forEach(chart => {
          if (chart.id === undefined) chart.id = cuid();
        });
      });
    });
    return schemaCopy;
  }

  render() {
    const {
      intl,
      datamart_id,
      organisationId,
      openNextDrawer,
      closeNextDrawer,
      updateSchema,
      schema,
      queryExecutionSource,
      queryExecutionSubSource,
    } = this.props;
    const identifiedSchema = this.labelInitialSchemaWithIds(schema);
    return (
      <DashboardLayout
        intl={intl}
        openNextDrawer={openNextDrawer}
        closeNextDrawer={closeNextDrawer}
        datamart_id={datamart_id}
        schema={identifiedSchema}
        editable={true}
        updateState={updateSchema}
        organisationId={organisationId}
        queryExecutionSource={queryExecutionSource}
        queryExecutionSubSource={queryExecutionSubSource}
      />
    );
  }
}

export default compose<Props, EditableDashboardLayoutProps>(
  injectIntl,
  injectDrawer,
)(EditableDashboardLayout);
