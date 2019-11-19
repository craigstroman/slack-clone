import React from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider } from 'styled-components';
import { Button } from '@material-ui/core';
import theme from '../../shared/themes';
import clearFix from '../../shared/themes/mixins';

const Wrapper = styled.div`
  color: ${props => props.theme.colors.white};
`;

const TeamsList = styled.ul`
  list-style: none;
  padding-left: 0px;
  width: 100%;
  li {
    display: flex;
    margin-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
    &:first-child {
      margin-top: 10px;
    }
    button {
      background-color: #676066;
      border-radius: 11px;
      cursor: pointer;
      color: ${props => props.theme.colors.white};
      font-size: 24px;
      height: 50px;
      margin-bottom: 10px;
      margin-left: auto;
      margin-right: auto;
      width: 50px;
      &:hover,
      &:focus,
      &:active,
      &:visited {
        background-color: #676066;
        border-style: solid;
        border-width: thick;
        border-color: #767676;
        color: ${props => props.theme.colors.white};
        text-decoration: none;
      }
    }
  }
`;

class TeamSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = e => {
    const { handleChangeTeam, history } = this.props;
    const { currentTarget } = e;

    const teamName = currentTarget.getAttribute('team');
    const teamId = currentTarget.getAttribute('teamid');
    const teamUUID = currentTarget.getAttribute('teamuuid');

    history.push(`/dashboard/view/team/${teamUUID}`);

    handleChangeTeam(teamName, teamId, teamUUID);
  };

  render() {
    const { userTeams } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <Wrapper>
          <TeamsList>
            {userTeams.map(el => (
              <li id={`teams-${el.id}`} key={`teams-${el.uuid}`} type={el.type}>
                <Button
                  type="button"
                  className="team-item"
                  title={el.name}
                  team={el.name}
                  teamid={el.id}
                  teamuuid={el.uuid}
                  onClick={e => this.handleClick(e)}
                >
                  {el.letter}
                </Button>
              </li>
            ))}
          </TeamsList>
        </Wrapper>
      </ThemeProvider>
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
