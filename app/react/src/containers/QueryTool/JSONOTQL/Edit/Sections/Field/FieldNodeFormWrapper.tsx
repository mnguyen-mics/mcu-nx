import * as React from 'react';
// import FieldNodeForm from './FieldNodeForm';
import { ObjectLikeTypeInfoResource } from '../../../../../../models/datamart/graphdb/RuntimeSchema';
import { Path } from '../../../../../../components/ActionBar';
import { Button, Form } from 'antd';
import {
  ConfigProps,
  reduxForm,
  InjectedFormProps,
  getFormValues,
} from 'redux-form';
import { FieldNodeFormDataValues, FORM_ID } from '../../domain';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { withRouter, RouteComponentProps } from 'react-router';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import FieldNodeForm from './FieldNodeForm';
import { Omit } from '../../../../../../utils/Types';

export interface FieldNodeFormWrapperProps
  extends Omit<ConfigProps<FieldNodeFormDataValues>, 'form'> {
  breadCrumbPaths: Path[];
  objectType: ObjectLikeTypeInfoResource;
  objectTypes: ObjectLikeTypeInfoResource[];
  idToAttachDropDowns?: string;
}

interface MapStateToProps {
  formValues: FieldNodeFormDataValues;
}

type Props = InjectedFormProps<
  FieldNodeFormDataValues,
  FieldNodeFormWrapperProps
> &
  FieldNodeFormWrapperProps &
  InjectedIntlProps &
  RouteComponentProps<{ organisationId: string }> &
  MapStateToProps;


class FieldNodeFormWrapper extends React.Component<Props, any> {
  // /**
  //  * Same a getQueryableObjectTypes but for scalar types
  //  */
  getQueryableFields = () => {
    const { objectTypes, objectType } = this.props;

    return objectType.fields.filter(
      f =>
        !objectTypes.find(ot => {
          const match = f.field_type.match(/\w+/);
          return !!(match && match[0] === ot.name);
        }) && f.directives.find(dir => dir.name === 'TreeIndex'),
    );
  };

  render() {
    const { handleSubmit, change, objectType, idToAttachDropDowns } = this.props;
    return (
      <Form
        className="edit-layout ant-layout"
        onSubmit={handleSubmit as any}
        layout="vertical"
      >
        <FieldNodeForm
          availableFields={this.getQueryableFields()}
          formChange={change}
          objectType={objectType}
          name={'fieldNodeForm'}
          idToAttachDropDowns={idToAttachDropDowns}
        />
        <Button type="primary" className="mcs-primary" htmlType="submit">Submit</Button>
      </Form>
    );
  }
}

const mapStateToProps = (state: any) => ({
  formValues: getFormValues(FORM_ID)(state),
});

export default compose<Props, FieldNodeFormWrapperProps>(
  injectIntl,
  withRouter,
  connect(mapStateToProps),
  reduxForm({
    form: FORM_ID,
    enableReinitialize: true,
  }),
)(FieldNodeFormWrapper);
