import * as React from 'react';
import { TYPES } from '../../../constants/types';
import { QueryDocument as GraphdbQueryDocument } from '../../../models/datamart/graphdb/QueryDocument';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { compose } from 'recompose';
import { Button, Alert } from 'antd';
import { injectDrawer } from '../../../components/Drawer';
import { InjectedDrawerProps } from '../../../components/Drawer/injectDrawer';
import JSONQLBuilderContainer, { JSONQLBuilderContainerProps } from './JSONQLBuilderContainer';
import { messages } from './messages';
import { Actionbar, McsIcon } from '@mediarithmics-private/mcs-components-library';
import { IAudienceBuilderQueryService } from '../../Audience/AudienceBuilder/AudienceBuilderQueryService';
import { lazyInject } from '../../../config/inversify.config';
import AudienceBuilderContainer, {
  AudienceBuilderContainerProps,
} from '../../Audience/AudienceBuilder/AudienceBuilderContainer';
import {
  AudienceBuilderQueryDocument,
  AudienceBuilderResource,
} from '../../../models/audienceBuilder/AudienceBuilderResource';

export type JSONQLPreviewContext = 'GOALS' | 'AUTOMATION_BUILDER';
export interface JSONQLPreviewProps {
  value?: string | void;
  queryHasChanged?: boolean;
  onChange?: (e: string) => void;
  datamartId: string;
  context: JSONQLPreviewContext;
  isTrigger?: boolean;
  isEdge?: boolean;
  segmentEditor?: string;
  audienceBuilder?: AudienceBuilderResource;
}

type Props = JSONQLPreviewProps & InjectedIntlProps & InjectedDrawerProps;

class JSONQLPreview extends React.Component<Props> {
  @lazyInject(TYPES.IAudienceBuilderQueryService)
  private _audienceBuilderQueryService: IAudienceBuilderQueryService;

  openEditor = () => {
    const { intl, value, segmentEditor, audienceBuilder } = this.props;

    const createActionBar = (onSave: () => void, onClose: () => void, query: any) => {
      return (
        <Actionbar
          edition={true}
          pathItems={[
            intl.formatMessage({
              id: 'jsonql.querytool.query.edit',
              defaultMessage: 'Edit Your Query',
            }),
          ]}
        >
          <Button
            disabled={!query}
            className='mcs-primary mcs-actionBar_updateQueryButton'
            type='primary'
            onClick={onSave}
          >
            <FormattedMessage
              id='queryTool.jsonql.querytool.query.edit.update'
              defaultMessage='Update'
            />
          </Button>
          <McsIcon
            type='close'
            className='close-icon'
            style={{ cursor: 'pointer' }}
            onClick={onClose}
          />
        </Actionbar>
      );
    };

    if (segmentEditor === 'AUDIENCE_BUILDER') {
      const actionbar = (query: AudienceBuilderQueryDocument, datamartId: string) => {
        const onSave = () => {
          if (this.props.onChange) this.props.onChange(JSON.stringify(query));
          this.props.closeNextDrawer();
        };
        const onClose = () => this.props.closeNextDrawer();
        return createActionBar(onSave, onClose, query);
      };

      return (
        audienceBuilder &&
        this.props.openNextDrawer<AudienceBuilderContainerProps>(AudienceBuilderContainer, {
          additionalProps: {
            renderActionBar: actionbar,
            initialValues: value
              ? this._audienceBuilderQueryService.generateAudienceBuilderFormData(
                  JSON.parse(value).where.expressions,
                )
              : undefined,
            audienceBuilder: audienceBuilder,
          },
        })
      );
    } else {
      const actionbar = (query: GraphdbQueryDocument, datamartId: string) => {
        const onSave = () => {
          if (this.props.onChange) this.props.onChange(JSON.stringify(query));
          this.props.closeNextDrawer();
        };
        const onClose = () => this.props.closeNextDrawer();
        return createActionBar(onSave, onClose, query);
      };

      this.props.openNextDrawer<JSONQLBuilderContainerProps>(JSONQLBuilderContainer, {
        additionalProps: {
          datamartId: this.props.datamartId,
          renderActionBar: actionbar,
          editionLayout: true,
          queryDocument: value ? JSON.parse(value) : undefined,
          isTrigger: this.props.isTrigger,
          isEdge: this.props.isEdge,
        },
      });
    }
  };

  render() {
    const { context, queryHasChanged, intl } = this.props;

    return context === 'AUTOMATION_BUILDER' ? (
      <div onClick={this.openEditor} className='boolean-menu-item'>
        {this.props.intl.formatMessage({
          id: 'jsonql.button.query.edit',
          defaultMessage: 'Edit Query',
        })}
      </div>
    ) : (
      <div className='text-center m-t-20'>
        {queryHasChanged && (
          <Alert
            message={
              <div>
                <McsIcon type={'warning'} />
                {intl.formatMessage(messages.queryHasChanged)}
              </div>
            }
            type={'warning'}
          />
        )}
        <br />
        <Button className='mcs-editAudienceSegmentForm_editQueryButton' onClick={this.openEditor}>
          {this.props.intl.formatMessage({
            id: 'jsonql.button.query.edit',
            defaultMessage: 'Edit Query',
          })}
        </Button>
      </div>
    );
  }
}

export default compose<Props, JSONQLPreviewProps>(injectIntl, injectDrawer)(JSONQLPreview);
