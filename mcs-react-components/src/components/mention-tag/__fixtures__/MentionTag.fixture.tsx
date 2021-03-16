
    import * as React from 'react';
    import MentionTag, { MentionTagProps } from '../MentionTag';

    const props: MentionTagProps = {
      mention: 'ALPHA',
      tooltip: 'tooltip'
    };

    const component = (_props: MentionTagProps) => <MentionTag {..._props} />;

    component.displayName = "MentionTag";

    export default {
      component,
      props,
    };
