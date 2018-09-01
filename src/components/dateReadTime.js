import React from 'react'
import styled from 'styled-components'

const DateReadMinutes = styled.div`
  font-size: 12px;
  opacity: 0.75;
  
  @media(min-width: 690px) {
    font-size: 14px;
  }
`
const MidDot = styled.span`
  padding: 0 7px;
  vertical-align: middle;
`
export default ({date, timeToRead}) => (
    <DateReadMinutes>{date}<MidDot>&middot;</MidDot>{timeToRead} min read</DateReadMinutes>
);
