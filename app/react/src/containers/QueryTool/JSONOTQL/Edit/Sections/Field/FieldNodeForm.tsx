import { OptionProps } from 'antd/lib/select';
import * as React from 'react';
import _ from 'lodash';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Field, GenericField, getFormValues } from 'redux-form';
import {
  DefaultSelect,
  FormMultiTagField,
  FormSelectField,
  withNormalizer,
  withValidators,
} from '../../../../../../components/Form';
import FormMultiTag from '../../../../../../components/Form/FormSelect/FormMultiTag';
import FormSearchObject, {
  FormSearchObjectProps,
} from '../../../../../../components/Form/FormSelect/FormSearchObject';
import TagSelect, {
  FormTagSelectProps,
} from '../../../../../../components/Form/FormSelect/TagSelect';
import { NormalizerProps } from '../../../../../../components/Form/withNormalizer';
import { ValidatorProps } from '../../../../../../components/Form/withValidators';
import {
  BooleanComparisonOperator,
  EnumComparisonOperator,
  NumericComparisonOperator,
  QueryFieldComparisonType,
  StringComparisonOperator,
  TimeComparisonOperator,
} from '../../../../../../models/datamart/graphdb/QueryDocument';
import {
  ObjectLikeTypeInfoResource,
  FieldInfoResource,
  FieldDirectiveResource,
  BuitinEnumerationType,
} from '../../../../../../models/datamart/graphdb/RuntimeSchema';
import {
  FORM_ID,
  FieldNodeFormData,
  SUPPORTED_FIELD_TYPES,
} from '../../domain';
import messages from '../../messages';
import FormRelativeAbsoluteDate, {
  FormRelativeAbsoluteDateProps,
} from './Comparison/FormRelativeAbsoluteDate';
import constants, { ComparisonValues, builtinEnumTypeOptions } from './contants';
import { IAudienceSegmentService } from '../../../../../../services/AudienceSegmentService';
import { TYPES } from '../../../../../../constants/types';
import { lazyInject } from '../../../../../../config/inversify.config';
import SegmentNameDisplay from '../../../../../Audience/Common/SegmentNameDisplay';
import ReferenceTableService from '../../../../../../services/ReferenceTableService';
import DatamartService from '../../../../../../services/DatamartService';
import channelService from '../../../../../../services/ChannelService';
import { IComparmentService } from '../../../../../../services/CompartmentService';
import { getCoreReferenceTypeAndModel } from '../../../domain';

export const FormTagSelectField = Field as new () => GenericField<
  FormTagSelectProps
>;
export const FormRelativeAbsoluteDateField = Field as new () => GenericField<
  FormRelativeAbsoluteDateProps
>;
export const FormSearchObjectField = Field as new () => GenericField<
  FormSearchObjectProps
>;

export interface FieldNodeFormProps {
  expressionIndex?: number;
  availableFields: FieldInfoResource[];
  name?: string;
  formChange: (fieldName: string, value: any) => void;
  objectType: ObjectLikeTypeInfoResource;
  idToAttachDropDowns?: string;
  runtimeSchemaId: string;
  datamartId: string;
  formName?: string;
  runFieldProposal?: (treeNodePath: number[]) => Promise<string[]>;
  treeNodePath?: number[];
}

interface FormValues {
  fieldNodeForm: FieldNodeFormData[] | FieldNodeFormData;
}

interface MapStateToProps {
  formValues: FormValues;
}

type Props = FieldNodeFormProps &
  InjectedIntlProps &
  ValidatorProps &
  NormalizerProps &
  MapStateToProps &
  RouteComponentProps<{ organisationId: string }>;

type ConditionsOperators =
  | NumericComparisonOperator
  | BooleanComparisonOperator
  | EnumComparisonOperator
  | QueryFieldComparisonType
  | TimeComparisonOperator
  | StringComparisonOperator;

type FieldComparisonGenerator = ComparisonValues<any> & {
  component: React.ReactNode;
  fetchPredicate?: Promise<{ value: string, name: string, disabled: boolean }>
};

interface State {
}

