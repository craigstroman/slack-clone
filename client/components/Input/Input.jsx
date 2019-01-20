import React from 'react';
import './Input.scss';

const Input = () => (
  <div className="input">
    <div className="form-group">
      <div className="col-md-12">
        <input type="text" name="message" className="form-control" />
      </div>
    </div>
  </div>
);

export default Input;
