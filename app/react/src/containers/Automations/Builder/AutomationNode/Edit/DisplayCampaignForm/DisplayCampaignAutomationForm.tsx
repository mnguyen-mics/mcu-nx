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
import { FORM_ID, DisplayCampaignAutomationFormData } from '../domain';
import { ScenarioNodeShape } from '../../../../../../models/automations/automations';
import GeneralInformationFormSection from './GeneralInformationFormSection';
import {
  InventoryCatalogFieldArray,
  AdFieldArray,
  BidOptimizerFieldArray,
} from '../../../../../Campaigns/Display/Edit/AdGroup/AdGroupForm';
import messages from '../../../../../Campaigns/Display/Edit/messages';
import DeviceFormSection from '../../../../../Campaigns/Display/Edit/AdGroup/sections/DeviceFormSection';
import { InventoryCatalogFormSection } from '../../../../../Campaigns/Display/Edit/AdGroup/sections/InventoryCatalog';
import AdFormSection from '../../../../../Campaigns/Display/Edit/AdGroup/sections/AdFormSection';
import { BidOptimizerFormSection } from '../../../../../Campaigns/Display/Edit/AdGroup/sections';
import { GoalFieldArray } from '../../../../../Campaigns/Display/Edit/DisplayCampaignForm';
import { GoalFormSection } from '../../../../../Campaigns/Display/Edit/Sections/Programmatic';
import { MicsReduxState } from '../../../../../../utils/ReduxHelper';

const { Content } = Layout;

const localMessages = defineMessages({
  save: {
    id: 'automation.builder.node.displayCampaignForm.save.button',
    defaultMessage: 'Update',
  },
  sectionGeneralTitle: {
    id: 'automation.builder.node.displayCampaignForm.general.title',
    defaultMessage: 'General Informations',
  },
  sectionDisplayCampaignTitle: {
    id: 'automation.builder.node.displayCampaignForm.display.title',
    defaultMessage: 'Modify the parameters of the display campaign',
  },
});

export interface DisplayCampaignAutomationFormProps
  extends Omit<ConfigProps<DisplayCampaignAutomationFormData>, 'form'> {
  close: () => void;
  breadCrumbPaths: Path[];
  node: ScenarioNodeShape;
  disabled?: boolean;
}

interface MapStateToProps {
  formValues: DisplayCampaignAutomationFormData;
}

type Props = InjectedFormProps<
DisplayCampaignAutomationFormData,
  DisplayCampaignAutomationFormProps
> &
  DisplayCampaignAutomationFormProps &
  InjectedIntlProps &
  RouteComponentProps<{ organisationId: string }> &
  MapStateToProps;

class DisplayCampaignAutomationForm extends React.Component<Props> {
  buildFormSections = () => {
    const { change, disabled } = this.props;

    const genericFieldArrayProps = {
      formChange: change,
      rerenderOnEveryChange: true,
      disabled: disabled
    };

    const sections: McsFormSection[] = [];

    const displayCampaignSection = {
      id: 'displayCampaign',
      title: localMessages.sectionGeneralTitle,
      component: (
        <GeneralInformationFormSection
          initialValues={this.props.initialValues}
          disabled={disabled}
        />
      ),
    };

    const goalSection = {
      id: 'goals',
      title: messages.sectionTitle2,
      component: (
        <GoalFieldArray
          name="goalFields"
          component={GoalFormSection}
          small={true}
          {...genericFieldArrayProps}
        />
      ),
    };


    const device = {
      id: 'device',
      title: messages.sectionTitleDevice,
      component: (
        <DeviceFormSection
          name="adGroupFields[0].model.adGroup"
          formChange={this.props.change}
          small={true}
          disabled={!!disabled}
          initialValues={this.props.initialValues.adGroupFields && this.props.initialValues.adGroupFields[0].model.adGroup}
        />
      ),
    };

    const placementList = {
      id: 'placementList',
      title: messages.sectionTitlePlacement,
      component: (
        <InventoryCatalogFieldArray
          name="adGroupFields[0].model.inventoryCatalFields"
          component={InventoryCatalogFormSection}
          small={true}
          isScenario={true}
          {...genericFieldArrayProps}
        />
      ),
    };

    const displayAd = {
      id: 'display',
      title: messages.sectionTitleAds,
      component: (
        <AdFieldArray
          name="adGroupFields[0].model.adFields"
          component={AdFormSection}
          small={true}
          {...genericFieldArrayProps}
        />
      ),
    };

    const bidOptimizer = {
      id: 'bidOptimizer',
      title: messages.sectionTitleOptimizer,
      component: (
        <BidOptimizerFieldArray
          name="adGroupFields[0].model.bidOptimizerFields"
          component={BidOptimizerFormSection}
          small={true}
          {...genericFieldArrayProps}
        />
      ),
    };

    sections.push(displayCampaignSection);
    sections.push(goalSection);
    sections.push(device);
    sections.push(placementList);
    sections.push(displayAd);
    sections.push(bidOptimizer);

    return sections;
  };

  render() {
    const { breadCrumbPaths, handleSubmit, close, disabled } = this.props;
    const actionBarProps: FormLayoutActionbarProps = {
      formId: FORM_ID,
      paths: breadCrumbPaths,
      message: localMessages.save,
      onClose: close,
      disabled: disabled
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

const mapStateToProps = (state: MicsReduxState) => ({
  formValues: getFormValues(FORM_ID)(state),
});

export default compose<Props, DisplayCampaignAutomationFormProps>(
  injectIntl,
  withRouter,
  connect(mapStateToProps),
  reduxForm({
    form: FORM_ID,
    enableReinitialize: true,
  }),
)(DisplayCampaignAutomationForm);
