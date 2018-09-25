import * as React from 'react';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import { Layout, Row } from 'antd';
import { FormLayoutActionbar } from '../../../../components/Layout';
import { FormLayoutActionbarProps } from '../../../../components/Layout/FormLayoutActionbar';
import messages from '../../messages';
import { FormTitle } from '../../../../components/Form';
import { MenuPresentational } from '../../../../components/FormMenu';
import { OfferType } from './CreateOfferPage';
import { Path } from '../../../../components/ActionBar';

const { Content } = Layout;

export interface OfferTypeSelectorProps {
    onSelect: (offerType: OfferType) => void;
    close: () => void;
    breadCrumbPaths: Path[];
};

type Props = OfferTypeSelectorProps &
    InjectedIntlProps &
    RouteComponentProps<{}>;


class OfferTypeSelector extends React.Component<Props> {

    render() {
        const {
            onSelect,
            breadCrumbPaths,
            intl: { formatMessage },
        } = this.props;

        const onTypeSelect = (offerType: OfferType) => () => {
            onSelect(offerType);
        };

        const actionBarProps: FormLayoutActionbarProps = {
            formId: 'typePickerForm',
            onClose: this.props.close,
            paths: breadCrumbPaths,
        };

        return (
            <Layout>
                <div className="edit-layout ant-layout">
                    <FormLayoutActionbar {...actionBarProps} />
                    <Layout>
                        <Content className="mcs-content-container mcs-form-container text-center">
                            <FormTitle
                                title={messages.offerTypePickerTitle}
                                subtitle={messages.offerTypePickerSubTitle}
                            />

                            <Row style={{ width: '650px', display: 'inline-block' }}>
                                <Row className="menu">
                                    <div className="presentation">
                                        <MenuPresentational
                                            title={formatMessage(messages.automaticOfferType)}
                                            type="image"
                                            select={onTypeSelect(OfferType.Automatic)}
                                        />
                                        <div className="separator">
                                            <FormattedMessage {...messages.offerTypeOr} />
                                        </div>
                                        <MenuPresentational
                                            title={formatMessage(messages.manualOfferType)}
                                            type="image"
                                            select={onTypeSelect(OfferType.Manual)}
                                        />
                                    </div>
                                </Row>
                            </Row>
                        </Content>
                    </Layout>
                </div>
            </Layout>
        );
    }
}

export default compose<Props, OfferTypeSelectorProps>(
    withRouter,
    injectIntl,
)(OfferTypeSelector);