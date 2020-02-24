import * as React from 'react';
import { Form, reduxForm, InjectedFormProps, ConfigProps } from 'redux-form';
import { compose } from 'recompose';
import { Layout } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { Path } from '../../../../../components/ActionBar';
import FormLayoutActionbar, {
  FormLayoutActionbarProps,
} from '../../../../../components/Layout/FormLayoutActionbar';
import ScrollspySider, {
  SidebarWrapperProps,
} from '../../../../../components/Layout/ScrollspySider';
import messages from '../List/messages';
import {
  DatamartReplicationFormData,
  DatamartReplicationRouteMatchParam,
} from './domain';
import { Omit } from '../../../../../utils/Types';
import GeneralFormSection from './Sections/GeneralFormSection';
import { McsFormSection } from '../../../../../utils/FormHelper';
import CustomFormSection from './Sections/CustomFormSection';
import ActivationFormSection from './Sections/ActivationFormSection';

const Content = Layout.Content;

export interface DatamartReplicationEditFormProps
  extends Omit<ConfigProps<DatamartReplicationFormData>, 'form'> {
  close: () => void;
  breadCrumbPaths: Path[];
  type: string;
}

type Props = InjectedFormProps<
  DatamartReplicationFormData,
  DatamartReplicationEditFormProps
> &
  DatamartReplicationEditFormProps &
  InjectedIntlProps &
  RouteComponentProps<DatamartReplicationRouteMatchParam>;

export const FORM_ID = 'datamartReplicationForm';

class DatamartReplicationEditForm extends React.Component<Props> {
  render() {
    const {
      handleSubmit,
      breadCrumbPaths,
      close,
      type,
      match: {
        params: { datamartReplicationId },
      },
    } = this.props;

    const actionBarProps: FormLayoutActionbarProps = {
      formId: FORM_ID,
      paths: breadCrumbPaths,
      message: messages.saveDatamartReplication,
      onClose: close,
      disabled: !!datamartReplicationId,
    };

    const sections: McsFormSection[] = [];
    sections.push({
      id: 'general',
      title: messages.sectionGeneralTitle,
      component: <GeneralFormSection />,
    });

    if (type === 'GOOGLE_PUBSUB') {
      sections.push({
        id: 'custom',
        title: messages.sectionCustomTitle,
        component: <CustomFormSection />,
      });
    }

    sections.push({
      id: 'activation',
      title: messages.sectionActivationTitle,
      component: <ActivationFormSection formChange={this.props.change} />,
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
            {/* this button enables submit on enter */}
            <button type="submit" style={{ display: 'none' }} />
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

export default compose<Props, DatamartReplicationEditFormProps>(
  injectIntl,
  withRouter,
  reduxForm({
    form: FORM_ID,
    enableReinitialize: true,
  }),
)(DatamartReplicationEditForm);
