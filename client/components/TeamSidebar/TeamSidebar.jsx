import React from 'react';
import PropTypes from 'prop-types';
import './TeamSidebar.scss';

class TeamSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = (e) => {
    const { handleChangeTeam, history } = this.props;

    const teamName = e.target.getAttribute('team');
    const teamId = e.target.getAttribute('teamid');

    history.push(`/dashboard/view/team/${teamId}`);

    handleChangeTeam(teamName, teamId);
  }

  render() {
    const { userTeams } = this.props;

    return (
      <div className="teams-sidebar-container">
        <section>
          <div className="teams-sidebar__content">
            <ul className="teams-list">
              {userTeams.map(el => (
                <li
                  className="teams-list__item"
                  id={`teams-${el.id}`}
                  key={`teams-${el.id}`}
                  type={el.type}
                >
                  <button
                    type="button"
                    className="team-item"
                    title={el.name}
                    team={el.name}
                    teamid={el.id}
                    onClick={e => this.handleClick(e)}
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
  history: {},
  userTeams: [],
  handleChangeTeam: () => {},
};

TeamSidebar.propTypes = {
  history: PropTypes.object,
  userTeams: PropTypes.array,
  handleChangeTeam: PropTypes.func,
};

export default TeamSidebar;
