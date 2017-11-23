import React from 'react';

export interface ListProps {
  className?: string;
}

const List: React.SFC<ListProps> = props => {

  return (
    <div className={`list-ul ${props.className}`}>
      <ul>{props.children}</ul>
    </div>
  );
};

export default List;