class FieldNodeForm extends React.Component<Props, State> {
  @lazyInject(TYPES.IAudienceSegmentService)
  private _audienceSegmentService: IAudienceSegmentService;

  @lazyInject(TYPES.ICompartmentService)
  private _compartmentService: IComparmentService;

  private _computedTreeNodePath: number[];

  constructor(props: Props) {
    super(props);
    this.state = {
    }
    if (props.treeNodePath) {
      this._computedTreeNodePath = props.treeNodePath;
    }
  }

  componentDidMount() {
    // if no default value compute it
    const { formValues, expressionIndex, formChange, name, treeNodePath } = this.props;

    if (treeNodePath) {
      this._computedTreeNodePath = treeNodePath;
    }
   
    const field = this.getField(formValues, expressionIndex);
    const directive = field ? this.getFieldDirective(field.field) : undefined;

    if (field && !field.comparison) {
      const fieldName = field ? field.field : undefined;
      const fieldType = this.getSelectedFieldType(fieldName);
      const fieldIndexDataType = this.getSelectedFieldIndexDataType(fieldName);
      formChange(
        name ? `${name}.comparison` : 'comparison',
        this.generateAvailableConditionOptions(fieldType, fieldIndexDataType, directive).defaultValue,
      );
    }
  }

  fetchPredicates = (treeNodePath: number[]) => {
    const { runFieldProposal } = this.props;
    if (!runFieldProposal) {
      return Promise.resolve([])
    }
    
    return runFieldProposal(treeNodePath)
    
  }

  componentWillReceiveProps(nextProps: Props) {
    const { formValues, expressionIndex } = this.props;

    const {
      formValues: nextFormValues,
      expressionIndex: nextExpressionIndex,
      formChange,
      name,
      runFieldProposal,
      treeNodePath,

    } = nextProps;
    const field = this.getField(formValues, expressionIndex);
    const fieldName = field ? field.field : undefined;
    const directive = field ? this.getFieldDirective(field.field) : undefined;


    const nextField = this.getField(nextFormValues, nextExpressionIndex);
    const nextFieldName = nextField ? nextField.field : undefined;

    if (fieldName !== nextFieldName && nextFieldName !== undefined) {
      const fieldType = this.getSelectedFieldType(nextFieldName);
      const fieldIndexDataType = this.getSelectedFieldIndexDataType(fieldName);
      console.log('going there', runFieldProposal, treeNodePath)
      const computedFieldPosition = this.getSelectedIndex(nextFieldName);
      console.log('computedFieldPosition', computedFieldPosition, treeNodePath)
      if (computedFieldPosition && treeNodePath) {
        // const [...tailTreeNodePath, headTreeNodePath] = treeNodePath;
        const duplidatedTreeNodePath = _.map(treeNodePath, _.clone);
        const newTreeNodePath = duplidatedTreeNodePath.splice(-1, 1);
        newTreeNodePath.push(computedFieldPosition);
        console.log('newTreeNodePath', newTreeNodePath)
        this.fetchPredicates(newTreeNodePath)
      }
      
      formChange(
        name ? `${name}.comparison` : 'comparison',
        this.generateAvailableConditionOptions(fieldType, fieldIndexDataType, directive).defaultValue,
      );
    }
  }

  getField = (
    formValues: FormValues,
    index?: number,
  ): FieldNodeFormData | undefined => {
    const { fieldNodeForm } = formValues;

    if (Array.isArray(fieldNodeForm)) {
      if (index !== undefined && fieldNodeForm[index]) {
        return fieldNodeForm[index];
      }
    } else {
      return fieldNodeForm;
    }
    return undefined;
  };

  getAvailableFields = (): OptionProps[] => {
    const { availableFields } = this.props;
    return availableFields
      .filter(field =>
        SUPPORTED_FIELD_TYPES.find(t => field.field_type.indexOf(t) > -1),
      )
      .map(i => ({ value: i.name, title: i.decorator && i.decorator.hidden === false ? i.decorator.label : i.name }));
  };

