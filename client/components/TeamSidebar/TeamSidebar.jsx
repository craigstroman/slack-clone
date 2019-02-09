import React from 'react';
import PropTypes from 'prop-types';
import './TeamSidebar.scss';

class TeamSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    const { handleTeamChange } = this.props;

    const teamName = e.target.getAttribute('team');

    handleTeamChange(teamName);
  }

  render() {
    const { teams } = this.props;

    return (
      <div className="teams-sidebar-container">
        <section>
          <div className="teams-sidebar__content">
            <ul className="teams-list">
              {teams.map(el => (
                <li
                  className="teams-list__item"
                  id={`teams-${el.id}`}
                  key={`teams-${el.id}`}
                >
                  <button
                    type="button"
                    className="team-item"
                    title={el.name}
                    team={el.name}
                    onClick={this.handleClick}
                  >
                    { el.letter }
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    );
  }
}

TeamSidebar.defaultProps = {
  teams: [],
  handleTeamChange: () => {},
};

TeamSidebar.propTypes = {
  teams: PropTypes.array,
  handleTeamChange: PropTypes.func,
};

export default TeamSidebar;
