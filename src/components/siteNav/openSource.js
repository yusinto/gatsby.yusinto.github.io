import React from 'react'
import styled from 'styled-components'
import SvgIcon from '../svg';
import {GithubRepoRoot, RepoList} from '../../constants';

const List = styled.ul`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-left: 30px;
  
  & a {
    color: black;
  }
`;
const ListItem = styled.li`
  display: flex;
  flex-direction: row;
  margin: 5px 5px;
  align-items: center;
`;
const StyledLink = styled.a`
  display: flex;
  align-items: center;
  &:hover {
    opacity: 0.7;
  }
`;
const RepoContainer = styled.div`
  display: flex;
  flex-direction: column;
`
const Repo = styled.h2`
  margin: 0;
  margin-right: 10px;
  color: #6772e5;
  font-size: 14px;
  line-height: 22px;
  font-weight: 600;
  letter-spacing: .025em;
`;
const Description = styled.div`
  font-size: 13px;
  opacity: 0.7;
`
const StarContainer = styled.div`
  display: flex;
  align-items: center;
`
const Count = styled.span`
  color: black;
  font-style: italic;
  font-size: 14px;
  opacity: 0.6;
  margin: 0;
  margin-left: 4px;
  padding: 0;
  vertical-align: top;
`
export default () => (
  <List>
    {
      RepoList.map((r, i) =>
        <ListItem key={r.name}>
          <StyledLink href={`${GithubRepoRoot}${r.name}`} target="_blank" rel="noopener noreferrer">
            <RepoContainer>
              <StarContainer>
                <Repo>{r.name}</Repo>
                <SvgIcon fill="grey" width="12" type="star"/>
                <Count>{r.stars}</Count>
              </StarContainer>
              <Description>{r.description}</Description>
            </RepoContainer>
          </StyledLink>
        </ListItem>
      )
    }
    <ListItem key="all-repos">
      <StyledLink href={`${GithubRepoRoot}`} target="_blank" rel="noopener noreferrer">
        <RepoContainer>
          <StarContainer>
            <Repo>All Repos</Repo>
          </StarContainer>
        </RepoContainer>
      </StyledLink>
    </ListItem>
  </List>
);
