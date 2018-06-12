import * as React from 'react';
import { WrappedFieldArrayProps } from 'redux-form';
import cuid from 'cuid';
import { split } from 'lodash';
import { RouteComponentProps, withRouter } from 'react-router';
import { Row, Col, Spin } from 'antd';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';

import messages from '../../messages';
import {
  EditAdGroupRouteMatchParam,
  AdFieldModel,
  isDisplayCreativeFormData,
} from '../domain';
import { injectDrawer } from '../../../../../../components/Drawer/index';
import { ReduxFormChangeProps } from '../../../../../../utils/FormHelper';
import {
  DisplayAdResource,
  DisplayAdCreateRequest,
} from '../../../../../../models/creative/CreativeResource';
import { Index } from '../../../../../../utils/index';
import CreativeService from '../../../../../../services/CreativeService';
import { normalizeArrayOfObject } from '../../../../../../utils/Normalizer';
import { DisplayCreativeCreatorProps } from '../../../../../Creative/DisplayAds/Edit/DisplayCreativeCreator';
import { DisplayCreativeCreator } from '../../../../../Creative/DisplayAds/Edit/index';
import CreativeCardSelector, {
  CreativeCardSelectorProps,
} from '../../../../Common/CreativeCardSelector';
import DisplayCreativeFormLoader, {
  DisplayCreativeFormLoaderProps,
} from '../../../../../Creative/DisplayAds/Edit/DisplayCreativeFormLoader';
import {
  DisplayCreativeFormData,
  isDisplayAdResource,
  CustomUploadType,
} from '../../../../../Creative/DisplayAds/Edit/domain';
import { computeDimensionsByRatio } from '../../../../../../utils/ShapeHelper';
import { ButtonStyleless } from '../../../../../../components/index';
import McsIcon from '../../../../../../components/McsIcon';
import AuditStatusRenderer from '../../../../../Creative/DisplayAds/Audit/AuditStatusRenderer';
import CreativeCard from '../../../../Common/CreativeCard';
import FormSection from '../../../../../../components/Form/FormSection';
import EmptyRecords from '../../../../../../components/RelatedRecord/EmptyRecords';
import {
  makeCancelable,
  CancelablePromise,
} from '../../../../../../utils/ApiHelper';
import { InjectedDrawerProps } from '../../../../../../components/Drawer/injectDrawer';

export interface AdFormSectionProps extends ReduxFormChangeProps {}

export interface DisplayAdResourceWithFieldIndex {
  creativeResource: DisplayAdResource | DisplayAdCreateRequest;
  fieldModel: AdFieldModel;
  fieldIndex: number;
}

interface AdsSectionState {
  displayCreativeCacheById: Index<DisplayAdResource>;
  loading: boolean;
  customLoader?: CustomUploadType;
}

type Props = AdFormSectionProps &
  RouteComponentProps<EditAdGroupRouteMatchParam> &
  WrappedFieldArrayProps<AdFieldModel> &
  InjectedIntlProps &
  InjectedDrawerProps;

class AdFormSection extends React.Component<Props, AdsSectionState> {
  cancelablePromise: CancelablePromise<DisplayAdResource[]>;

  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      displayCreativeCacheById: {},
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const loadedCreativeIds = Object.keys(this.state.displayCreativeCacheById);
    const creativeIdsToBeLoaded: string[] = [];
    nextProps.fields.getAll().forEach((field, index) => {
      if (
        !isDisplayCreativeFormData(field.model) &&
        !loadedCreativeIds.includes(field.model.creative_id)
      ) {
        creativeIdsToBeLoaded.push(field.model.creative_id);
      }
    });

    this.cancelablePromise = makeCancelable(
      Promise.all(
        creativeIdsToBeLoaded.map(id =>
          CreativeService.getDisplayAd(id).then(res => res.data),
        ),
      ),
    );

