import * as React from 'react';
import { IntlProvider } from 'react-intl';
import EmptyTableView,{EmptyTableViewProps} from '../EmptyTableView';

const props:EmptyTableViewProps={
    iconType:'magnifier',
    className:'mcs-table-view-empty',
    intlMessage:{
        defaultMessage:'Nothing to see here',
        id:'generic.table.empty.information_message'
    },
    text:'This is for testing purposes'
}

const component = (_props:EmptyTableViewProps)=>(
    <IntlProvider locale="en">
        <EmptyTableView {..._props}/>
    </IntlProvider>
);

component.displayName="EmptyTableView"

export default {
    component,
    props,
  };