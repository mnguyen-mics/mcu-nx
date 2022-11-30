import * as React from 'react';

export interface ErrorProps {
  className?: string;
  message: string;
  style?: React.CSSProperties;
}

const Error: React.SFC<ErrorProps> = ({ message, style, className }) => {
  return (
    <div className={`mcs-error ${className ? className : ''}`} style={style}>
      <p>{message}</p>
    </div>
  );
};

export default Error;
