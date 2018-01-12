import * as React from 'react';
import { Upload, Icon, message, Button } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import FormFieldWrapper, { FormFieldWrapperProps } from '../../../../../components/Form/FormFieldWrapper';
import AssetsFilesService from '../../../../../services/Library/AssetsFilesService';
import * as actions from '../../../../../state/Notifications/actions'
import { DrawableContentProps } from '../../../../../components/Drawer'

import { WrappedFieldProps } from 'redux-form';
import { TooltipProps } from 'antd/lib/tooltip';
import { FormItemProps } from 'antd/lib/form/FormItem';
import { UploadProps, UploadFile } from 'antd/lib/upload/interface';

export interface QuickAssetUploadProps extends FormFieldWrapperProps, DrawableContentProps {
  formItemProps?: FormItemProps;
  inputProps?: UploadProps & React.ButtonHTMLAttributes<HTMLButtonElement>;
  helpToolTipProps?: TooltipProps;
}

export interface QuickAssetUploadState {
  imageUrl: string;
  loading: boolean;
}

const acceptedFormat = 'image/*'

type OuterProps = QuickAssetUploadProps & WrappedFieldProps & RouteComponentProps<{ organisationId: string }>;

interface InnerProps {
  notifyError: (err: any) => void;
}

type JoinedProps = OuterProps & InnerProps;

class QuickAssetUpload extends React.Component<
  JoinedProps,
  QuickAssetUploadState
> {

  constructor(props: JoinedProps) {
    super(props);
    this.state = {
      imageUrl: this.props.input.value,
      loading: false
    }
  }

  beforeUpload = (file: UploadFile) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false;
    }
    const formData = new FormData(); /* global FormData */
    formData.append('file', file as any, file.name);
    this.setState({ loading: true }, () => {
      AssetsFilesService.uploadAssetsFile(this.props.match.params.organisationId, formData)
      .then(item => item.data)
      .then(item => {
        const imageUrl = `https://assets.mediarithmics.com${item.file_path}`;
        this.setState({ loading: false, imageUrl: imageUrl })
        this.props.input.onChange(imageUrl);
        return false;
      })
      .catch(e => {
        this.props.notifyError(e)
        return false;
      })
      return false;
    });
    return false;
  }

  addExistingAsset = () => {
    // const props = {
    //   size: 'large',
    //   modal: false,
    // }
    // this.props.openNextDrawer()
    // TODO
  }


  render() {

    let validateStatus = 'success' as 'success' | 'warning' | 'error' | 'validating';
    if (this.props.meta.touched && this.props.meta.invalid) validateStatus = 'error';
    if (this.props.meta.touched && this.props.meta.warning) validateStatus = 'warning';
    const uploadButton = (
      <div className="m-r-20 m-t-10">
        <Button>
          <Icon type={this.state.loading ? 'loading' : 'plus'} />
          Upload
        </Button>
      </div>
    );

    // TODO WHEN NEW TABLESELECTOR IS CREATED
    // const addExistingButton = (
    //   <Button className="m-t-10" onClick={this.addExistingAsset}>Add Existing</Button>
    // )

    const imageUrl = this.state.imageUrl;

    return (
      <FormFieldWrapper
        help={this.props.meta.touched && (this.props.meta.warning || this.props.meta.error)}
        helpToolTipProps={this.props.helpToolTipProps}
        validateStatus={validateStatus}
        {...this.props.formItemProps}
      >
        <div style={{ maxWidth: '100%', marginBottom: 10 }}>
          {this.state.loading ? <Icon type="loading" /> : <img src={imageUrl} alt="" style={{ maxWidth: '100%' }} />}
        </div>
        {(!this.state.loading) && <Upload
          {...this.props.input}
          {...this.props.inputProps}
          showUploadList={false}
          action="/"
          beforeUpload={this.beforeUpload}
          accept={acceptedFormat}
        >
          {uploadButton}
        </Upload>}
        {/* {(!this.state.loading) && addExistingButton} */}
      </FormFieldWrapper>
    );
  }
}

export default compose<InnerProps, QuickAssetUploadProps & WrappedFieldProps>(
  withRouter, 
  connect(
    undefined,
    { notifyError: actions.notifyError },
  )
)(QuickAssetUpload)
