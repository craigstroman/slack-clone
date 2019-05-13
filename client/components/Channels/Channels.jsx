import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import AddChannel from '../AddChannel/AddChannel';
import './Channels.scss';

class Channels extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addChannelModal: false,
    };

    this.handleOpenAddChannel = this.handleOpenAddChannel.bind(this);
  }

  handleOpenAddChannel = () => {
    this.setState({ addChannelModal: true });
  }

  handleCloseAddChannel = () => {
    this.setState({ addChannelModal: false });
  }

  render() {
    const { addChannelModal } = this.state;
    const {
      isOwner, channels, activeEl, selectItem, teamId,
    } = this.props;

    return (
      <Fragment>
        <Fragment>
          <div className="channels">
            <div className="sidebar-heading">
              <h5>Channels</h5>
              {isOwner && (
                <Button
                  type="button"
                  className="sidebar-heading__action"
                  onClick={() => this.handleOpenAddChannel()}
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
        </Fragment>
        <Fragment>
          <AddChannel
            isOpen={addChannelModal}
            teamId={teamId}
            handleCloseAddChannel={() => this.handleCloseAddChannel()}
          />
        </Fragment>
      </Fragment>
    );
  }
}


Channels.defaultProps = {
  isOwner: false,
  channels: [],
  activeEl: '',
  teamId: null,
  selectItem: () => {},
};

Channels.propTypes = {
  isOwner: PropTypes.bool,
  channels: PropTypes.array,
  activeEl: PropTypes.string,
  teamId: PropTypes.number,
  selectItem: PropTypes.func,
};

export default Channels;
