import React from 'react';
import styled from 'styled-components';
import {Link} from 'gatsby';
import SvgIcon from '../svg'

const ListContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const List = styled.ul`
  color: lightslategray;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  list-style-type: none;
  margin-left: 0;
  margin-bottom: 0;
`;
const ListItemContent = styled.div`
  display: flex;
  flex-direction: row;
  &:hover {
    opacity: 0.7;
  }
`;
const LisItemHeadingText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 15px;
  margin-left: 10px;
`;
const ListItemHeading = styled.div`
  margin: 0;
  color: #6772e5;
  font-size: 16px;
  line-height: 22px;
  font-weight: 600;
  letter-spacing: .025em;
`;

const items = [1, 2, 3]
export default () => {
  return (
    <ListContainer>
      <List>
        {
          items.map(i => (
            <li key={i}>
              <Link to="/contact">
                <ListItemContent>
                  <SvgIcon fill="grey" width="22" type="twitter"/>
                  <LisItemHeadingText>
                    <ListItemHeading>PAYMENTS</ListItemHeading>
                    <div>A complete payments platform engineered.</div>
                  </LisItemHeadingText>
                </ListItemContent>
              </Link>
            </li>
          ))
        }
      </List>
    </ListContainer>
  );
};