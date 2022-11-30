// @ts-ignore
import ApiService from '../../services/ApiService';

export const CALL_API = Symbol('Call Api');
// @ts-ignore
export default store => next => action => {
  const callAPI = action[CALL_API];

  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  const { method, endpoint, params, body, types, others = {} } = callAPI;
  const [requestType, failureType, successType] = types;
  const { dispatch } = store;

  // @ts-ignore
  const onRequest = type => {
    return {
      type,
      others,
    };
  };
  // @ts-ignore
  const onRequestSuccess = (type, payload) => {
    return {
      type,
      response: payload,
      authenticated: true,
      body,
      others,
    };
  };
  // @ts-ignore
  const onRequestFailure = (type, error) => {
    return {
      type,
      others,
      response: error,
    };
  };

  dispatch(onRequest(requestType));

  return ApiService.request(method, endpoint, params)
    .then(json => dispatch(onRequestSuccess(successType, json)))
    .catch(error => {
      dispatch(onRequestFailure(failureType, error));
      return Promise.reject(error);
    });
};
