import * as React from 'react';
import logoUrl from '../assets/images/logo-mediarithmics.png';
// import {LayoutMode} from '../Layout';

export interface LogoProps {
    mode: string
}

class Logo extends React.Component<LogoProps> {

    render() {
        const {
            mode,
        } = this.props;

        return (
            <div className="mcs-logo-placeholder">
                {mode === 'inline' &&
                <div className="mcs-logo">
                    <img alt="logo" src={logoUrl} />
                </div>
                }
            </div>
        );
    }
}

export default Logo;
