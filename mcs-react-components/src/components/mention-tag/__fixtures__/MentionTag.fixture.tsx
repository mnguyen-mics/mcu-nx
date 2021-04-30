import * as React from 'react';
import MentionTag, { MentionTagProps } from '../MentionTag';

const props: MentionTagProps = {
  mention: 'ALPHA',
  tooltip: 'tooltip'
};

export default <MentionTag {...props} />;
