import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Form, Icon, Input, Button, Checkbox } from 'antd';

import log from 'mcs-services/lib/Log';
import * as notifyActions from '../Notifications';
import {Notification} from '../Notifications';

import logoUrl from '../Logo/logo-mediarithmics.png';

import {logIn, LoginRequestMeta, LoginRequestPayload, LoginStore, RedirectCallback} from './LoginState';
import {WrappedFormUtils} from "antd/lib/form/Form";
import {compose} from "recompose";
import {Action, ActionMeta} from 'redux-actions';

const FormItem = Form.Item;


interface LoginProps {}


interface LoginProvidedProps extends LoginProps{
  form: WrappedFormUtils,
  hasError: boolean,
  location: any,
  logInRequest: (p: LoginRequestPayload, cb: RedirectCallback) => ActionMeta<LoginRequestPayload, LoginRequestMeta>,
  isRequesting: boolean,
  history: any,
  match: any,

  notifyError: (error: Partial<Notification>) => Action<Notification>,
}

interface LoginState {}

class Login extends React.Component<LoginProvidedProps, LoginState> {

  constructor(props: LoginProvidedProps) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(newProps: LoginProvidedProps) {
    const {
      hasError,
      notifyError
    } = this.props;

    if(hasError) notifyError({message: (<FormattedMessage id="LOG_IN_ERROR" defaultMessage="Log in error" />) });
  }

  render() {

    const {
      form,
      isRequesting,
     } = this.props;



    return (
      <div className="mcs-login-container">
        <div className="login-frame">
          <Form onSubmit={this.handleSubmit} className="login-form">
            <img alt="mics-logo" className="login-logo" src={logoUrl} />
            <FormItem>
              {form.getFieldDecorator('email', {
                rules: [{ required: true, message: 'translations.EMAIL_REQUIRED' }],
              })(
                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder={ 'translations.EMAIL_PLACEHOLDER' } />,
              )}
            </FormItem>
            <FormItem>
              {form.getFieldDecorator('password', {
                rules: [{ required: true, message: 'translations.PASSWORD_REQURED' }],
              })(
                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder={ 'translations.PASSWORD_PLACEHOLDER' } />,
              )}
            </FormItem>
            <FormItem>
              {form.getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: false,
              })(
                <Checkbox><FormattedMessage id="REMEMBER_ME" defaultMessage="Remember me" /></Checkbox>,
              )}
              <Link className="login-form-forgot" to="/v2/forgot_password"><FormattedMessage id="FORGOT_PASSWORD" defaultMessage="Forgot password"/></Link>
              <Button type="primary" htmlType="submit" className="login-form-button" loading={isRequesting}>
                <FormattedMessage id="LOG_IN" defaultMessage="Log in"/>
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }

  handleSubmit : React.FormEventHandler<any> = (e) => {
    e.preventDefault();
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { match } = this.props;

    const redirect = () => {
      log.debug(`Redirect from ${match.url} to ${from.pathname}`);
      this.props.history.push(from);
    };

    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.logInRequest({
          email: values.email,
          password: values.password,
          remember: values.remember,
        }, redirect );
      }
    });
  }
}


const mapStateToProps = (state : {login : LoginStore} ) => ({
  hasError: state.login.hasError,
  isRequesting: state.login.isRequesting,
});

const mapDispatchToProps = {
  logInRequest: logIn.request,
  notifyError: notifyActions.notifyError
};

export default compose<LoginProvidedProps, LoginProps>(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withRouter,
  Form.create()
)(Login)

