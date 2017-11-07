import * as React from 'react';

const ButtonStyleless: React.SFC<React.ButtonHTMLAttributes<HTMLButtonElement>> = props => {

  const { children, className, ...rest } = props;
  return (
    <button className={`button-styleless ${props.className}`} {...rest}>
      {props.children}
    </button>
  );
};

ButtonStyleless.defaultProps = {
  className: '',
};

export default ButtonStyleless;