    this.cancelablePromise.promise.then(creatives => {
      this.setState(prevState => ({
        displayCreativeCacheById: {
          ...prevState.displayCreativeCacheById,
          ...normalizeArrayOfObject(creatives, 'id'),
        },
      }));
    });
  }

  componentWillUnmount() {
    if (this.cancelablePromise) this.cancelablePromise.cancel();
  }

  updateAds = (
    creativeFormData: DisplayCreativeFormData,
    fieldKey?: string,
  ) => {
    const { fields, formChange } = this.props;

    const newFields: AdFieldModel[] = [];
    if (fieldKey) {
      fields.getAll().forEach(field => {
        if (fieldKey === field.key) {
          newFields.push({
            key: fieldKey,
            model: creativeFormData,
          });
        } else {
          newFields.push(field);
        }
      });
    } else {
      newFields.push(...fields.getAll());
      newFields.push({
        key: cuid(),
        model: creativeFormData,
      });
    }

    formChange((fields as any).name, newFields);
  };

  openCreativeForm = (field?: AdFieldModel) => {
    const handleOnSubmit = (formData: DisplayCreativeFormData) => {
      this.updateAds(formData, field && field.key);
      this.props.closeNextDrawer();
    };

    if (!field) {
      const additionalProps: DisplayCreativeCreatorProps = {
        onSubmit: handleOnSubmit,
        actionBarButtonText: messages.addNewCreative,
        breadCrumbPaths: [],
        close: () => { this.setState({ customLoader: undefined }); this.props.closeNextDrawer(); },
        avoidCloseAlert: true,
        layout: 'STANDARD'
      };

      this.props.openNextDrawer(DisplayCreativeCreator, { additionalProps });
      return;
    }

    const additionalEditProps: Partial<DisplayCreativeFormLoaderProps> = {
      onSubmit: handleOnSubmit,
      actionBarButtonText: messages.addNewCreative,
      breadCrumbPaths: [],
      close: this.props.closeNextDrawer,
      avoidCloseAlert: true,
      layout: 'STANDARD'
    };
    if (!isDisplayCreativeFormData(field.model)) {
      additionalEditProps.creativeId = field.model.creative_id;
      this.props.openNextDrawer(DisplayCreativeFormLoader, {
        additionalProps: additionalEditProps
      });
      return;
    } else {
      additionalEditProps.initialValues = field.model;
      this.props.openNextDrawer(DisplayCreativeCreator, { additionalProps: (additionalEditProps as DisplayCreativeCreatorProps) });
      return;
    }
  };

  openCreativeCardSelector = () => {
    const { fields } = this.props;

    const creativeIds: string[] = [];
    fields.getAll().forEach(field => {
      if (!isDisplayCreativeFormData(field.model)) {
        creativeIds.push(field.model.creative_id);
      } else if (isDisplayAdResource(field.model.creative)) {
        creativeIds.push(field.model.creative.id);
      }
    });

    const handleSave = (creatives: DisplayAdResource[]) => {
      this.updateExistingAds(creatives);
      this.props.closeNextDrawer();
    };

    const displayAdsSelectorProps: CreativeCardSelectorProps = {
      close: this.props.closeNextDrawer,
      save: handleSave,
      creativeType: 'DISPLAY_AD',
      selectedCreativeIds: creativeIds,
    };

    const options = {
      additionalProps: displayAdsSelectorProps,
    };

    this.props.openNextDrawer<CreativeCardSelectorProps>(
      CreativeCardSelector,
      options,
    );
  };

  updateExistingAds = (creatives: DisplayAdResource[]) => {
    const { fields, formChange } = this.props;
    const creativeIds = creatives.map(c => c.id);

    const keptFields: AdFieldModel[] = [];
    fields.getAll().forEach(field => {
      if (!isDisplayCreativeFormData(field.model)) {
        if (creativeIds.includes(field.model.creative_id)) {
          keptFields.push(field);
        }
      } else if (isDisplayAdResource(field.model.creative)) {
        if (creativeIds.includes(field.model.creative.id)) {
          keptFields.push(field);
        }
      }
    });

    const existingCreativeIds: string[] = [];
    fields.getAll().forEach(field => {
      if (!isDisplayCreativeFormData(field.model)) {
        existingCreativeIds.push(field.model.creative_id);
      }
    });
    const newFields = creatives
      .filter(creative => !existingCreativeIds.includes(creative.id))
      .map(creative => ({
        key: cuid(),
        model: {
          creative_id: creative.id,
        },
      }));

    formChange((fields as any).name, keptFields.concat(newFields));
  };

  getCreativeCardFooter = (data: DisplayAdResourceWithFieldIndex) => {
    const { fields } = this.props;

    const format = split(data.creativeResource.format, 'x');
    const dimensions = computeDimensionsByRatio(
      Number(format[0]),
      Number(format[1]),
    );

    const shapeStyle = {
      backgroundColor: '#e8e8e8',
      border: 'solid 1px #c7c7c7',
      height: `${dimensions.width}em`,
      width: `${dimensions.height}em`,
    };

    const removeField = () => fields.remove(data.fieldIndex);
    const handleEdit = () => {
      const field = fields.get(data.fieldIndex);
      this.openCreativeForm(field);
    };

    const auditStatus = isDisplayAdResource(data.creativeResource)
      ? data.creativeResource.audit_status
      : undefined;

    return (
      <div>
        <Row className="footer">
          <Col className="inline formatWrapper" span={16}>
            <div style={shapeStyle} />
            <div className="dimensions">{data.creativeResource.format}</div>
          </Col>
          <Col className="inline buttons" span={6}>
            <ButtonStyleless onClick={handleEdit}>
              <McsIcon className="button" type="pen" />
            </ButtonStyleless>

            <div className="button-separator" />

            <ButtonStyleless onClick={removeField}>
              <McsIcon className="button" type="delete" />
            </ButtonStyleless>
          </Col>
        </Row>
        <Row className="footer">
          <Col className="inline formatWrapper" span={22}>
            <AuditStatusRenderer auditStatus={auditStatus} />
          </Col>
        </Row>
      </div>
    );
  };

  render() {
    const { intl: { formatMessage }, fields } = this.props;

    const { displayCreativeCacheById } = this.state;

    const allCreatives: DisplayAdResourceWithFieldIndex[] = [];
    if (fields.getAll()) {
      fields.getAll().forEach((field, index) => {
        if (isDisplayCreativeFormData(field.model)) {
          allCreatives.push({
            creativeResource: field.model.creative as DisplayAdCreateRequest,
            fieldIndex: index,
            fieldModel: field,
          });
        } else if (displayCreativeCacheById[field.model.creative_id]) {
          allCreatives.push({
            creativeResource: displayCreativeCacheById[field.model.creative_id],
            fieldIndex: index,
            fieldModel: field,
          });
        }
      });
    }

    const cards = allCreatives.map(data => {
      const getFooter = () => this.getCreativeCardFooter(data);
      return (
        <Col key={data.fieldModel.key} span={6}>
          <div className="ad-group-card">
            <CreativeCard
              key={data.fieldModel.key}
              creative={data.creativeResource}
              renderFooter={getFooter}
            />
          </div>
        </Col>
      );
    });
    return (
      <div>
        <FormSection
          dropdownItems={[
            {
              id: messages.dropdownNew.id,
              message: messages.dropdownNew,
              onClick: this.openCreativeForm,
            },
            {
              id: messages.dropdownAddExisting.id,
              message: messages.dropdownAddExisting,
              onClick: this.openCreativeCardSelector,
            },
          ]}
          subtitle={messages.sectionSubtitleAds}
          title={messages.sectionTitleAds}
        />
        <Spin spinning={this.state.loading}>
          <div className="ad-group-ad-section" style={{ overflow: 'hidden' }}>
            <div className="mcs-table-card content">
              <Row gutter={20}>{cards}</Row>
            </div>

            {!fields.length && (
              <EmptyRecords
                iconType="ads"
                message={formatMessage(messages.contentSectionAdEmptyTitle)}
              />
            )}
          </div>
        </Spin>
      </div>
    );
  }
}

export default compose<Props, AdFormSectionProps>(
  withRouter,
  injectIntl,
  injectDrawer,
)(AdFormSection);
