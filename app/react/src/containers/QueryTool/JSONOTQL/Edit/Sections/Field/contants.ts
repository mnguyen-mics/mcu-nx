import {
  NumericComparisonOperator,
  BooleanComparisonOperator,
  EnumComparisonOperator,
  TimeComparisonOperator,
  StringComparisonOperator,
} from '../../../../../../models/datamart/graphdb/QueryDocument';
import { InjectedIntl } from 'react-intl';
import messages from '../../messages';

type defaultValue =
  | { type: string; operator: string; values: any[] }
  | undefined;

export interface ComparisonValues<T> {
  values: Array<{
    value: T;
    title: string;
  }>;
  defaultValue: defaultValue;
}

const comparisonOperators = {
  generateNumericComparisonOperator(
    intl: InjectedIntl,
  ): ComparisonValues<NumericComparisonOperator> {
    return {
      values: [
        {
          value: 'EQUAL',
          title: intl.formatMessage(messages.EQUAL),
        },
        {
          value: 'NOT_EQUAL',
          title: intl.formatMessage(messages.NOT_EQUAL),
        },
        {
          value: 'LT',
          title: intl.formatMessage(messages.LT),
        },
        {
          value: 'LTE',
          title: intl.formatMessage(messages.LTE),
        },
        {
          value: 'GT',
          title: intl.formatMessage(messages.GT),
        },
        {
          value: 'GTE',
          title: intl.formatMessage(messages.GTE),
        },
      ],
      defaultValue: { type: 'NUMERIC', operator: 'EQUAL', values: [] },
    };
  },
  generateBooleanComparisonOperator(
    intl: InjectedIntl,
  ): ComparisonValues<BooleanComparisonOperator> {
    return {
      values: [
        {
          value: 'EQUAL',
          title: intl.formatMessage(messages.EQUAL),
        },
        {
          value: 'NOT_EQUAL',
          title: intl.formatMessage(messages.NOT_EQUAL),
        },
      ],
      defaultValue: { type: 'BOOLEAN', operator: 'EQUAL', values: [] },
    };
  },
  generateEnumComparisonOperator(
    intl: InjectedIntl,
  ): ComparisonValues<EnumComparisonOperator> {
    return {
      values: [
        {
          value: 'EQUAL',
          title: intl.formatMessage(messages.EQUAL),
        },
        {
          value: 'NOT_EQUAL',
          title: intl.formatMessage(messages.EQUAL),
        },
      ],
      defaultValue: { type: 'ENUM', operator: 'EQ', values: [] },
    };
  },
  generateTimeComparisonOperator(
    intl: InjectedIntl,
  ): ComparisonValues<TimeComparisonOperator> {
    return {
      values: [
        {
          value: 'BEFORE',
          title: intl.formatMessage(messages.BEFORE),
        },
        {
          value: 'BEFORE_OR_EQUAL',
          title: intl.formatMessage(messages.BEFORE_OR_EQUAL),
        },
        {
          value: 'AFTER',
          title: intl.formatMessage(messages.AFTER),
        },
        {
          value: 'AFTER_OR_EQUAL',
          title: intl.formatMessage(messages.AFTER_OR_EQUAL),
        },
      ],
      defaultValue: { type: 'TIME', operator: 'BEFORE', values: [] },
    };
  },

  generateStringComparisonOperator(
    intl: InjectedIntl,
    indexDataType: string = "keyword"
  ): ComparisonValues<StringComparisonOperator> {
    switch (indexDataType) {
      case 'text':
      return {
        values: [
          {
            value: 'MATCHES',
            title: intl.formatMessage(messages.MATCHES),
          },
        ],
        defaultValue: { type: 'STRING', operator: 'MATCHES', values: [] },
      };
      default: {
        return {
          values: [
            {
              value: 'EQ',
              title: intl.formatMessage(messages.EQ),
            },
            {
              value: 'NOT_EQ',
              title: intl.formatMessage(messages.NOT_EQ),
            },
            {
              value: 'STARTS_WITH',
              title: intl.formatMessage(messages.STARTS_WITH),
            },
          ],
          defaultValue: { type: 'STRING', operator: 'EQ', values: [] },
        };
      }
    }
  },
};

export default comparisonOperators;
