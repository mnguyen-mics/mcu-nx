import React from 'react';
import { Row, Col, Spin } from 'antd';

export interface CardProps {
  buttons?: React.ReactNode;
  title?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  type?: 'flex' | undefined;
  onClick?: () => void;
}

class Card extends React.Component<CardProps> {
  render() {
    const { title, buttons, isLoading, children, className, style } = this.props;

    const hasHeader = title || buttons;

    const titleElement = title && <span className='mcs-card-title'>{title}</span>;

    const buttonsElement = buttons && <span className='mcs-card-button'>{buttons}</span>;

    return (
      <Row
        className={`mcs-card ${className ? className : ''}`}
        style={style ? style : { display: 'block' }}
      >
        {hasHeader && (
          <Row className='mcs-card-header'>
            <Col span={24}>
              {titleElement}
              {buttonsElement}
            </Col>
          </Row>
        )}
        <Row
          style={this.props.type === 'flex' ? { flex: 1 } : { display: 'block' }}
          className='mcs-card_content'
        >
          {isLoading ? (
            <Col span={24} className='text-center'>
              <Spin />
            </Col>
          ) : (
            children
          )}
        </Row>
      </Row>
    );
  }
}

export default Card;
