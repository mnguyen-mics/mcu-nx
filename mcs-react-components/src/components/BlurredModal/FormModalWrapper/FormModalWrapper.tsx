import * as React from 'react';
import ButtonStyleless from '../../ButtonStyless';
import McsIcon from '../../Icon';


export interface FormModalWrapperProps {
  formId: string;
  footer?: React.ReactNode;
  onClose: React.MouseEventHandler<HTMLSpanElement>;
}


/* Redux-form allows us to use submit buttons removed from their normal form components.
 * This component includes a remote submit button.
 * See example at http://redux-form.com/6.8.0/examples/remoteSubmit/
 */
const FormModalWrapper: React.SFC<FormModalWrapperProps> = props => {

  const {
    footer,
    onClose,
    children
  } = props;


  return (
    <div className="form-modal">
      <ButtonStyleless className="form-close" onClick={onClose}><McsIcon type="close-big" /></ButtonStyleless>
      <div className="form-modal-container mcs-content-container mcs-form-container">
        {children}
        <div className="submit-button">
          {footer}
        </div>
      </div>
    </div>
  );
};

export default FormModalWrapper;
