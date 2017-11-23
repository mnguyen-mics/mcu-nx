import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage, InjectedIntlProps } from 'react-intl';
import { Form, Icon, Input, Button, Alert } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import {
  sendPassword,
  passwordForgotReset,
  ForgotPasswordState,
  ForgotPasswordRequestPayload 
} from './ForgotPasswordState';
import messages from './messages';
import logoUrl from '../assets/images/logo-mediarithmics.png';

const FormItem = Form.Item;

interface DispatchProps {
  sendPasswordRequest: (payload: ForgotPasswordRequestPayload) => Dispatch<{}>;
  passwordForgotReset: () => Dispatch<{}>;
}

type JoinedProps = 
  ForgotPasswordState &
  InjectedIntlProps &
  FormComponentProps &
  DispatchProps

class ForgotPassword extends React.Component<JoinedProps> {

  constructor(props: JoinedProps) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  componentWillUnmount() {
    this.props.passwordForgotReset();
  }

  render() {

    const {
      form: {
        getFieldDecorator,
      },
      isRequesting,
      hasError,
      passwordSentSuccess,
      intl: { formatMessage },
     } = this.props;

    const hasFieldError = this.props.form.getFieldError('email');
    const errorMsg = !hasFieldError && hasError ? <Alert type="error" message={<FormattedMessage {...messages.resetPasswordTitle} />} /> : null;

    return (
      <div className="mcs-reset-password-container">
        <div className="reset-password-container-frame">
          <img alt="mics-logo" className="reset-password-logo" src={logoUrl} />
          { !passwordSentSuccess &&
          <Form onSubmit={this.handleSubmit} className="reset-password-form">
            { errorMsg }
            <div className="reset-passwork-msg" >
              <FormattedMessage {...messages.resetPasswordTitle} />
            </div>
            <FormItem>
              { getFieldDecorator('email', {
                rules: [{ type: 'email', required: true, message: formatMessage(messages.resetPasswordEmailRequired) }],
              })(
                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder={formatMessage(messages.resetPasswordEmail)} />,
            )}
            </FormItem>
            <Button type="primary" htmlType="submit" className="reset-password-button" loading={isRequesting}>
              <FormattedMessage {...messages.resetPasswordSubmit} />
            </Button>
            <Link className="back-to-login" to="/login"><FormattedMessage {...messages.resetPasswordBack} /></Link>
          </Form>
        }
          { passwordSentSuccess &&
          <div>
            <div>
              <FormattedMessage {...messages.resetPasswordPasswordSent} />
              <br />
              <FormattedMessage {...messages.resetPasswordEmailSpan} />
            </div>
            <br />
            <Button type="primary" htmlType="button" className="reset-password-button">;

              <Link to="/login"><FormattedMessage {...messages.resetPasswordReturnToLogin} /></Link>
            </Button>
          </div>
        }

        </div>
      </div>
    );

  }

  handleSubmit = () => {

    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.sendPasswordRequest({
          email: values.email,
        });
      }
    });
  }

}

export default compose(
  injectIntl,
  Form.create(),
  connect(
    (state: { forgotPassword: ForgotPasswordState }) => ({
      hasError: state.forgotPassword.hasError,
      isRequesting: state.forgotPassword.isRequesting,
      passwordSentSuccess: state.forgotPassword.passwordSentSuccess,
    }),
    {
      sendPasswordRequest: sendPassword.request,
      passwordForgotReset: passwordForgotReset,    
    }
  )
)(ForgotPassword);
