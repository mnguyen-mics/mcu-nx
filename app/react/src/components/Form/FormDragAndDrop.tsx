import * as React from 'react';
import { Upload, message } from 'antd';

import { FormItemProps } from 'antd/lib/form/FormItem';
import { UploadProps, UploadFile } from 'antd/lib/upload/interface';
import { WrappedFieldProps } from 'redux-form';
import { TooltipProps } from 'antd/lib/tooltip';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';

export interface FormDragAndDropProps {
  formItemProps?: FormItemProps;
  inputProps?: UploadProps;
  helpToolTipProps?: TooltipProps;
  maxFileSize: number;
  uploadTitle: FormattedMessage.MessageDescriptor;
  uploadMessage: FormattedMessage.MessageDescriptor;
  uploadError: FormattedMessage.MessageDescriptor;
}

const Dragger = Upload.Dragger;

type JoinedProps = FormDragAndDropProps & WrappedFieldProps & InjectedIntlProps;

class FormDragAndDrop extends React.Component<JoinedProps> {

  render() {
    const {
      intl: { formatMessage },
      uploadTitle,
      uploadMessage,
      maxFileSize,
      uploadError,
    } = this.props;

    const checkIfSizeOK = (file: UploadFile) => {
      const isSizeOK = file.size < maxFileSize;
      if (!isSizeOK) {
        message.error(`${file.name} ${formatMessage(uploadError)}`, 2);
      }
    };

    const filterFileList = (fileList: UploadFile[]) => {
      return fileList.filter(item => {
        return item.size < maxFileSize;
      });
    };

    const builProps = () => {
      const { input } = this.props;
      return {
        name: 'file',
        multiple: true,
        action: '/',
        accept: '.csv,.tsv',
        beforeUpload: (file: UploadFile, fileList: UploadFile[]) => {
          checkIfSizeOK(file);
          const newFileList = [
            ...input.value,
            ...filterFileList(fileList),
          ];
          input.onChange(newFileList);
          return false;
        },
        fileList: input.value,
        onRemove: (file: UploadFile) => {
          input.onChange(input.value.filter((item: UploadFile) => item.uid !== file.uid));
        },
      };
    };

    return (
      <Dragger {...builProps()}>
        <p className="ant-upload-text">{formatMessage(uploadTitle)}</p>
        <p className="ant-upload-hint">{formatMessage(uploadMessage)}</p>
      </Dragger>
    );
  }
}

export default injectIntl(FormDragAndDrop);
