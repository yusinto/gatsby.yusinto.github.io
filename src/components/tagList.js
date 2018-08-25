import React from 'react';
import styled from 'styled-components'

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  letter-spacing: 0;
  font-size: 15px;
  font-weight: 400;
  font-style: normal;
`
const ListItem = styled.li`
    display: inline-block;
    border: none;
    color: rgba(0,0,0,.68);
    background: rgba(0,0,0,.05);
    border-radius: 3px;
    margin: 8px;
    padding: 0px 10px;
`

export default ({tags}) => (
  <List>
    {
      tags.map(t => {
        return <ListItem key={t}>{t}</ListItem>
      })
    }
  </List>
)