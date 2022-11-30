import { MessageDescriptor } from 'react-intl';

export interface Notification {
  level: string;
  uid: string;
  error: {
    error: string;
    error_id: string;
    message?: string;
  };
  newVersion: boolean;
  onClose: () => void;
  intlMessage: MessageDescriptor;
  intlDescription: MessageDescriptor;
}
