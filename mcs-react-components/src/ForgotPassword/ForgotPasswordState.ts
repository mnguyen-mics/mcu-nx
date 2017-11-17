import {Action, createAction} from 'redux-actions';
import {createRequestTypes} from '../utils/ReduxHelper';

export const PASSWORD_FORGOT = createRequestTypes('PASSWORD_FORGOT');
export const PASSWORD_FORGOT_RESET = 'PASSWORD_FORGOT_RESET';

const sendPassword = {
  request: createAction<string>(PASSWORD_FORGOT.REQUEST),
  success: createAction(PASSWORD_FORGOT.SUCCESS),
  failure: createAction(PASSWORD_FORGOT.FAILURE),

};

const passwordForgotReset = createAction(PASSWORD_FORGOT_RESET);


export {
  sendPassword,
  passwordForgotReset,
};


const defaultForgotPasswordState = {
  isRequesting: false,
  hasError: false,
  passwordSentSuccess: false,
  error: {},
};

const forgotPassword = (state = defaultForgotPasswordState, action: Action<any>) => {

  switch (action.type) {

    case PASSWORD_FORGOT.REQUEST:
      return {
        ...state,
        isRequesting: true,
      };
    case PASSWORD_FORGOT.FAILURE:
      return {
        ...state,
        isRequesting: false,
        hasError: true,
        error: action.payload,
      };
    case PASSWORD_FORGOT.SUCCESS:
      return {
        ...state,
        passwordSentSuccess: true,
      };
    case PASSWORD_FORGOT_RESET:
      return defaultForgotPasswordState;
    default:
      return state;
  }

};

const ForgotPasswordReducers = {
  forgotPassword,
};

export default ForgotPasswordReducers;
