import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import './Channels.scss';

const Channels = (props) => {
  const {
    isOwner, channels, activeEl, addChannel, selectItem,
  } = props;

  return (
    <div className="channels">
      <div className="sidebar-heading">
        <h5>Channels</h5>
        {isOwner && (
          <Button
            type="button"
            className="sidebar-heading__action"
            onClick={() => addChannel()}
          >
            <FontAwesomeIcon icon={faPlusCircle} />
          </Button>
        )}
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
              itemType="channel"
              name={el.name}
              onClick={e => selectItem(e)}
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
  isOwner: false,
  channels: [],
  activeEl: '',
  addChannel: () => {},
  selectItem: () => {},
};

Channels.propTypes = {
  isOwner: PropTypes.bool,
  channels: PropTypes.array,
  activeEl: PropTypes.string,
  addChannel: PropTypes.func,
  selectItem: PropTypes.func,
};

export default Channels;
