import { Timeline } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import * as React from 'react';
import FoldableCard, { FoldableCardProps } from './FoldableCard';

export interface FoldableCardHierarchyResource {
  foldableCard: FoldableCardProps;
  children: FoldableCardHierarchyResource[];
}

export interface FoldableCardHierarchyProps {
  hierachy?: FoldableCardHierarchyResource;
  className?: string;
  cardClassName?: string;
}

export default class FoldableCardHierarchy extends React.Component<FoldableCardHierarchyProps> {
  buildFoldableCardHierachy() {
    const recusiveBuildFoldableCardHierachy = (
      currentNode: FoldableCardHierarchyResource,
    ): React.ReactNode => {
      const childrenNodes = [];

      for (let index = 0; index < currentNode.children.length; index++) {
        childrenNodes.push(
          <Timeline.Item
            className={
              'mics-foldable-card-timeline' +
              (index === currentNode.children.length - 1 ? ' mics-foldable-card-timeline-last' : '')
            }
            dot={
              <div className='mics-foldable-card-timeline-dash-container'>
                <hr className='mics-foldable-card-timeline-dash' />
              </div>
            }
          >
            <div className='mics-foldable-card-children-container'>
              {recusiveBuildFoldableCardHierachy(currentNode.children[index])}
            </div>
          </Timeline.Item>,
        );
      }

      return (
        <React.Fragment>
          <div>
            <FoldableCard {...currentNode.foldableCard} />
            <div className='mics-foldable-card-children-container-first'>{childrenNodes}</div>
          </div>
        </React.Fragment>
      );
    };

    const { hierachy } = this.props;

    return hierachy ? recusiveBuildFoldableCardHierachy(hierachy) : <div />;
  }

  render() {
    return <Content style={{ padding: '15px' }}>{this.buildFoldableCardHierachy()}</Content>;
  }
}
