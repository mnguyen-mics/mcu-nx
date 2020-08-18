import * as React from 'react';

export interface ErrorProps {
  message: string;
  style?: React.CSSProperties;
}

const Error: React.SFC<ErrorProps> = ({ message, style }) => {
  return (
    <div className="mcs-error" style={style}>
      <p>{message}</p>
    </div>
  );
};

export default Error;