  getSelectedFieldType = (fieldName: string | undefined) => {
    const { availableFields } = this.props;

    const possibleFieldType = availableFields.find(i => i.name === fieldName);
    if (possibleFieldType) {
      const fieldType = possibleFieldType.field_type;
      const match = fieldType.match(/\w+/);
      return match && match[0];
    }
    return null;
  };

  getSelectedIndex = (fieldName: string | undefined) => {
    const { availableFields } = this.props;

    const possibleFieldIndex = availableFields.findIndex(i => i.name === fieldName);
    if (possibleFieldIndex) {
      return possibleFieldIndex;
    }
    return null;
  }

  getSelectedFieldIndexDataType = (fieldName: string | undefined) => {
    const { availableFields } = this.props;

    const possibleFieldType = availableFields.find(i => i.name === fieldName);
    if (possibleFieldType) {
      const indexDirective  = possibleFieldType.directives.find(d => d.name === 'TreeIndex');
      if (indexDirective) {
        const dataTypeDirArg = indexDirective.arguments.find(arg => arg.name === 'data_type')
        if (dataTypeDirArg) {
          const match = dataTypeDirArg.value.match(/\w+/);
          return match && match[0];
        }
        return null;
      }
      return null;
    }
    return null;
  };

  generateAvailableConditionOptions = (
    fieldType: string | null,
    fieldIndexDataType: string | null,
    directives?: FieldDirectiveResource[],
  ): FieldComparisonGenerator => {
    const { intl } = this.props;

    const shouldRenderDirective = (renderDefault: JSX.Element, fetchPredicates: boolean = false) => {
      if (fetchPredicates) {
        return this.generateReferenceTableComparisonField("COMPUTED")
      }
      if (directives) {
        const modelAndType = getCoreReferenceTypeAndModel(directives);
        if (modelAndType) {
          return this.generateReferenceTableComparisonField(modelAndType.type, modelAndType.modelType);
        }        
      }
      return renderDefault;
    }
    

    switch (fieldType) {
      case 'Timestamp':
        return {
          ...constants.generateTimeComparisonOperator(intl),
          component: shouldRenderDirective(this.generateTimestampComparisonField()),
        };
      case 'Date':
        return {
          ...constants.generateTimeComparisonOperator(intl),
          component: shouldRenderDirective(this.generateTimestampComparisonField()),
        };
      case 'String':
        return {
          ...constants.generateStringComparisonOperator(intl, fieldIndexDataType || undefined),
          component: shouldRenderDirective(this.generateStringComparisonField(), true),
          fetchPredicate: undefined
        };
      case 'Bool':
        return {
          ...constants.generateBooleanComparisonOperator(intl),
          component: shouldRenderDirective(this.generateBooleanComparisonField()),
        };
      case 'Boolean':
        return {
          ...constants.generateBooleanComparisonOperator(intl),
          component: shouldRenderDirective(this.generateBooleanComparisonField()),
        };
      case 'Enum':
        return {
          ...constants.generateEnumComparisonOperator(intl),
          component: shouldRenderDirective(this.generateEnumComparisonField()),
        };
      case 'Number':
        return {
          ...constants.generateNumericComparisonOperator(intl),
          component: shouldRenderDirective(this.generateNumericComparisonField()),
        };
      case 'Float':
        return {
          ...constants.generateNumericComparisonOperator(intl),
          component: shouldRenderDirective(this.generateNumericComparisonField()),
        };
      case 'Int':
        return {
          ...constants.generateNumericComparisonOperator(intl),
          component: shouldRenderDirective(this.generateNumericComparisonField()),
        };
      case 'Double':
        return {
          ...constants.generateNumericComparisonOperator(intl),
          component: shouldRenderDirective(this.generateNumericComparisonField()),
        };
      case 'BigDecimal':
        return {
          ...constants.generateNumericComparisonOperator(intl),
          component: shouldRenderDirective(this.generateNumericComparisonField()),
        };
      case 'ID':
        return {
          ...constants.generateStringComparisonOperator(intl),
          component: shouldRenderDirective(this.generateIdComparisonField()),
        };
      case 'OperatingSystemFamily': 
      case 'FormFactor':
      case 'HashFunction':
      case 'BrowserFamily':
      case 'UserAgentType':
      case 'ActivitySource':
      case 'UserActivityType':
        return {
          ...constants.generateEnumComparisonOperator(intl),
          component: shouldRenderDirective(
            this.generateTagSelectComparisonField(
              (builtinEnumTypeOptions[fieldType as BuitinEnumerationType] as string[]).map(v => ({ label: v, value: v }))
            ),
          ),
        };
      default:
        return {
          values: [],
          defaultValue: undefined,
          component: undefined,
        };
    }
  };

