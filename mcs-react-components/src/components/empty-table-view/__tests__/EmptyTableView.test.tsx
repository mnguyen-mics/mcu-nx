import 'jest';
import * as React from 'react';
import EmptyTableView, { EmptyTableViewProps } from "../EmptyTableView";
import * as TestRenderer from 'react-test-renderer';

it('should display an empty table view with a message and an icon',()=>{
    const props:EmptyTableViewProps={
        iconType:'magnifier',
        className:'mcs-table-view-empty',
        defaultMessage:'Nothing to see here',
        text:'This is for testing purposes'
    }
    const component = TestRenderer.create(
        <EmptyTableView {...props}/>
    );
    const res = component.toJSON();
    expect(res).toMatchSnapshot();
});

it('should display an empty table view default values',()=>{
    const props:EmptyTableViewProps={
        iconType:'warning'
    }
    const component = TestRenderer.create(
        <EmptyTableView {...props}/>
    );
    const res = component.toJSON();
    expect(res).toMatchSnapshot();
});