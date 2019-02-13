import React from 'react';
import PropTypes from 'prop-types';
import './Input.scss';

const Input = (props) => {
  const { itemName, itemType } = props;
  let placeholder = '';

  if (itemType === 'channel') {
    placeholder = `Message #${itemName}`;
  } else if (itemType === 'user') {
    placeholder = `Message ${itemName}`;
  }

  return (
    <div className="input">
      <div className="form-group">
        <div className="col-md-12">
          <input
            type="text"
            name="message"
            className="form-control"
            placeholder={placeholder}
          />
        </div>
      </div>
    </div>
  );
};

Input.defaultProps = {
  itemName: '',
  itemType: '',
};

Input.propTypes = {
  itemName: PropTypes.string,
  itemType: PropTypes.string,
};

export default Input;
