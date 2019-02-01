import React from 'react';
import { Button, message } from 'antd';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import {
  FormattedMessage,
  InjectedIntlProps,
  defineMessages,
  injectIntl,
} from 'react-intl';
import { compose } from 'recompose';

import { withTranslations } from '../../../Helpers';
import Actionbar from '../../../../components/ActionBar';
import McsIcon from '../../../../components/McsIcon';

import ExportService from '../../../../services/ExportService';
import GoalService, { GetGoalsOption } from '../../../../services/GoalService';
import ReportService from '../../../../services/ReportService';

import { normalizeReportView } from '../../../../utils/MetricHelper';
import { normalizeArrayOfObject } from '../../../../utils/Normalizer';

import { GOAL_SEARCH_SETTINGS } from './constants';
import { parseSearch } from '../../../../utils/LocationSearchHelper';
import { Index } from '../../../../utils';
import { TranslationProps } from '../../../Helpers/withTranslations';

const messages = defineMessages({
  exportInProgress: {
    id: 'goals.actionbar.button.export',
    defaultMessage: 'Export in progress',
  },
});

type GoalsActionbarProps = InjectedIntlProps &
  RouteComponentProps<{ organisationId: string }> &
  TranslationProps;

interface State {
  exportIsRunning: boolean;
}

const fetchExportData = (organisationId: string, filter: Index<any>) => {
  const buildOptionsForGetGoals = () => {
    let options: GetGoalsOption = {};
    if (filter.statuses) {
      options = {
        archived: filter.statuses.includes('ARCHIVED'),
        first_result: 0,
        max_results: 2000,
      };
    }

    if (filter.keywords) {
      options.keywords = filter.keywords;
    }

    return options;
  };

  const startDate = filter.from;
  const endDate = filter.to;
  const dimension = ['goal_id'];

  const apiResults = Promise.all([
    GoalService.getGoals(organisationId, buildOptionsForGetGoals()),
    ReportService.getConversionPerformanceReport(
      organisationId,
      startDate,
      endDate,
      dimension,
    ),
  ]);

  return apiResults.then(results => {
    const goals = normalizeArrayOfObject(results[0].data, 'id');
    const performanceReport = normalizeArrayOfObject(
      normalizeReportView(results[1].data.report_view),
      'goal_id',
    );

    const mergedData = Object.keys(goals).map(goalId => {
      return {
        ...goals[goalId],
        ...performanceReport[goalId],
      };
    });

    return mergedData;
  });
};

class GoalsActionbar extends React.Component<GoalsActionbarProps, State> {
  constructor(props: GoalsActionbarProps) {
    super(props);
    this.handleRunExport = this.handleRunExport.bind(this);
    this.state = {
      exportIsRunning: false,
    };
  }

  handleRunExport() {
    const {
      match: {
        params: { organisationId },
      },
      intl,
      translations,
    } = this.props;

    const filter = parseSearch(
      this.props.location.search,
      GOAL_SEARCH_SETTINGS,
    );

    this.setState({ exportIsRunning: true });
    const hideExportLoadingMsg = message.loading(
      intl.formatMessage(messages.exportInProgress),
      0,
    );

    fetchExportData(organisationId, filter)
      .then(data => {
        ExportService.exportGoals(organisationId, data, filter, translations);
        this.setState({
          exportIsRunning: false,
        });
        hideExportLoadingMsg();
      })
      .catch(() => {
        // TODO notify error
        this.setState({
          exportIsRunning: false,
        });
        hideExportLoadingMsg();
      });
  }

  render() {
    const {
      match: {
        params: { organisationId },
      },
      translations,
    } = this.props;

    const exportIsRunning = this.state.exportIsRunning;

    const breadcrumbPaths = [
      {
        name: translations.GOALS,
        url: `/v2/o/${organisationId}/campaigns/goals`,
      },
    ];

    return (
      <Actionbar paths={breadcrumbPaths}>
        <Link to={`/v2/o/${organisationId}/campaigns/goals/create`}>
          <Button className="mcs-primary" type="primary">
            <McsIcon type="plus" />
            <FormattedMessage id="NEW_GOAL" defaultMessage="New Goal" />
          </Button>
        </Link>
        <Button onClick={this.handleRunExport} loading={exportIsRunning}>
          {!exportIsRunning && <McsIcon type="download" />}
          <FormattedMessage id="EXPORT" defaultMessage="Export" />
        </Button>
      </Actionbar>
    );
  }
}

export default compose(
  withRouter,
  withTranslations,
  injectIntl,
)(GoalsActionbar);