  generateTimestampComparisonField() {
    const { intl, name, idToAttachDropDowns } = this.props;

    let popUpProps = {};

    if (idToAttachDropDowns) {
      popUpProps = {
        getCalendarContainer: (e: HTMLElement) =>
          document.getElementById(idToAttachDropDowns)!,
      };
    }

    return (
      <FormRelativeAbsoluteDateField
        name={name ? `${name}.comparison.values` : 'comparison.values'}
        component={FormRelativeAbsoluteDate}
        formItemProps={{
          label: intl.formatMessage(messages.fieldConditionValuesLabel),
          required: true,
        }}
        datePickerProps={{
          ...popUpProps,
        }}
        small={true}
        unixTimstamp={true}
      />
    );
  }

  generateDateComparisonField() {
    const { intl, name, idToAttachDropDowns } = this.props;

    let popUpProps = {};

    if (idToAttachDropDowns) {
      popUpProps = {
        getCalendarContainer: (e: HTMLElement) =>
          document.getElementById(idToAttachDropDowns)!,
      };
    }

    return (
      <FormRelativeAbsoluteDateField
        name={name ? `${name}.comparison.values` : 'comparison.values'}
        component={FormRelativeAbsoluteDate}
        formItemProps={{
          label: intl.formatMessage(messages.fieldConditionValuesLabel),
          required: true,
        }}
        datePickerProps={{
          ...popUpProps,
        }}
        small={true}
      />
    );
  }

  generateStringComparisonField() {
    const { intl, name } = this.props;

    return (
      <FormMultiTagField
        name={name ? `${name}.comparison.values` : 'comparison.values'}
        component={FormMultiTag}
        formItemProps={{
          label: intl.formatMessage(messages.fieldConditionValuesStringLabel),
          required: true,
        }}
        helpToolTipProps={{
          title: intl.formatMessage(messages.fieldConditionMultiValuesTooltip),
        }}
        small={true}
      />
    );
  }

  generateTagSelectComparisonField(options: Array<{ label: string, value: string }>) {
    const { intl, name, idToAttachDropDowns } = this.props;

    let popUpProps = {};

    if (idToAttachDropDowns) {
      popUpProps = {
        getPopupContainer: (e: HTMLElement) =>
          document.getElementById(idToAttachDropDowns)!,
      };
    }

    return (
      <FormTagSelectField
        name={name ? `${name}.comparison.values` : 'comparison.values'}
        component={TagSelect}
        formItemProps={{
          label: intl.formatMessage(messages.fieldConditionValuesLabel),
          required: true,
        }}
        selectProps={{
          options,
          ...popUpProps,
        }}
        helpToolTipProps={{
          title: intl.formatMessage(messages.fieldConditionMultiValuesTooltip),
        }}
        small={true}
      />
    );
  }

  generateBooleanComparisonField() {
    return this.generateTagSelectComparisonField([
      { value: 'true', label: 'true' },
      { value: 'false', label: 'false' },
    ]);
  }

  generateEnumComparisonField(buitinEnumerationType?: BuitinEnumerationType) {
    const { intl } = this.props;

    return <div>{intl.formatMessage(messages.fieldTypeNotSupported)}</div>;
  }

