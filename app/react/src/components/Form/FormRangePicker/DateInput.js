import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';

function DateInput({ input, ...otherProps }) {

  const { value, ...rest } = input;
  const correctedInput = (value === '' ? rest : { ...rest, value });

  return (
    <div>
      <DatePicker
        {...correctedInput}
        {...otherProps}
        allowClear={false}
        id={input.name}
      />
    </div>
  );
}

DateInput.defaultProps = {
  format: 'DD/MM/YYYY',
  placeholder: '',
  showTime: null,
};

DateInput.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,

  format: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  showTime: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
};

export default DateInput;
