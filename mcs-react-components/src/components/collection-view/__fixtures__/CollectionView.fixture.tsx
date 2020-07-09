import * as React from 'react';
import { IntlProvider } from 'react-intl';
import CollectionView,{CollectionViewProps} from '../CollectionView';
import { Col} from 'antd';

const items =[]

for (let i = 1; i <= 30; i++) {
items.push(<Col key="test"><li>test {i}</li></Col>);
  }

const props:CollectionViewProps={
    collectionItems:items,
    loading:false,
    gutter:50,
    span:30,
    pagination:{
        current:0,
        total:60
    }
}

const component = (_props:CollectionViewProps)=>(
    <IntlProvider locale="en">
        <CollectionView {..._props}/>
    </IntlProvider>
);

component.displayName="CollectionView"

export default {
    component,
    props,
  };