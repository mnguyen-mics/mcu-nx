import {Action, createAction} from 'redux-actions';

import {
  ErrorResponse
} from 'mcs-services/lib/MicsApi';
import MessageDescriptor = ReactIntl.FormattedMessage.MessageDescriptor;
import {ArgsProps} from 'antd/lib/notification';

export const NOTIFICATIONS_ADD = 'NOTIFICATIONS_ADD';
export const NOTIFICATIONS_REMOVE = 'NOTIFICATIONS_REMOVE';
export const NOTIFICATIONS_RESET = 'NOTIFICATIONS_RESET';

export type NotificationLevel = 'info' | 'success' | 'warning' |'error';

// TODO compose with ArgsProps instead of inherit
export interface Notification extends Partial<ArgsProps> {
  level: NotificationLevel,
  uid: number,
  intlMessage?: MessageDescriptor,
  intlDescription?: MessageDescriptor,
  apiError?: ErrorResponse
  error?: Error,
  newVersion?: boolean
}


const notifications = (state : Array<Notification> = [], action: Action<number | Partial<Notification>>) => {
  switch (action.type) {
    case NOTIFICATIONS_ADD:
      return [
        ...state,
        action.payload,
      ];
    case NOTIFICATIONS_REMOVE:
      return state.filter(notification => {
        return notification.uid !== action.payload;
      });
    case NOTIFICATIONS_RESET:
      return [];
    default:
      return state;
  }
};


const addNotification =
  createAction(NOTIFICATIONS_ADD,
    (opts: Partial<Notification>): Notification => (
      {
        ...opts,
        uid: opts.uid || Date.now(),
        level:  opts.level || 'success'
      }));

export const removeNotification =
  createAction(NOTIFICATIONS_REMOVE,
    (key: number) => key);

export const resetNotifications = createAction(NOTIFICATIONS_RESET);

export const notifyApiError = (error : ErrorResponse, notifConfig : Partial<Notification> = {}): Action<Notification> =>
  notifyError({
    ...notifConfig,
    apiError: error,
  });

export const notifyJsError = (error : Error, notifConfig : Partial<Notification> = {}): Action<Notification> =>
  notifyError({
    ...notifConfig,
    error: error
  });

export const notifyError = (notifConfig : Partial<Notification> = {}): Action<Notification> =>
  addNotification({
    duration: 0,
    ...notifConfig,
    level: 'error'
  });



export const notifySuccess = (notifConfig : Partial<Notification>) =>
  addNotification({
    // default success duration is 4.5 secondes
    duration: 4.5,
    ...notifConfig,
    level: 'success'
  });

export const notifyWarning = (notifConfig : Partial<Notification>) =>
  addNotification({
    duration: 0,
    ...notifConfig,
    level: 'warning'
  });


export const notifyInfo = (notifConfig : Partial<Notification>) =>
  addNotification({
    duration: 0,
    ...notifConfig,
    level:'info'
  });

export const NotificationsReducers = { notifications };
