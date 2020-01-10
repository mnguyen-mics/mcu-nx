import * as React from 'react';
import { injectIntl, InjectedIntlProps, defineMessages } from 'react-intl';
import { compose } from 'recompose';
import { withRouter, RouteComponentProps } from 'react-router';
import TableSelector, {
  TableSelectorProps,
} from '../../../../components/ElementSelector/TableSelector';
import { SearchFilter } from '../../../../components/ElementSelector';
import { DataColumnDefinition } from '../../../../components/TableView/TableView';
import { StringPropertyResource } from '../../../../models/plugin';
import { getPaginatedApiParam } from '../../../../utils/ApiHelper';
import { VisitAnalyzer } from '../../../../models/Plugins';
import { lazyInject } from '../../../../config/inversify.config';
import { TYPES } from '../../../../constants/types';
import { IVisitAnalyzerService } from '../../../../services/Library/VisitAnalyzerService';

const VisitAnalyzerTableSelector: React.ComponentClass<
  TableSelectorProps<VisitAnalyzer>
> = TableSelector;

const messages = defineMessages({
  visitAnalyzerSelectorTitle: {
    id: 'visit-analyzer-selector-title',
    defaultMessage: 'Add a Visit Analyzer',
  },
  visitAnalyzerSelectorSearchPlaceholder: {
    id: 'visit-analyzer-selector-search-placeholder',
    defaultMessage: 'Search bid optimizers',
  },
  visitAnalyzerSelectorColumnName: {
    id: 'visit-analyzer-selector-column-name',
    defaultMessage: 'Name',
  },
  visitAnalyzerSelectorColumnType: {
    id: 'visit-analyzer-selector-column-type',
    defaultMessage: 'Type',
  },
  visitAnalyzerSelectorColumnProvider: {
    id: 'visit-analyzer-selector-column-provider',
    defaultMessage: 'Provider',
  },
});

export interface VisitAnalyzerSelectorProps {
  selectedVisitAnalyzerIds: string[];
  save: (visitAnalyzers: VisitAnalyzer[]) => void;
  close: () => void;
}

interface State {
  metadataByBidOptmizerId: {
    [id: string]: { type?: string; provider?: string; fetching: boolean };
  };
}

type Props = VisitAnalyzerSelectorProps &
  InjectedIntlProps &
  RouteComponentProps<{ organisationId: string }>;

class VisitAnalyzerSelector extends React.Component<Props, State> {
  @lazyInject(TYPES.IVisitAnalyzerService)
  private _visitAnalyzerService: IVisitAnalyzerService;

  constructor(props: Props) {
    super(props);
    this.state = {
      metadataByBidOptmizerId: {},
    };
  }

  saveVisitAnalyzers = (
    visitAnalyzerIds: string[],
    visitAnalyzers: VisitAnalyzer[],
  ) => {
    this.props.save(visitAnalyzers);
  };

  fetchVisitAnalyzers = (filter: SearchFilter) => {
    const {
      match: {
        params: { organisationId },
      },
    } = this.props;

    const options: any = {
      ...getPaginatedApiParam(filter.currentPage, filter.pageSize),
    };

    if (filter.keywords) {
      options.name = filter.keywords;
    }

    return this._visitAnalyzerService
      .getVisitAnalyzers(organisationId, options)
      .then(res => {
        // fetch properties to update state
        this.setState(() => ({
          metadataByBidOptmizerId: res.data.reduce(
            (acc, value) => ({
              ...acc,
              [value.id]: {
                fetching: true,
              },
            }),
            {},
          ),
        }));
        Promise.all(
          res.data.map(bidOptimzer => {
            return this._visitAnalyzerService
              .getInstanceProperties(bidOptimzer.id)
              .then(propsRes => {
                const nameProp = propsRes.data.find(
                  prop => prop.technical_name === 'name',
                );
                const providerProp = propsRes.data.find(
                  prop => prop.technical_name === 'provider',
                );
                if (nameProp && providerProp) {
                  this.setState(prevState => ({
                    metadataByBidOptmizerId: {
                      ...prevState.metadataByBidOptmizerId,
                      [bidOptimzer.id]: {
                        type: (nameProp as StringPropertyResource).value.value,
                        provider: (providerProp as StringPropertyResource).value
                          .value,
                        fetching: false,
                      },
                    },
                  }));
                }
              });
          }),
        );

        // return original list for TableSelector
        return res;
      });
  };

  render() {
    const {
      selectedVisitAnalyzerIds,
      close,
      intl: { formatMessage },
    } = this.props;
    const { metadataByBidOptmizerId } = this.state;

    const columns: Array<DataColumnDefinition<VisitAnalyzer>> = [
      {
        intlMessage: messages.visitAnalyzerSelectorColumnName,
        key: 'name',
        render: (text, record) => <span>{record.name}</span>,
      },
      {
        intlMessage: messages.visitAnalyzerSelectorColumnType,
        key: 'type',
        render: (text, record) => {
          if (metadataByBidOptmizerId[record.id].fetching)
            return <i className="mcs-table-cell-loading" />;
          return <span>{metadataByBidOptmizerId[record.id].type}</span>;
        },
      },
      {
        intlMessage: messages.visitAnalyzerSelectorColumnProvider,
        key: 'provider',
        render: (text, record) => {
          if (metadataByBidOptmizerId[record.id].fetching)
            return <i className="mcs-table-cell-loading" />;
          return <span>{metadataByBidOptmizerId[record.id].provider}</span>;
        },
      },
    ];

    const fetchVisitAnalyzer = (id: string) =>
      this._visitAnalyzerService.getInstanceById(id);

    return (
      <VisitAnalyzerTableSelector
        actionBarTitle={formatMessage(messages.visitAnalyzerSelectorTitle)}
        displayFiltering={true}
        searchPlaceholder={formatMessage(
          messages.visitAnalyzerSelectorSearchPlaceholder,
        )}
        selectedIds={selectedVisitAnalyzerIds}
        fetchDataList={this.fetchVisitAnalyzers}
        fetchData={fetchVisitAnalyzer}
        singleSelection={true}
        columnsDefinitions={columns}
        save={this.saveVisitAnalyzers}
        close={close}
      />
    );
  }
}

export default compose<Props, VisitAnalyzerSelectorProps>(
  withRouter,
  injectIntl,
)(VisitAnalyzerSelector);
