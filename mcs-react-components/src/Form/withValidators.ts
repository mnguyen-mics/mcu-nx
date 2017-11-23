import { compose, withProps, ComponentEnhancer } from 'recompose';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';

const defaultErrorMessages = defineMessages({
  required: {
    id: 'common.form.field.error.required',
    defaultMessage: 'required',
  },
  invalidEmail: {
    id: 'common.form.field.error.invalid_email',
    defaultMessage: 'invalid email address',
  },
  invalidNumber: {
    id: 'common.form.field.error.invalid_number',
    defaultMessage: 'invalid number',
  },
  invalidUrl: {
    id: 'common.form.field.error.invalid_url',
    defaultMessage: 'invalid url',
  },
  invalidDomain: {
    id: 'common.form.field.error.invalid_domain',
    defaultMessage: 'invalid domain',
  },
  positiveNumber: {
    id: 'common.form.field.error.positive_number',
    defaultMessage: 'Number must be above 0',
  }
});

type Formatter = (desc: FormattedMessage.MessageDescriptor) => string;

const isRequired = (formatMessage: Formatter) => (value: string) => {
  return (!value || (value.length !== undefined && !value.length)
      ? formatMessage(defaultErrorMessages.required)
      : undefined
  );
};

const isNotZero = (formatMessage: Formatter) => (value: string) => {
  return (value && value === '0'
      ? formatMessage(defaultErrorMessages.positiveNumber)
      : undefined
  );
};

const isValidEmail = (formatMessage: Formatter) => (value: string) => {
  return value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ?
    formatMessage(defaultErrorMessages.invalidEmail) : undefined;
};

const isValidFloat = (formatMessage: Formatter) => (value: string) => {
  return value && !/^[0-9]+(\.[0-9]{1,2})?$/i.test(value) ?
    formatMessage(defaultErrorMessages.invalidNumber) : undefined;
};

const isValidInteger = (formatMessage: Formatter) => (value: string) => {
  return value && !/^\d+$/.test(value) ?
    formatMessage(defaultErrorMessages.invalidNumber) : undefined;
};

export default function<TInner, TOutter> (): ComponentEnhancer<TInner, TOutter>{ 
  return compose(
    injectIntl,
    withProps(({ intl: { formatMessage } }) => ({
      fieldValidators: {
        isNotZero: isNotZero(formatMessage),
        isRequired: isRequired(formatMessage),
        isValidEmail: isValidEmail(formatMessage),
        isValidFloat: isValidFloat(formatMessage),
        isValidInteger: isValidInteger(formatMessage),
      },
    })),
  );
};
