import AuthenticatedRoute from './AuthenticatedRoute';

// import {View} from '../Layout/View';

import {FormattedMessage} from 'react-intl';

export interface RouteDesc {
    name: FormattedMessage.MessageDescriptor
    path: string,
    view: string
}
export interface RouteBuilder<T> {
    makePath: (t: T) => string
}

export {
    AuthenticatedRoute,
};
