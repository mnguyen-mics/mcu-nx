import 'jest'
import * as React from 'react'
import CollectionView, { CollectionViewProps } from '../CollectionView'
import * as TestRenderer from 'react-test-renderer'
import { Col } from 'antd'

it('should display a loading collection view', () => {
	const items = []

	for (let i = 1; i <= 30; i++) {
		items.push(
			<Col key='test'>
				<li>test {i}</li>
			</Col>
		)
	}

	const props: CollectionViewProps = {
		loading: true,
		collectionItems: items,
	}

	const component = TestRenderer.create(<CollectionView {...props} />)
	const res = component.toJSON()
	expect(res).toMatchSnapshot()
})

it('should display a collection view with items and pagination', () => {
	const items = []

	for (let i = 1; i <= 30; i++) {
		items.push(
			<Col key='test'>
				<li>test {i}</li>
			</Col>
		)
	}

	const props: CollectionViewProps = {
		collectionItems: items,
		loading: false,
		gutter: 50,
		span: 30,
		pagination: {
			current: 0,
			total: 60,
		},
	}

	const component = TestRenderer.create(<CollectionView {...props} />)
	const res = component.toJSON()
	expect(res).toMatchSnapshot()
})
