import * as React from 'react';
import LazyLoad from 'react-lazyload';

interface Props {
  child: React.ReactElement;
}

export class McsLazyLoad extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { child } = this.props;
    return (
      <LazyLoad
        overflow={true}
        resize={true}
        scroll={true}
        offset={50}
        height={350}
        style={{ height: '100%' }} // component lib doesn't handle classname props so we should keep inline style
      >
        {child}
      </LazyLoad>
    );
  }
}
