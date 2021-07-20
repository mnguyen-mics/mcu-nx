import * as React from 'react';
import { Row, Col } from 'antd';
import ReactMapGL, { Marker } from 'react-map-gl';

export interface LocationProps {
  longitude: number;
  latitude: number;
  containerWidth?: number;
  mapboxToken?: string;
}

class Location extends React.Component<LocationProps> {
  render() {
    const { longitude, latitude, mapboxToken } = this.props;

    const settings = {
      dragPan: false,
      dragRotate: false,
      scrollZoom: false,
      touchZoomRotate: false,
      doubleClickZoom: false,
    };

    const containerWidth = this.props.containerWidth ? this.props.containerWidth : 0;

    const mapToken =
      ((global as any).window.MCS_CONSTANTS && (global as any).window.MCS_CONSTANTS.MAPBOX_TOKEN) ||
      mapboxToken;

    return longitude && latitude && mapToken ? (
      <Row gutter={10} className='table-line section border-top'>
        <Col span={24} style={{ height: '100px', margin: '-5px -20px' }}>
          <ReactMapGL
            {...settings}
            width={containerWidth + 40}
            height={100}
            latitude={latitude}
            longitude={longitude}
            zoom={9}
            attributionControl={false}
            preventStyleDiffing={true}
            mapboxApiAccessToken={mapToken}
          >
            <Marker latitude={latitude} longitude={longitude}>
              <svg width='10' height='10'>
                <circle cx='5' cy='5' r='5' fill='#00a1df' />
              </svg>
            </Marker>
          </ReactMapGL>
        </Col>
      </Row>
    ) : (
      <span />
    );
  }
}

export default Location;
