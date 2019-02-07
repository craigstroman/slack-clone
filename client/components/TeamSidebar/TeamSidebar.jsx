import React from 'react';
import './TeamSidebar.scss';

class TeamSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.switchTeam = this.switchTeam.bind(this);
  }

  switchTeam() {
    console.log('switchTeam: ');
    console.log('this: ', this);
  }

  render() {
    return (
      <div className="teams-sidebar-container">
        <section>
          <div className="teams-sidebar__content">
            <ul className="teams-list">
              <li className="teams-list__item">
                T
              </li>
            </ul>
          </div>
        </section>
      </div>
    );
  }
}

export default TeamSidebar;