  generateNumericComparisonField() {
    const { intl, name, fieldValidators, idToAttachDropDowns } = this.props;

    let popUpProps = {};

    if (idToAttachDropDowns) {
      popUpProps = {
        getPopupContainer: (e: HTMLElement) =>
          document.getElementById(idToAttachDropDowns)!,
      };
    }

    // TODO do multi rendering for equals and not equals, do simple input rendering for the rest
    return (
      <FormMultiTagField
        name={name ? `${name}.comparison.values` : 'comparison.values'}
        component={FormMultiTag}
        validate={[
          fieldValidators.isRequired,
          fieldValidators.isValidArrayOfNumber,
        ]}
        formItemProps={{
          label: intl.formatMessage(messages.fieldConditionValuesNumberLabel),
          required: true,
        }}
        selectProps={{
          options: [],
          dropdownStyle: { display: 'none' },
          ...popUpProps,
        }}
        helpToolTipProps={{
          title: intl.formatMessage(messages.fieldConditionMultiValuesTooltip),
        }}
        small={true}
      />
    );
  }

  generateIdComparisonField() {
    const {
      intl,
      name,
      match: {
        params: { organisationId },
      },
      objectType,
      datamartId,
      idToAttachDropDowns,
    } = this.props;

    const fetchListMethod = (keywords: string) =>
      this._audienceSegmentService.getSegments(organisationId, { keywords, datamart_id: datamartId }).then(
        res => res.data.map(r => ({ key: r.id, label: <SegmentNameDisplay audienceSegmentResource={r}/> })),
      );
    const fetchSingleMethod = (id: string) =>
      this._audienceSegmentService.getSegment(id).then(res => ({
        key: res.data.id,
        label: <SegmentNameDisplay audienceSegmentResource={res.data}/>,
      }));

    let popUpProps = {};

    if (idToAttachDropDowns) {
      popUpProps = {
        getPopupContainer: (e: HTMLElement) =>
          document.getElementById(idToAttachDropDowns)!,
      };
    }

    return objectType.name === 'UserSegment' ? (
      <FormSearchObjectField
        name={name ? `${name}.comparison.values` : 'comparison.values'}
        component={FormSearchObject}
        formItemProps={{
          label: intl.formatMessage(messages.fieldConditionValuesStringLabel),
          required: true,
        }}
        fetchListMethod={fetchListMethod}
        fetchSingleMethod={fetchSingleMethod}
        helpToolTipProps={{
          title: intl.formatMessage(messages.fieldConditionMultiValuesTooltip),
        }}
        selectProps={{
          ...popUpProps,
        }}
        small={true}
      />
    ) : (
      this.generateStringComparisonField()
    );
  }

  generateReferenceTableComparisonField(type: string, modelType?: string) {
    const {
      intl,
      name,
      objectType,
      idToAttachDropDowns,
      datamartId,
      runtimeSchemaId,
      formValues,
      expressionIndex,
      match: {
        params: {
          organisationId
        }
      }
    } = this.props;

    const field = this.getField(formValues, expressionIndex);



    let fetchListMethod = (keywords: string) => {
      if (field) {
        return ReferenceTableService.getReferenceTable(datamartId, runtimeSchemaId, objectType.name, field.field)
        .then(res => res.data.map(r => ({ key: r.value, label:r.display_value })))
      }
      return Promise.resolve([])
    }

    let fetchSingleMethod = (id: string) => Promise.resolve({ key: id, label: id })
    let selectProps = {};
    let loadOnlyOnce = false;

    if (type && type === "CORE_OBJECT") {
      if (modelType) {
        switch (modelType) {
          case 'COMPARTMENTS':
            fetchListMethod = (keywords: string) => {
              return DatamartService.getUserAccountCompartments(datamartId).then(res => res.data.map(r => ({ key: r.compartment_id, label: r.name ? r.name : r.token })))
            }
            fetchSingleMethod = (id: string) => this._compartmentService.getCompartment(id).then(res => ({ key: res.data.id, label: res.data.name }))
            break;
          case 'CHANNELS':
            fetchListMethod = (keywords: string) => {
              return channelService.getChannels(organisationId, datamartId, { keywords: keywords }).then(res => res.data.map(r => ({ key: r.id, label: r.name })))
            }
            fetchSingleMethod = (id: string) => channelService.getChannel(datamartId, id).then(res => ({ key: res.data.id, label: res.data.name }))
            break;
          case 'SEGMENTS':
            fetchListMethod = (keywords: string) => {
              return this._audienceSegmentService.getSegments(organisationId, { keywords: keywords, datamart_id: datamartId }).then(res => res.data.map(r => ({ key: r.id, label: r.name })))
            }
            fetchSingleMethod = (id: string) => this._audienceSegmentService.getSegment(id).then(res => ({ key: res.data.id, label: res.data.name }))
            break;
        }
      }
    } else if (type && type === "COMPUTED") {
      fetchListMethod = (keywords: string) => this.fetchPredicates(this._computedTreeNodePath).then(r => r.map( e => ({ key: e, label: e })));
      selectProps = {
        ...selectProps, 
        mode: 'tags'
      }
      loadOnlyOnce = true
    }
    

   

    if (idToAttachDropDowns) {
      selectProps = {
        ...selectProps,
        getPopupContainer: (e: HTMLElement) =>
          document.getElementById(idToAttachDropDowns)!,
      };
    }

    return (
      <FormSearchObjectField
        name={name ? `${name}.comparison.values` : 'comparison.values'}
        component={FormSearchObject}
        formItemProps={{
          label: intl.formatMessage(messages.fieldConditionValuesStringLabel),
          required: true,
        }}
        fetchListMethod={fetchListMethod}
        fetchSingleMethod={fetchSingleMethod}
        helpToolTipProps={{
          title: intl.formatMessage(messages.fieldConditionMultiValuesTooltip),
        }}
        selectProps={{
          ...selectProps,
        }}
        small={true}
        loadOnlyOnce={loadOnlyOnce}
      />
    );
  }

  

