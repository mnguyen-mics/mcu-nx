import * as React from 'react';

export interface ErrorBoundaryProps {
  errorMessage: string;
  onError: (error: any, info: any) => void;
}

interface State {
  error?: any;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      error: undefined,
    };
  }

  componentDidCatch(error: any, info: any) {
    const { onError } = this.props;
    this.setState({ error: error });
    onError(error, info);
  }

  render() {
    const { errorMessage, children } = this.props;
    const { error } = this.state;

    if (error) {
      return <div className='ant-layout'>{errorMessage}</div>;
    } else {
      return children;
    }
  }
}
export default ErrorBoundary;
