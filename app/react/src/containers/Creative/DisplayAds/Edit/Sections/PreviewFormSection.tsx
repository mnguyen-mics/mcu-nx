import * as React from 'react';
import { DisplayAdResource } from '../../../../../models/creative/CreativeResource';
import {
  DisplayCreativeFormData,
  DISPLAY_CREATIVE_FORM,
  isDisplayAdResource,
} from '../domain';
import { connect } from 'react-redux';
import { getFormInitialValues } from 'redux-form';
import { compose } from 'recompose';
const Dimensions = require('react-dimensions')

interface MapStateProps {
  initialValue: DisplayCreativeFormData;
  containerWidth: number;
  containerHeight: number;
}

const configuration = {
  ADS_PREVIEW_URL: '//ads.mediarithmics.com/ads/render',
};

interface State {
  width?: number,
  height?: number
}

class PreviewFormSection extends React.Component<MapStateProps, State> {

  constructor(props: MapStateProps) {
    super(props)
    this.state = {
      width: undefined,
      height: undefined
    }
  }

  renderIframeCreative = (creative: DisplayAdResource) => {
    const { initialValue: { properties: rendererProperties } } = this.props;

    let tagType = 'iframe';

    const foundTagType = rendererProperties.tag_type;

    if (foundTagType) {
      switch (foundTagType.property_type) {
        case 'URL':
          tagType = foundTagType!.value.url;
          break;
        default:
          tagType = foundTagType!.value.value;
          break;
      }
    }

    let previewUrl = `${configuration.ADS_PREVIEW_URL}?ctx=PREVIEW&rid=${
      creative.id
    }&caid=preview`;
    if (tagType === 'script') {
      previewUrl =
        `data:text/html;charset=utf-8,` +
        `${encodeURI(
          `<html><body style="margin-left: 0%; margin-right: 0%; margin-top: 0%; margin-bottom: 0%">` +
            `<script type="text/javascript" src="https:${
              configuration.ADS_PREVIEW_URL
            }?ctx=PREVIEW&rid=${creative.id}&caid=preview"></script>` +
            `</body></html>`,
        )}`;
    }
    return previewUrl;
  };

  formatDimension = (format: string): { width: number, height: number } => {
    return {
      width: parseInt(format.split('x')[0], 10),
      height: parseInt(format.split('x')[1], 10),
    };
  };

  render() {
    const { initialValue: { creative } } = this.props;

    if (!isDisplayAdResource(creative)) return null;


    const setTransformStyle = () => {
      const {
        containerHeight,
        containerWidth
      } = this.props;
      if (containerWidth && containerHeight) {
        const xRatio = (containerWidth - 80) / this.formatDimension(creative.format).width;
        const yRatio = (containerHeight - 80) / this.formatDimension(creative.format).height;
        const minRatio = Math.min(yRatio, xRatio);
        return minRatio >= 1 ? 1 : minRatio;
      }
      return undefined;
    }

    const transformStyle = setTransformStyle();

    return (
      <div style={{ padding: 40, flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {transformStyle && <iframe
          className="renderer"
          src={this.renderIframeCreative(creative)}
          frameBorder="0"
          scrolling="no"
          width={this.formatDimension(creative.format).width}
          height={this.formatDimension(creative.format).height}
          style={{ position: 'absolute', transform: `scale(${transformStyle})` }}
        />}
      </div>
    );
  }
}

export default compose<MapStateProps, {}>(
  connect((state: any) => ({
    initialValue: getFormInitialValues(DISPLAY_CREATIVE_FORM)(
      state,
    ) as DisplayCreativeFormData,
  })),
  Dimensions({ containerStyle: { flexGrow: 1, display: 'flex', justifyContent: 'space-between', flexDirection: 'column' } })
)(PreviewFormSection);
