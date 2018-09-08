import React from 'react'
import styled from 'styled-components'
import SvgIcon from '../svg'
import {SocialList} from '../../../src/constants'

const List = styled.ul`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-left: 30px;
`;
const ListItem = styled.li`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  align-items: center;
`;
const Heading = styled.div`
  margin: 0;
  color: #6772e5;
  font-size: 14px;
  line-height: 22px;
  font-weight: 600;
  letter-spacing: .025em;
  margin-left: 10px;
`;
const StyledLink = styled.a`
  display: flex;
  align-items: center;
  &:hover {
    opacity: 0.7;
  }
`;
const iconFill = 'grey'
const iconWidth = 16
export default () => {
  return (
    <List>
      {
        SocialList.map(({type, url}) =>
          <ListItem key={type}>
            {
              type === 'email' ?
                <StyledLink href={url}>
                  <SvgIcon fill={iconFill} width={iconWidth} type={type}/>
                  <Heading>{type}</Heading>
                </StyledLink>
                :
                <StyledLink href={url} target="_blank" rel="noopener noreferrer">
                  <SvgIcon fill={iconFill} width={iconWidth} type={type}/>
                  <Heading>{type}</Heading>
                </StyledLink>
            }
          </ListItem>
        )
      }
    </List>
  );
};