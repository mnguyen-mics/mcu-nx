import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, Form, reduxForm } from 'redux-form';
import { compose } from 'recompose';
import { injectIntl, intlShape } from 'react-intl';
import { Layout, Row } from 'antd';

import { ReactRouterPropTypes } from '../../../../validators/proptypes';
import { withMcsRouter } from '../../../Helpers';
import { FormInput, FormSelect, FormSection, withValidators } from '../../../../components/Form';
import { RecordElement, RelatedRecords } from '../../../../components/RelatedRecord';

import { generateFakeId, isFakeId } from '../../../../utils/FakeIdHelper';
import messages from './messages';
import EmailBlastContent from './EmailBlastContent';
import EmailRouterService from '../../../../services/EmailRouterService';

const { Content } = Layout;

class EmailForm extends Component {

  state = {
    routerOptions: [],
    blasts: [],
  }

  componentDidMount() {
    const {
      match: { params: { organisationId } },
    } = this.props;

    EmailRouterService.getRouters(organisationId).then((response) => {
      this.setState({
        routerOptions: response.data,
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { blasts } = this.props;
    const { blasts: nextBlasts } = nextProps;

    if (nextBlasts.length !== blasts.length) {
      this.setState({ blasts: nextBlasts });
    }
  }

  getBlastRecords() {
    const { blasts } = this.state;

    const blastRecords = blasts.filter(blast => !blast.isDeleted).map(blast => {

      return (
        <RecordElement
          key={blast.id}
          recordIconType={'email'}
          title={blast.blast_name}
          actionButtons={[
            { iconType: 'edit', onClick: () => this.handleClickOnEditBlast(blast) },
            { iconType: 'delete', onClick: () => this.handleClickOnRemoveBlast(blast) },
          ]}
        >
          <span>
            {blast.send_date.format('DD/MM/YYYY HH:mm')}
          </span>
        </RecordElement>
      );
    });

    return blastRecords;
  }

  handleAddBlast = (blast) => {
    const { closeNextDrawer } = this.props;

    const addedBlast = {
      ...blast,
      id: generateFakeId(),
    };

    this.setState(prevState => {
      return {
        blasts: [
          ...prevState.blasts,
          addedBlast,
        ],
      };
    });

    closeNextDrawer();
  }

  handleClickOnEditBlast = (blast) => {
    const {
      openNextDrawer,
      closeNextDrawer,
      intl: { formatMessage },
    } = this.props;

    const emailBlastEditorProps = {
      blast,
      breadcrumbPaths: [{
        name: formatMessage(
          messages.emailBlastEditorBreadcrumbTitleEditBlast,
          { blastName: blast.blast_name },
        ),
      }],
      handlers: {
        closeNextDrawer,
        openNextDrawer,
        redirect: closeNextDrawer,
        save: this.handleEditBlast,
      },
    };

    const options = {
      additionalProps: emailBlastEditorProps,
      isModal: true,
    };

    openNextDrawer(EmailBlastContent, options);
  }

  handleCliclOnNewBlast = () => {
    const {
      openNextDrawer,
      closeNextDrawer,
      intl: { formatMessage },
    } = this.props;

    const emailBlastEditorProps = {
      breadcrumbPaths: [{
        name: formatMessage(messages.emailBlastEditorBreadcrumbTitleNewBlast),
      }],
      handlers: {
        closeNextDrawer,
        openNextDrawer,
        redirect: closeNextDrawer,
        save: this.handleAddBlast,
      },
    };

    const options = {
      additionalProps: emailBlastEditorProps,
      isModal: true,
    };

    openNextDrawer(EmailBlastContent, options);
  }

  handleClickOnRemoveBlast = (blast) => {
    this.setState(prevState => {
      if (isFakeId(blast.id)) {
        return {
          blasts: prevState.blasts.filter(b => b.id !== blast.id),
        };
      }
      return {
        blasts: [
          ...prevState.blasts.filter(b => b.id !== blast.id),
          { ...blast, isDeleted: true },
        ],
      };
    });
  }

  handleEditBlast = (blast) => {
    const { closeNextDrawer } = this.props;

    this.setState(prevState => {
      return {
        blasts: [
          ...prevState.blasts.filter(b => b.id !== blast.id),
          { ...blast, isEdited: !isFakeId(blast.id) },
        ],
      };
    });
    closeNextDrawer();
  }

  handleSaveEmailCampaign = (formValues) => {
    const { save } = this.props;
    const { blasts } = this.state;

    const emailEditorData = {
      ...formValues.campaign,
      blasts,
    };

    save(emailEditorData);
  }

  render() {
    const {
      intl: { formatMessage },
      handleSubmit,
      fieldValidators: { isRequired },
      formId: scrollLabelContentId,
    } = this.props;

    const { routerOptions } = this.state;

    const fieldGridConfig = {
      labelCol: { span: 3 },
      wrapperCol: { span: 10, offset: 1 },
    };

    // const hasUnsavedChange = dirty;
    // dirty is for redux-form only
    // TODO handle wider email campaign modification (blasts)

    return (
      <Form
        className="edit-layout ant-layout"
        onSubmit={handleSubmit(this.handleSaveEmailCampaign)}
      >
        <Content
          className="mcs-content-container mcs-form-container"
          id={scrollLabelContentId}
        >
          <div id="general">
            <FormSection
              subtitle={messages.emailEditorGeneralInformationSubTitle}
              title={messages.emailEditorGeneralInformationTitle}
            />

            <Row>
              <Field
                name="campaign.name"
                component={FormInput}
                validate={[isRequired]}
                props={{
                  formItemProps: {
                    label: formatMessage(messages.emailEditorNameInputLabel),
                    required: true,
                    ...fieldGridConfig,
                  },
                  inputProps: {
                    placeholder: formatMessage(messages.emailEditorNameInputPlaceholder),
                  },
                  helpToolTipProps: {
                    title: formatMessage(messages.emailEditorNameInputHelper),
                  },
                }}
              />
              <Field
                name="campaign.technical_name"
                component={FormInput}
                props={{
                  formItemProps: {
                    label: formatMessage(messages.emailEditorTechnicalNameInputLabel),
                    ...fieldGridConfig,
                  },
                  inputProps: {
                    placeholder: formatMessage(messages.emailEditorTechnicalNameInputPlaceholder),
                  },
                  helpToolTipProps: {
                    title: formatMessage(messages.emailEditorTechnicalNameInputHelper),
                  },
                }}
              />
            </Row>
          </div>
          <hr />
          <div id="router">
            <FormSection
              subtitle={messages.emailEditorRouterSubTitle}
              title={messages.emailEditorRouterTitle}
            />

            <Row>
              <Field
                name="campaign.routers[0].email_router_id"
                component={FormSelect}
                validate={[isRequired]}
                props={{
                  formItemProps: {
                    label: formatMessage(messages.emailEditorRouterSelectLabel),
                    required: true,
                    ...fieldGridConfig,
                  },
                  options: routerOptions.map(router => ({
                    key: router.id,
                    value: router.id,
                    text: router.name,
                  })),
                  helpToolTipProps: {
                    title: formatMessage(messages.emailEditorRouterSelectHelper),
                  },
                }}
              />
            </Row>
          </div>
          <hr />
          <div id="blasts">
            <FormSection
              button={{
                message: 'New Blast',
                onClick: this.handleCliclOnNewBlast,
              }}
              subtitle={messages.emailEditorEmailBlastSubTitle}
              title={messages.emailEditorEmailBlastTitle}
            />

            <Row>
              <RelatedRecords
                emptyOption={{
                  message: formatMessage(messages.emailEditorEmailBlastEmpty),
                }}
              >
                {this.getBlastRecords()}
              </RelatedRecords>
            </Row>
          </div>
        </Content>
      </Form>
    );
  }
}

EmailForm.defaultProps = {
  blasts: [],
  campaignName: '',
};


EmailForm.propTypes = {
  blasts: PropTypes.arrayOf(PropTypes.shape()),
  closeNextDrawer: PropTypes.func.isRequired,
  fieldValidators: PropTypes.shape().isRequired,
  formId: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  openNextDrawer: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
};

EmailForm = compose(
  injectIntl,
  withMcsRouter,
  reduxForm({
    form: 'emailForm',
    enableReinitialize: true,
  }),
  withValidators,
)(EmailForm);

export default EmailForm;
