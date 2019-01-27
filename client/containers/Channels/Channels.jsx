import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import './Channels.scss';

const Channels = (props) => {
  const { activeEl, channels, handleClick } = props;

  return (
    <div className="channels">
      <div className="sidebar-heading">
        <h5>Channels</h5>
        <Button
          type="button"
          className="sidebar-heading__action"
          onClick={handleClick}
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
              onClick={handleClick}
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
  handleClick: () => {},
  channels: [],
};

Channels.propTypes = {
  activeEl: PropTypes.string,
  handleClick: PropTypes.func,
  channels: PropTypes.array,
};

export default Channels;
