import {
  AudienceBuilderFormData,
  AudienceBuilderGroupNode,
  AudienceBuilderParametricPredicateNode,
  QueryDocument,
} from './../../../models/audienceBuilder/AudienceBuilderResource';
import { FormattedMessage, defineMessages } from 'react-intl';

export const messages: {
  [key: string]: FormattedMessage.MessageDescriptor;
} = defineMessages({
  title: {
    id: 'audienceBuilder.title',
    defaultMessage: 'Audience Builder',
  },
  demographics: {
    id: 'audienceBuilder.category.demographics',
    defaultMessage: 'Demographics',
  },
  selectedAudience: {
    id: 'audienceBuilder.selectedAudience',
    defaultMessage: 'Selected Audience',
  },
  tooltipGender: {
    id: 'audienceBuilder.category.demographics.tooltiptGender',
    defaultMessage: 'Select the gender of your audience.',
  },
  tooltipAge: {
    id: 'audienceBuilder.category.demographics.tooltiptAge',
    defaultMessage: 'Select the age of your audience.',
  },
  tooltipLanguage: {
    id: 'audienceBuilder.category.demographics.tooltiptLanguage',
    defaultMessage: 'Select the language of your audience.',
  },
  narrowingWith: {
    id: 'audienceBuilder.category.narrowingWith',
    defaultMessage: 'narrowing with',
  },
  excludingWith: {
    id: 'audienceBuilder.category.excludingWith',
    defaultMessage: 'excluding',
  },
  purchasIntent: {
    id: 'audienceBuilder.liveDashboard.purchaseIntent',
    defaultMessage: 'Purchase Intent',
  },
  geographics: {
    id: 'audienceBuilder.liveDashboard.geographics',
    defaultMessage: 'Geographics',
  },
  audienceFeatures: {
    id: 'audienceBuilder.audienceFeature.card.title',
    defaultMessage: 'Audience Features',
  },
  addAudienceFeature: {
    id: 'audienceBuilder.audienceFeatureSelector.actionBarTitle',
    defaultMessage: 'Add more audience features',
  },
  noDemographicExpressions: {
    id: 'audienceBuilder.category.demographics.noDemographicExpressions',
    defaultMessage: 'No Demographic Expressions',
  },
  generalSectionTitle: {
    id: 'audienceBuilder.parametricPredicateForm.generalSectionTitle',
    defaultMessage: 'Audience Feature',
  },
  generalSectionSubtitle: {
    id: 'audienceBuilder.parametricPredicateForm.generalSectionSubtitle',
    defaultMessage: 'Select your audience features',
  },
  audienceFeatureId: {
    id: 'audienceBuilder.audienceFeatureSelector.id',
    defaultMessage: 'ID',
  },
  audienceFeatureName: {
    id: 'audienceBuilder.audienceFeatureSelector.name',
    defaultMessage: 'Name',
  },
  audienceFeatureDescription: {
    id: 'audienceBuilder.audienceFeatureSelector.description',
    defaultMessage: 'Description',
  },
  searchAudienceFeature: {
    id: 'audienceBuilder.audienceFeatureSelector.searchPlaceholder',
    defaultMessage: 'Search an audience feature',
  },
  audienceFeatureAdressableObject: {
    id: 'audienceBuilder.audienceFeatureSelector.adressableObject',
    defaultMessage: 'Adressable Object',
  },
  audienceFeatureObjectTreeExpression: {
    id: 'audienceBuilder.audienceFeatureSelector.objectTreeExpression',
    defaultMessage: 'Object Tree Expression',
  },
});

export const fieldGridConfig = {
  labelCol: { span: 3 },
  wrapperCol: { span: 15, offset: 1 },
};

export const FORM_ID = 'segmentBuilderFormData';

export const INITIAL_AUDIENCE_BUILDER_FORM_DATA: AudienceBuilderFormData = {
  where: {
    type: 'GROUP',
    boolean_operator: 'AND',
    expressions: [
      {
        type: 'GROUP',
        boolean_operator: 'OR',
        expressions: [],
      },
    ],
  },
};

export const formatQuery = (
  query: QueryDocument,
  isEditMode: boolean = false,
) => {
  if (query?.where) {
    return {
      ...query,
      where: {
        ...query.where,
        expressions: (query.where as AudienceBuilderGroupNode).expressions.map(
          (exp: AudienceBuilderGroupNode) => {
            return {
              ...exp,
              expressions: exp.expressions.map(
                (e: AudienceBuilderParametricPredicateNode) => {
                  const parameters: any = {};
                  const formatValue = (v: any) => {
                    if (Array.isArray(v)) {
                      return v[0] ? v[0].toString() : undefined;
                    } else if (typeof v === 'number') {
                      return v.toString();
                    } else return isEditMode ? [v] : v;
                  };
                  Object.keys(e.parameters).forEach(k => {
                    const value = formatValue(e.parameters[k]);
                    if (value) {
                      parameters[`${k}`] = value;
                    }
                  });

                  return {
                    ...e,
                    parameters: parameters,
                  };
                },
              ),
            };
          },
        ),
      },
    };
  } else return query;
};

export const buildQueryDocument = (formData: AudienceBuilderFormData) => {
  let query: QueryDocument = {
    language_version: 'JSON_OTQL',
    operations: [
      {
        directives: [
          {
            name: 'count',
          },
        ],
        selections: [],
      },
    ],
    from: 'UserPoint',
  };
  const clauseWhere = formData?.where;

  if (clauseWhere) {
    query = {
      ...query,
      where: clauseWhere,
    };
  }
  // This will be removed when backend will be able to handle List and Long
  return formatQuery(query) as any;
};