  getFieldDirective = (fieldName: string) => {
    const {
      objectType
    } = this.props;
    const foundField = objectType.fields.find(f => f.name === fieldName);
    return foundField ? foundField.directives : undefined;
  }

  render() {
    const {
      expressionIndex,
      fieldValidators: { isRequired },
      intl,
      formValues,
      name,
      idToAttachDropDowns,
    } = this.props;

   

    const field = this.getField(formValues, expressionIndex);
    const directive = field ? this.getFieldDirective(field.field) : undefined;
    const hasSelectedAField = field && field.field !== '';
    const fieldName = field ? field.field : '';
    const fieldCondition =
      field && field.comparison && field.comparison.operator
        ? (field.comparison.operator as ConditionsOperators)
        : undefined;
    const fieldType = this.getSelectedFieldType(fieldName);
    const fieldIndexDataType = this.getSelectedFieldIndexDataType(fieldName);

    let popUpProps = {};

    if (idToAttachDropDowns) {
      popUpProps = {
        getPopupContainer: (e: HTMLElement) =>
          document.getElementById(idToAttachDropDowns)!,
      };
    }

    return (
      <div>
        <FormSelectField
          name={name ? `${name}.field` : 'field'}
          component={DefaultSelect}
          validate={[isRequired]}
          options={this.getAvailableFields()}
          formItemProps={{
            label: intl.formatMessage(messages.fieldConditionFieldLabel),
            required: true,
          }}
          selectProps={{
            ...popUpProps,
          }}
          small={true}
        />
        <FormSelectField
          name={name ? `${name}.comparison.operator` : 'comparison.operator'}
          component={DefaultSelect}
          validate={[]}
          options={this.generateAvailableConditionOptions(fieldType, fieldIndexDataType, directive).values}
          formItemProps={{
            label: intl.formatMessage(messages.fieldConditionConditionLabel),
          }}
          selectProps={{
            notFoundContent: intl.formatMessage(messages.fieldTypeNotSupported),
            ...popUpProps,
          }}
          small={true}
          disabled={!hasSelectedAField}
        />
        {fieldName &&
          fieldCondition &&
          this.generateAvailableConditionOptions(fieldType, fieldIndexDataType, directive).component}
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: FieldNodeFormProps) => ({
  formValues: getFormValues(ownProps.formName || FORM_ID)(state),
});

export default compose<Props, FieldNodeFormProps>(
  withRouter,
  injectIntl,
  withValidators,
  withNormalizer,
  connect(mapStateToProps),
)(FieldNodeForm);
