import * as React from 'react';
import { useIntl } from 'react-intl';
import messages from '../messages';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';

export const PageNotFound = () => {
    const intl = useIntl();
    const history = useHistory();

    const redirect = () => {
        history.push('/');
    }

    return (

        <div className='page-not-found'>

            <div className='pnf-text'>{intl.formatMessage(messages.notFound)} <a>🙄</a></div>

            
            <img
                alt='mics-logo'
                className='pnf-img centered'
                src={'/react/src/assets/images/pionus_b.png'}
            />
            <div className='flashlight delay_'></div>

            <div className='pnf-parrot-text'>{intl.formatMessage(messages.lostParrot)} <a> ❤️ </a></div>
            <Button className='pnf-btn' onClick={redirect}>
                {intl.formatMessage(messages.redirectHome)}
            </Button>

        </div>
    )
} 
