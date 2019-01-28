import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import './Channels.scss';

const Channels = (props) => {
  const {
    activeEl, channels, handleSelectItem, handleAddChannel,
  } = props;

  return (
    <div className="channels">
      <div className="sidebar-heading">
        <h5>Channels</h5>
        <Button
          type="button"
          className="sidebar-heading__action"
          onClick={handleAddChannel}
        >
          <FontAwesomeIcon icon={faPlusCircle} />
        </Button>
      </div>
      <ul className="channels-list">
        {channels.map(el => (
          <li
            className={
              activeEl === `channel-${el.id}` ? 'channels-list__item selected' : 'channels-list__item'
            }
            id={`channel-${el.id}`}
            key={`channel-${el.id}`}
          >
            <Button
              type="button"
              className="channel-item"
              onClick={handleSelectItem}
            >
              #&nbsp;
              {el.name}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

Channels.defaultProps = {
  activeEl: '',
  channels: [],
  handleSelectItem: () => {},
  handleAddChannel: () => {},
};

Channels.propTypes = {
  activeEl: PropTypes.string,
  channels: PropTypes.array,
  handleSelectItem: PropTypes.func,
  handleAddChannel: PropTypes.func,
};

export default Channels;
