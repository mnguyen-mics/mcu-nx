import * as React from 'react';
import { useIntl } from 'react-intl';
import messages from '../messages';
import { Button } from 'antd';

export const PageNotFound = () => {
  const intl = useIntl();

  return (
    <div className='mcs-pageNotFound'>
      <div className='pnf-text'>
        {intl.formatMessage(messages.notFound)} <a>🙄</a>
      </div>

      <img
        alt='mics-logo'
        className='pnf-img centered'
        src={'/react/src/assets/images/pionus_b.png'}
      />
      <div className='flashlight delay_'></div>

      <div className='pnf-parrot-text'>
        {intl.formatMessage(messages.lostParrot)} <a> ❤️ </a>
      </div>
      <Button className='pnf-btn' href='/'>
        <div>{intl.formatMessage(messages.redirectHome)}</div>
      </Button>
    </div>
  );
};
