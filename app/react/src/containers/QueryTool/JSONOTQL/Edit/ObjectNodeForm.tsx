import * as React from 'react';
import { Omit, connect } from 'react-redux';
import {
  reduxForm,
  InjectedFormProps,
  ConfigProps,
  FieldArray,
  GenericFieldArray,
  Field,
  getFormValues,
} from 'redux-form';
import { ObjectNodeFormData, FORM_ID, FrequencyFormData } from './domain';
import { Path } from '../../../../components/ActionBar';
import { Layout, Form } from 'antd';
import FormLayoutActionbar, {
  FormLayoutActionbarProps,
} from '../../../../components/Layout/FormLayoutActionbar';
import { compose } from 'recompose';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { withRouter, RouteComponentProps } from 'react-router';
import { McsFormSection } from '../../../../utils/FormHelper';
import messages from './messages';
import ObjectNodeSection from './Sections/ObjectNodeSection';
import { QueryBooleanOperator } from '../../../../models/datamart/graphdb/QueryDocument';
import { ObjectLikeTypeInfoResource } from '../../../../models/datamart/graphdb/RuntimeSchema';
import FieldNodeSection, {
  FieldNodeSectionProps,
} from './Sections/FieldNodeSection';

const { Content } = Layout;

export interface ObjectNodeFormProps
  extends Omit<ConfigProps<ObjectNodeFormData>, 'form'> {
  close: () => void;
  breadCrumbPaths: Path[];
  objectType: ObjectLikeTypeInfoResource;
  objectTypes: ObjectLikeTypeInfoResource[];
}

interface MapStateToProps {
  formValues: ObjectNodeFormData;
}

const FieldNodeListFieldArray = FieldArray as new () => GenericFieldArray<
  Field,
  FieldNodeSectionProps
>;

type Props = InjectedFormProps<ObjectNodeFormData, ObjectNodeFormProps> &
  ObjectNodeFormProps &
  InjectedIntlProps &
  RouteComponentProps<{ organisationId: string }> &
  MapStateToProps;

class ObjectNodeForm extends React.Component<Props> {
  /**
   * Filter fields by field_type that represent
   * an object type (ie not scalar ie [UserEvent!]!)
   * We use a regexp to extract the type
   * A TreeIndex directive means it is queryable (ie indexed)
   */
  getQueryableObjectTypes = () => {
    const { objectType, objectTypes } = this.props;
    return objectType.fields.filter(field => {
      const found = objectTypes.find(ot => {
        const match = field.field_type.match(/\w+/);
        return !!(match && match[0] === ot.name);
      });
      const hasIndexedField =
        !!found &&
        !!found.fields.find(
          f => !!f.directives.find(dir => dir.name === 'TreeIndex'),
        );
      return !!found && hasIndexedField;
    });
  };

  /**
   * Same a getQueryableObjectTypes but for scalar types
   */
  getQueryableFields = () => {
    const { objectType, objectTypes, formValues } = this.props;

    const selectedFieldType = objectType.fields.find(
      f => f.name === formValues.objectNodeForm.field,
    )!.field_type;

    return objectTypes
      .find(ot => {
        const match = selectedFieldType.match(/\w+/);
        return !!(match && match[0] === ot.name);
      })!
      .fields.filter(
        f =>
          !objectTypes.find(ot => {
            const match = f.field_type.match(/\w+/);
            return !!(match && match[0] === ot.name);
          }) && f.directives.find(dir => dir.name === 'TreeIndex'),
      );
  };

  render() {
    const {
      handleSubmit,
      breadCrumbPaths,
      close,
      change,
      formValues,
    } = this.props;

    const genericFieldArrayProps = {
      formChange: change,
      rerenderOnEveryChange: true,
    };

    const actionBarProps: FormLayoutActionbarProps = {
      formId: FORM_ID,
      paths: breadCrumbPaths,
      message: messages.save,
      onClose: close,
    };

    const resetFieldNodeForm = () => {
      const resetFrequency: FrequencyFormData = {
        enabled: false,
        mode: 'AT_LEAST',
      };
      change('frequency', resetFrequency);
      change('fieldNodeForm', []);
    };

    const sections: McsFormSection[] = [];
    sections.push({
      id: 'objectNode',
      title: messages.objectNodeTitle,
      component: (
        <ObjectNodeSection
          objectTypeFields={this.getQueryableObjectTypes()}
          onSelect={resetFieldNodeForm}
        />
      ),
    });

    const onBooleanOperatorChange = (value: QueryBooleanOperator) =>
      change('objectNodeForm.boolean_operator', value);

    const hasField = formValues && formValues.objectNodeForm.field;
    const showFieldNodeForm = hasField;

    if (showFieldNodeForm) {
      sections.push({
        id: 'fieldConditions',
        title: messages.objectNodeTitle,
        component: (
          <FieldNodeListFieldArray
            name="fieldNodeForm"
            component={FieldNodeSection}
            availableFields={this.getQueryableFields()}
            formChange={change}
            booleanOperator={formValues.objectNodeForm.boolean_operator}
            onBooleanOperatorChange={onBooleanOperatorChange}
            {...genericFieldArrayProps}
          />
        ),
      });
    }

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
            onSubmit={handleSubmit as any}
            layout="vertical"
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

const mapStateToProps = (state: any) => ({
  formValues: getFormValues(FORM_ID)(state),
});

export default compose<Props, ObjectNodeFormProps>(
  injectIntl,
  withRouter,
  connect(mapStateToProps),
  reduxForm({
    form: FORM_ID,
    enableReinitialize: true,
  }),
)(ObjectNodeForm);
