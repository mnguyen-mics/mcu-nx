import * as React from 'react';
import { compose } from 'recompose';
import { withRouter, RouteComponentProps } from 'react-router';
import { InjectedIntlProps, defineMessages, injectIntl } from 'react-intl';
import { message } from 'antd';
import { INITIAL_IMPORTS_FORM_DATA } from './domain';
import ImportEditForm from './ImportEditForm';
import { injectDrawer } from '../../../../components/Drawer/index';
import { InjectedDrawerProps } from '../../../../components/Drawer/injectDrawer';
import { Loading } from '../../../../components/index';
import { DatamartResource } from '../../../../models/datamart/DatamartResource';
import { EditContentLayout } from '../../../../components/Layout';
import DatamartSelector from '../../../Audience/Common/DatamartSelector';
import { Import } from '../../../../models/imports/imports';
import { lazyInject } from '../../../../config/inversify.config';
import { IImportService } from '../../../../services/ImportService';
import { TYPES } from '../../../../constants/types';

const messages = defineMessages({
  newImports: {
    id: 'form.new.import',
    defaultMessage: 'New Import',
  },
  imports: {
    id: 'edit.imports.title',
    defaultMessage: 'Imports',
  },
  editImports: {
    id: 'edit.imports',
    defaultMessage: 'Edit {name}',
  },
  updateSuccess: {
    id: 'edit.imports.success.message',
    defaultMessage: 'Import successfully saved ',
  },
  updateError: {
    id: 'edit.imports.list.error.message',
    defaultMessage: 'Import update failed ',
  },
  savingInProgress: {
    id: 'form.saving.in.progress',
    defaultMessage: 'Saving in progress',
  },
});

interface ImportEditPageState {
  importData: Partial<Import>;
  loading: boolean;
  selectedDatamart?: DatamartResource;
  shouldDisplayDatamartSelection: boolean;
}

type Props = InjectedDrawerProps &
  RouteComponentProps<{
    organisationId: string;
    datamartId: string;
    importId: string;
  }> &
  InjectedIntlProps;

class ImportEditPage extends React.Component<Props, ImportEditPageState> {
  @lazyInject(TYPES.IImportService)
  private _importService: IImportService;
  constructor(props: Props) {
    super(props);
    this.state = {
      importData: INITIAL_IMPORTS_FORM_DATA,
      loading: true,
      selectedDatamart: undefined,
      shouldDisplayDatamartSelection: true,
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { datamartId, importId },
      },
    } = this.props;

    if (importId) {
      this.loadInitialValues(datamartId, importId);
    }
    this.setState({
      loading: false,
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    const {
      match: {
        params: { datamartId, importId },
      },
    } = this.props;
    const {
      match: {
        params: { importId: nextImportId, datamartId: nextDatamartId },
      },
    } = nextProps;

    if (importId !== nextImportId || datamartId !== nextDatamartId) {
      this.setState({
        loading: true,
      });
      this.loadInitialValues(nextDatamartId, nextImportId);
    }
  }

  loadInitialValues = (datamartId: string, importId: string) => {
    this._importService
      .getImport(datamartId, importId)
      .then(importData => importData.data)
      .then(res => {
        this.setState({
          importData: res,
        });
      });
  };

  close = () => {
    const {
      history,
      match: {
        params: { organisationId },
      },
    } = this.props;

    const url = `/v2/o/${organisationId}/datastudio/imports`;

    return history.push(url);
  };

  save = (formData: Partial<Import>) => {
    const {
      history,
      match: {
        params: { importId, organisationId, datamartId },
      },
      intl,
    } = this.props;

    const { importData, selectedDatamart } = this.state;

    this.setState({
      loading: true,
    });

    const hideSaveInProgress = message.loading(
      intl.formatMessage(messages.savingInProgress),
      0,
    );

    if (importId && importData.datamart_id) {
      this._importService
        .updateImport(importData.datamart_id, importId, formData)
        .then(() => {
          redirectAndNotify(importId);
        })
        .catch(err => {
          redirectAndNotify();
        });
    } else if (selectedDatamart) {
      this._importService
        .createImport(selectedDatamart.id, formData)
        .then(createdImport => {
          redirectAndNotify(createdImport.data.id);
        })
        .catch(err => {
          redirectAndNotify();
        });
    }

    const redirectAndNotify = (id?: string) => {
      if (id) {
        hideSaveInProgress();
        message.success(intl.formatMessage(messages.updateSuccess));
        return history.push(
          `/v2/o/${organisationId}/datastudio/datamart/${datamartId}/imports/${id}`,
        );
      } else {
        hideSaveInProgress();
        this.setState({
          loading: false,
        });
        message.error(intl.formatMessage(messages.updateError));
      }
    };
  };

  onDatamartSelect = (datamart: DatamartResource) => {
    this.setState({
      selectedDatamart: datamart,
      importData: {
        ...this.state.importData,
      },
      shouldDisplayDatamartSelection: false,
    });
  };

  render() {
    const {
      intl: { formatMessage },
      match: {
        params: { organisationId, importId },
      },
    } = this.props;
    const { loading, selectedDatamart } = this.state;

    const importName = importId
      ? formatMessage(messages.editImports, {
          name: this.state.importData.name
            ? this.state.importData.name
            : formatMessage(messages.imports),
        })
      : formatMessage(messages.newImports);
    const breadcrumbPaths = [
      {
        name: formatMessage(messages.imports),
        url: `/v2/o/${organisationId}/datastudio/imports`,
      },
      {
        name: importName,
      },
    ];

    if (loading) {
      return <Loading className="loading-full-screen" />;
    }

    if (importId) {
      return (
        <ImportEditForm
          initialValues={this.state.importData}
          onSave={this.save}
          onClose={this.close}
          breadCrumbPaths={breadcrumbPaths}
        />
      );
    }

    return selectedDatamart ? (
      <ImportEditForm
        initialValues={this.state.importData}
        onSave={this.save}
        onClose={this.close}
        breadCrumbPaths={breadcrumbPaths}
      />
    ) : (
      <EditContentLayout
        paths={breadcrumbPaths}
        formId="EXPORT"
        onClose={this.close}
      >
        <DatamartSelector onSelect={this.onDatamartSelect} />
      </EditContentLayout>
    );
  }
}

export default compose<Props, {}>(
  withRouter,
  injectIntl,
  injectDrawer,
)(ImportEditPage);
