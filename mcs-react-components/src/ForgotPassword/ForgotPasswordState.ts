import {Action, createAction} from 'redux-actions';
import { ErrorResponse } from 'mcs-services/lib/MicsApi';

import { createRequestTypes, RequestTypes } from '../utils/ReduxHelper';

export const PASSWORD_FORGOT: RequestTypes = createRequestTypes('PASSWORD_FORGOT');
export const PASSWORD_FORGOT_RESET = 'PASSWORD_FORGOT_RESET';

export interface ForgotPasswordRequestPayload {
  email: string;
}

const sendPassword = {
  request: createAction<ForgotPasswordRequestPayload>(PASSWORD_FORGOT.REQUEST),
  success: createAction<any>(PASSWORD_FORGOT.SUCCESS),
  failure: createAction<ErrorResponse>(PASSWORD_FORGOT.FAILURE),

};

const passwordForgotReset = createAction(PASSWORD_FORGOT_RESET);


export {
  sendPassword,
  passwordForgotReset,
};

export interface ForgotPasswordState {
  isRequesting: boolean;
  hasError: boolean;
  passwordSentSuccess: boolean;
  error: Error; 
}


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
