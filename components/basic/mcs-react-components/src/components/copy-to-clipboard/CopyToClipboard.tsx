import * as React from 'react';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';

export interface CopyToClipboardProps {
  value: string;
}

export default function CopyToClipboard(props: CopyToClipboardProps) {
  const [clicked, setClicked] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setClicked(false);
    }, 1000);
  }, [clicked]);

  const onClick = () => {
    navigator.clipboard.writeText(props.value);
    setClicked(true);
  };

  return clicked ? (
    <CheckOutlined className='mcs-copyToClipboard' />
  ) : (
    <CopyOutlined className='mcs-copyToClipboard' onClick={onClick} />
  );
}
