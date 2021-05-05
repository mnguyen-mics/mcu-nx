import * as React from 'react';
import Button from '../button';

class BuggyButton extends React.Component<{}, { releaseBugs: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      releaseBugs: false,
    };
  }
  handleClick = () => {
    this.setState({
      releaseBugs: true,
    });
  };
  render() {
    if (this.state.releaseBugs) {
      throw new Error('Error triggered.');
    }
    return <Button onClick={this.handleClick}>{'Click to trigger error.'}</Button>;
  }
}

export default BuggyButton;
