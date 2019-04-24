import * as React from 'react';
import { Omit, connect } from 'react-redux';
import {
  reduxForm,
  InjectedFormProps,
  ConfigProps,
  getFormValues,
} from 'redux-form';
import { Path } from '../../../../../../components/ActionBar';
import { Layout, Form } from 'antd';
import FormLayoutActionbar, {
  FormLayoutActionbarProps,
} from '../../../../../../components/Layout/FormLayoutActionbar';
import { compose } from 'recompose';
import { injectIntl, InjectedIntlProps, defineMessages } from 'react-intl';
import { withRouter, RouteComponentProps } from 'react-router';
import { McsFormSection } from '../../../../../../utils/FormHelper';
import { FORM_ID, EmailCampaignAutomationFormData } from '../domain';
import { ScenarioNodeShape } from '../../../../../../models/automations/automations';
import {
  BlastFormSection,
  TemplateFormSection,
} from '../../../../../Campaigns/Email/Edit/Blast/Sections';
import { BlastTemplateSectionFieldArray } from '../../../../../Campaigns/Email/Edit/Blast/EmailBlastForm';
import GeneralInformationFormSection from './GeneralInformationSectionForm';

const { Content } = Layout;

const localMessages = defineMessages({
  save: {
    id: 'automation.builder.node.form.save.button',
    defaultMessage: 'Update',
  },
  sectionGeneralTitle: {
    id: 'automation.builder.node.edition.form.general.title',
    defaultMessage: 'General Informations',
  },
  sectionDisplayCampaignTitle: {
    id: 'automation.builder.node.edition.form.display.title',
    defaultMessage: 'Modify the parameters of the display campaign',
  },
  sectionSenderInformationTitle: {
    id: 'automation.builder.node.edition.form.campaign.sender.information',
    defaultMessage: 'Sender information',
  },
});

export interface EmailCampaignAutomationFormProps
  extends Omit<ConfigProps<EmailCampaignAutomationFormData>, 'form'> {
  close: () => void;
  breadCrumbPaths: Path[];
  node: ScenarioNodeShape;
}

interface MapStateToProps {
  formValues: EmailCampaignAutomationFormData;
}

type Props = InjectedFormProps<
  EmailCampaignAutomationFormData,
  EmailCampaignAutomationFormProps
> &
  EmailCampaignAutomationFormProps &
  InjectedIntlProps &
  RouteComponentProps<{ organisationId: string }> &
  MapStateToProps;

class EmailCampaignAutomationForm extends React.Component<Props> {
  buildFormSections = () => {
    const { change } = this.props;

    const sections: McsFormSection[] = [];

    const displayCampaignSection = {
      id: 'displayCampaign',
      title: localMessages.sectionGeneralTitle,
      component: (
        <GeneralInformationFormSection
          initialValues={this.props.initialValues}
          organisationId={this.props.match.params.organisationId}
        />
      ),
    };

    const senderInformation = {
      id: 'senderInformation',
      title: localMessages.sectionSenderInformationTitle,
      component: <BlastFormSection small={true} />,
    };

    const emailTemplate = {
      id: 'emailTemplate',
      title: localMessages.sectionSenderInformationTitle,
      component: (
        <BlastTemplateSectionFieldArray
          name="templateFields"
          component={TemplateFormSection}
          formChange={change}
          rerenderOnEveryChange={true}
        />
      ),
    };

    sections.push(displayCampaignSection);
    sections.push(senderInformation);
    sections.push(emailTemplate);

    return sections;
  };

  render() {
    const { breadCrumbPaths, handleSubmit, close } = this.props;
    const actionBarProps: FormLayoutActionbarProps = {
      formId: FORM_ID,
      paths: breadCrumbPaths,
      message: localMessages.save,
      onClose: close,
    };

    const sections = this.buildFormSections();

    const renderedSections = sections.map((section, index) => {
      return (
        <div key={section.id}>
          <div key={section.id} id={section.id}>
            {section.component}
          </div>
          {index !== sections.length - 1 && <hr />}
        </div>
      );
    });

    return (
      <Layout className="edit-layout">
        <FormLayoutActionbar {...actionBarProps} />
        <Layout className={'ant-layout-has-sider'}>
          <Form
            className="edit-layout ant-layout"
            onSubmit={handleSubmit}
            layout="vertical"
          >
            <Content
              id={FORM_ID}
              className="mcs-content-container mcs-form-container automation-form"
            >
              {renderedSections}
            </Content>
          </Form>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (state: any) => ({
  formValues: getFormValues(FORM_ID)(state),
});

export default compose<Props, EmailCampaignAutomationFormProps>(
  injectIntl,
  withRouter,
  connect(mapStateToProps),
  reduxForm({
    form: FORM_ID,
    enableReinitialize: true,
  }),
)(EmailCampaignAutomationForm);
