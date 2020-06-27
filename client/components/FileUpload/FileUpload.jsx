import React from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';

const FileUpload = ({ children, disableClick }) => {
  console.log('FileUpload: ');
  console.log('children: ', children);
  return (
    <Dropzone className="ignore" onDrop={files => console.log(files)} disableClick={disableClick}>
      {children}
    </Dropzone>
  );
};

FileUpload.defaultProps = {
  children: {},
  disableClick: '',
};

FileUpload.propTypes = {
  children: PropTypes.object,
  disableClick: PropTypes.string,
};

export default FileUpload;
