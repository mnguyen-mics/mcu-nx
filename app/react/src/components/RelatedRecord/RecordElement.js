import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Icon, Row } from 'antd';

import McsIcons from '../McsIcons';

function RecordElement({ recordIconType, title, actionButtons, children }) {
  return (
    <Row className="related-record">
      <Col span={1}>
        <McsIcons type={recordIconType} />
      </Col>
      <Col span={7}>
        {title}
      </Col>
      <Col span={15}>
        {children}
      </Col>
      <Col span={1}>
        {actionButtons.map(({ iconType, onClick }) => {
          return (
            <Button key={Math.random()} className="invisible-button" onClick={onClick}>
              <Icon type={iconType} />
            </Button>
          );
        })}
      </Col>
    </Row>
  );
}

RecordElement.defaultProps = {
  title: '',
  actionButtons: [],
};

RecordElement.propTypes = {
  recordIconType: PropTypes.string.isRequired,
  title: PropTypes.string,
  actionButtons: PropTypes.arrayOf(
    PropTypes.shape({
      iconType: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    }),
  ),
};

export default RecordElement;
