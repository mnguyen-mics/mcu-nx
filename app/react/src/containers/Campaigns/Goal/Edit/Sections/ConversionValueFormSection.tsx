import * as React from 'react';
import { compose } from 'recompose';
import {
  injectIntl,
  InjectedIntlProps,
  defineMessages,
  FormattedMessage,
} from 'react-intl';
import { Checkbox } from 'antd';
import {
  FormSection,
  FormInputField,
  FormAddonSelectField,
} from '../../../../../components/Form';
import withValidators, {
  ValidatorProps,
} from '../../../../../components/Form/withValidators';
import FormInput from '../../../../../components/Form/FormInput';
import { RouteComponentProps, withRouter } from 'react-router';
import { ReduxFormChangeProps } from '../../../../../utils/FormHelper';
import { GoalFormData } from '../domain';
import AddonSelect from '../../../../../components/Form/FormSelect/AddonSelect';

const messages = defineMessages({
  sectionSubtitle1: {
    id: 'goalEditor.section.subtitle1',
    defaultMessage: 'Give your Goal a conversion value.',
  },
  sectionTitle1: {
    id: 'goalEditor.section.subtitle2',
    defaultMessage: 'Conversion Value',
  },
  defaultGoalValueLabel: {
    id: 'goalEditor.default.value.label',
    defaultMessage: 'Default Value',
  },
  defaultGoalValuePlaceholder: {
    id: 'goalEditor.default.value.placeholder',
    defaultMessage: 'Ex: 500',
  },
  defaultGoalValueTooltip: {
    id: 'goalEditor.default.value.tooltip',
    defaultMessage:
      'Give a conversion a value so that you can track your value creation directly in the goal dashboard.',
  },
  goalValueCurrencyPlaceholder: {
    id: 'goalEditor.value.currency.placeholder',
    defaultMessage: 'Ex: 500',
  },
});

interface State {
  displayConversionValueSection: boolean;
}

interface ConversionValueFormSectionProps extends ReduxFormChangeProps {
  initialValues: Partial<GoalFormData>;
  goalId?: string;
}

type Props = ConversionValueFormSectionProps &
  InjectedIntlProps &
  ValidatorProps &
  RouteComponentProps<{ goalId: string }>;

class ConversionValueFormSection extends React.Component<Props, State> {
  isDefaultGoalValue = this.props.initialValues &&
    this.props.initialValues.goal &&
    this.props.initialValues.goal.default_goal_value &&
    this.props.initialValues.goal.default_goal_value !== 0;

  constructor(props: Props) {
    super(props);
    this.state = { displayConversionValueSection: !!this.isDefaultGoalValue };
  }

  toggleConversionValueSection = () => {
    this.setState({
      displayConversionValueSection: !this.state.displayConversionValueSection,
    });
    this.props.formChange('goal.default_goal_value', 0);
  };

  render() {
    const { intl: { formatMessage } } = this.props;

    return (
      <div>
        <FormSection
          subtitle={messages.sectionSubtitle1}
          title={messages.sectionTitle1}
        />

        <Checkbox
          checked={this.state.displayConversionValueSection}
          onChange={this.toggleConversionValueSection}
        >
          <FormattedMessage
            id="goal-conversion-value-checkbox-message"
            defaultMessage="Add a conversion value"
          />
        </Checkbox>

        <div
          className={
            !this.state.displayConversionValueSection
              ? 'hide-section'
              : 'optional-section-content'
          }
        >
          <FormInputField
            name="goal.default_goal_value"
            component={FormInput}
            formItemProps={{
              label: formatMessage(messages.defaultGoalValueLabel),
            }}
            inputProps={{
              placeholder: formatMessage(messages.defaultGoalValuePlaceholder),
              addonAfter: (
                <FormAddonSelectField
                  name="goal.goal_value_currency"
                  component={AddonSelect}
                  options={[
                    {
                      title: 'EUR',
                      value: 'EUR',
                    },
                  ]}
                 selectProps={{
                  value: 'EUR'
                 }}
                />
              ),
            }}
            helpToolTipProps={{
              title: formatMessage(messages.defaultGoalValueTooltip),
            }}
          />
        </div>
      </div>
    );
  }
}

export default compose<Props, ConversionValueFormSectionProps>(
  injectIntl,
  withRouter,
  withValidators,
)(ConversionValueFormSection);
