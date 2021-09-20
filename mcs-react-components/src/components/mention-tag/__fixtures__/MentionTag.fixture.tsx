import * as React from 'react';
import MentionTag, { MentionTagProps } from '../MentionTag';

const props: MentionTagProps = {
  mention: 'ALPHA',
  tooltip: 'tooltip',
  customContent: 'THIS IS A NEW FEATURE',
};

export default <MentionTag {...props} />;
