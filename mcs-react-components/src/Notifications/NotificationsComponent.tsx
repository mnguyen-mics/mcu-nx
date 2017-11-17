import * as React from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {notification as antNotification, Button} from 'antd';
import {ArgsProps} from 'antd/lib/notification';


import {InjectedIntl, injectIntl, defineMessages, Messages} from 'react-intl';

import {Notification, NotificationLevel, removeNotification} from './NotificationsState'
import {Function1} from 'lodash';


interface NotificationState {
}

interface NotificationsProps {

}

interface NotificationsProvidedProps extends NotificationsProps {
    notifications: Array<Notification>,
    removeNotification: (uid: number) => void,
    intl: InjectedIntl
}

const messages: Messages = defineMessages({
    newVersionMessage: {
        id: 'notification.newVersion.message',
        defaultMessage: 'New Version available',
    },
    newVersionDescription: {
        id: 'notification.newVersion.description',
        defaultMessage: 'Please reload the page',
    },
    newVersionReloadBtn: {
        id: 'notification.newVersion.button.reload',
        defaultMessage: 'Reload',
    },
    errorMessage: {
        id: 'notitication.error.default_message',
        defaultMessage: 'Error',
    },
    errorDescription: {
        id: 'notification.error.default_description',
        defaultMessage: 'An error occured',
    },
    errorDescriptionWithErrorId: {
        id: 'notification.error.default_description_with_errorid',
        defaultMessage: 'Something went wrong, please contact your administrator with the following id:',
    },
    errorDescriptionCustomWithErrorId: {
        id: 'notification.error.default_custom_description_with_errorid',
        defaultMessage: 'Please contact your administrator with the following id:',
    },
});

const apiErrorMessages: Messages = defineMessages({
    AUTHORIZATION_ERROR: {
        id: 'AUTHORIZATION_ERROR',
        defaultMessage: 'Authorization Error'
    },
    SERVICE_UNAVAILABLE: {
        id: 'SERVICE_UNAVAILABLE',
        defaultMessage: 'Service Unavailable'
    },
    EMAIL_ALREADY_EXISTS: {
        id: 'EMAIL_ALREADY_EXISTS',
        defaultMessage: 'Email already exists'
    },
    RESOURCE_NOT_FOUND: {
        id: 'RESOURCE_NOT_FOUND',
        defaultMessage: 'Resource not found'
    },
    UNABLE_TO_STORE_FILE: {
        id: 'UNABLE_TO_STORE_FILE',
        defaultMessage: 'Unable to store file'
    },
    MAC_ERROR: {
        id: 'MAC_ERROR',
        defaultMessage: 'Mac Error'
    },
    AUTHENTICATION_ERROR: {
        id: 'AUTHENTICATION_ERROR',
        defaultMessage: 'Authentication Error'
    },
    BAD_REQUEST_FORMAT: {
        id: 'BAD_REQUEST_FORMAT',
        defaultMessage: 'Bad Request Format'
    },
    TOKEN_ERROR: {
        id: 'TOKEN_ERROR',
        defaultMessage: 'Token Error'
    },
    CONSTRAINT_VIOLATION_EXCEPTION: {
        id: 'CONSTRAINT_VIOLATION_EXCEPTION',
        defaultMessage: 'Constraint Violation Exception'
    },
    BAD_REQUEST_DATA: {
        id: 'BAD_REQUEST_DATA',
        defaultMessage: 'Bad Request Data'
    },
});


class Notifications extends React.Component<NotificationsProvidedProps, NotificationState> {


    buildMessageAndDesc(notification: Notification): ArgsProps {
        const formatMessage = this.props.intl.formatMessage;

        const empty: ArgsProps = {
            message: "",
            description: ""
        };

        //precond = notification.message || notification.description
        const argsPropsFromMessage = (): ArgsProps => {
            if (notification.message && notification.description)
                return {
                    message: notification.message,
                    description: notification.description
                };
            else if (notification.message)
                return {
                    message: notification.message,
                    description: empty.description
                };
            else
                return {
                    message: empty.message,
                    description: notification.description
                };
        };

        //precond = notification.intlMessage || notification.intlDescription
        const argsPropsFromIntl = (): ArgsProps => {
            if (notification.intlMessage && notification.intlDescription)
                return {
                    message: formatMessage(notification.intlMessage),
                    description: formatMessage(notification.intlDescription)
                };
            else if (notification.intlMessage)
                return {
                    message: formatMessage(notification.intlMessage),
                    description: empty.description
                };
            else
                return {
                    message: empty.message,
                    description: formatMessage(notification.intlDescription!)
                };

        };

        const argsPropsFromApiError = (): ArgsProps => {
            const apiError = notification.apiError!;
            return {
                message: <span>{formatMessage(apiErrorMessages[apiError.error_code])}</span>,
                description:
                    <span>{formatMessage(messages.errorDescriptionWithErrorId)}&nbsp;
                        <code>{apiError.error_id}</code>
          </span>
            };
        };

        if (notification.message || notification.description)
            return argsPropsFromMessage();

        if (notification.intlMessage)
            return argsPropsFromIntl();

        if (notification.apiError)
            return argsPropsFromApiError();

        //if(notification.error) //TODO

        if (notification.newVersion) {
            return {
                message: <span>{formatMessage(messages.newVersionMessage)}</span>,
                description: <span>{formatMessage(messages.newVersionDescription)}</span>,
                btn:
                    <Button type="primary" size="small" onClick={() => window.location.reload()}>
                        <span>{formatMessage(messages.newVersionReloadBtn)}</span>
                    </Button>
            };
        }

        return empty;
    }

    buildAntNotifConfig(notification: Notification): ArgsProps {
        const {
            removeNotification,
        } = this.props;


        const key = notification.uid.toString();

        const argsProps = this.buildMessageAndDesc(notification);
        return {
            ...argsProps,
            key: key,
            onClose: () => {
                // remove notification from redux store
                // call onClose callback is defined by caller
                removeNotification(notification.uid);
                if (notification.onClose)
                    notification.onClose();
            }
        };

    }

    componentWillReceiveProps(nextProps: NotificationsProvidedProps) {
        const {notifications: currentNotifications} = this.props;
        const {notifications: nextNotifications} = nextProps;

        if (nextNotifications.length > 0) {

            const nextNotificationIds = nextNotifications.map(notif => notif.uid);
            const currentNotificationIds = currentNotifications.map(notif => notif.uid);

            const notifIdsToClose = currentNotificationIds.filter(id =>
                nextNotificationIds.indexOf(id) < 0
            );

            notifIdsToClose.forEach(id => antNotification.close(id.toString()));

            const newNotifications = nextNotifications.filter(notif =>
                currentNotificationIds.indexOf(notif.uid) < 0
            );

            const notify = (level: NotificationLevel): Function1<ArgsProps, void> => {
                switch (level) {
                    case 'info':
                        return antNotification.info;
                    case 'success':
                        return antNotification.success;
                    case 'warning':
                        return antNotification.warning;
                    case 'error':
                        return antNotification.error;
                }
            };


            newNotifications.forEach(notif =>
                notify(notif.level)(this.buildAntNotifConfig(notif))
            );

        } else {
            antNotification.destroy();
        }

    }

    render() {
        return null;
    }

}


export default compose<NotificationsProvidedProps, {}>(
    connect(
        (state: { notifications: Array<Notification> }) =>
            ({notifications: state.notifications}),
        {removeNotification: removeNotification},
    ),
    injectIntl,
)(Notifications);
