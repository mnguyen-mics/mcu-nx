import * as React from 'react';
import {
  Form,
  reduxForm,
  InjectedFormProps,
  ConfigProps,
  GenericFieldArray,
  Field,
  FieldArray,
} from 'redux-form';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Layout, message } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { BasicProps } from 'antd/lib/layout/layout';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { DrawableContentProps } from '../../../../components/Drawer';
import { Path } from '../../../../components/ActionBar';
import FormLayoutActionbar, {
  FormLayoutActionbarProps,
} from '../../../../components/Layout/FormLayoutActionbar';
import ScrollspySider, {
  SidebarWrapperProps,
} from '../../../../components/Layout/ScrollspySider';
import messages from './messages';
import { DisplayCampaignFormData } from './domain';
import { Omit } from '../../../../utils/Types';
import GeneralFormSection from './Sections/GeneralFormSection';
import { McsFormSection } from '../../../../utils/FormHelper';
import GoalFormSection, {
  GoalFormSectionProps,
} from './Sections/GoalFormSection';
import AdGroupFormSection, {
  AdGroupFormSectionProps,
} from './Sections/AdGroupFormSection';
import * as SessionSelectors from '../../../../state/Session/selectors';

const Content = Layout.Content as React.ComponentClass<
  BasicProps & { id: string }
>;

const GoalFieldArray = FieldArray as new () => GenericFieldArray<
  Field,
  GoalFormSectionProps
>;

const AdGroupFieldArray = FieldArray as new () => GenericFieldArray<
  Field,
  AdGroupFormSectionProps
>;

export interface DisplayCampaignFormProps
  extends DrawableContentProps,
    Omit<ConfigProps<DisplayCampaignFormData>, 'form'> {
  close: () => void;
  breadCrumbPaths: Path[];
}

interface MapStateToProps {
  hasDatamarts: (organisationId: string) => boolean;
}

type Props = InjectedFormProps<
  DisplayCampaignFormData,
  DisplayCampaignFormProps
> &
  DisplayCampaignFormProps &
  MapStateToProps &
  InjectedIntlProps &
  RouteComponentProps<{ organisationId: string }>;

const FORM_ID = 'campaignForm';

class DisplayCampaignForm extends React.Component<Props> {
  componentWillReceiveProps(nextProps: Props) {
    // const { submitFailed } = this.props;
    const { intl: { formatMessage } } = this.props;
    const { submitFailed: nextSubmitFailed } = nextProps;
    if (nextSubmitFailed) {
      message.error(formatMessage(messages.errorFormMessage));
    }
  }

  render() {
    const {
      closeNextDrawer,
      openNextDrawer,
      handleSubmit,
      breadCrumbPaths,
      close,
      change,
      match: { params: { organisationId } },
      hasDatamarts,
    } = this.props;

    const genericFieldArrayProps = {
      formChange: change,
      openNextDrawer,
      closeNextDrawer,
      rerenderOnEveryChange: true,
    };

    const actionBarProps: FormLayoutActionbarProps = {
      formId: FORM_ID,
      paths: breadCrumbPaths,
      message: messages.saveAdGroup,
      onClose: close,
    };

    const sections: McsFormSection[] = [];
    sections.push({
      id: 'general',
      title: messages.sectionTitle1,
      component: <GeneralFormSection />,
    });

    if (hasDatamarts(organisationId)) {
      sections.push({
        id: 'goals',
        title: messages.sectionTitle2,
        component: (
          <GoalFieldArray
            name="goalFields"
            component={GoalFormSection}
            {...genericFieldArrayProps}
          />
        ),
      });
    }

    sections.push({
      id: 'adGroups',
      title: messages.sectionTitle3,
      component: (
        <AdGroupFieldArray
          name="adGroupFields"
          component={AdGroupFormSection}
          {...genericFieldArrayProps}
        />
      ),
    });

    const sideBarProps: SidebarWrapperProps = {
      items: sections.map(s => ({ sectionId: s.id, title: s.title })),
      scrollId: FORM_ID,
    };

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
          <ScrollspySider {...sideBarProps} />
          <Form
            className="edit-layout ant-layout"
            onSubmit={handleSubmit as any}
          >
            <Content
              id={FORM_ID}
              className="mcs-content-container mcs-form-container"
            >
              {renderedSections}
            </Content>
          </Form>
        </Layout>
      </Layout>
    );
  }
}

export default compose<Props, DisplayCampaignFormProps>(
  injectIntl,
  withRouter,
  reduxForm({
    form: FORM_ID,
    enableReinitialize: true,
  }),
  connect(state => ({ hasDatamarts: SessionSelectors.hasDatamarts(state) })),
)(DisplayCampaignForm);
