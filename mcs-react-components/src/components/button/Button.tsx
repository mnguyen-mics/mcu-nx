import * as React from 'react';
import { Omit } from '../../utils/Types';

export interface ButtonProps {
  onClick?: any;
}

const Button: React.SFC<
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> & ButtonProps
> = props => {
  const { children, className, onClick, ...rest } = props;

  const handleOnClick = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClick();
  };

  const { disabled } = props;

  const style: React.CSSProperties = {
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  return (
    <button
      type='button'
      style={style}
      className={`mcs-button ${className ? className : ''}`}
      onClick={disabled ? undefined : handleOnClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
