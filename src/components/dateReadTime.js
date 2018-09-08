import React from 'react'
import styled from 'styled-components'

const DateReadMinutes = styled.div`
  font-size: ${({fontSizeMobile}) => fontSizeMobile ? fontSizeMobile : 12}px;
  opacity: 0.75;
  
  @media(min-width: 690px) {
    font-size: ${({fontSizeDesktop}) => fontSizeDesktop ? fontSizeDesktop : 14}px;
  }
`
const MidDot = styled.span`
  padding: 0 7px;
  vertical-align: middle;
`
export default ({date, timeToRead, fontSizeMobile, fontSizeDesktop}) => (
  <DateReadMinutes
    fontSizeMobile={fontSizeMobile}
    fontSizeDesktop={fontSizeDesktop}
  >{date}<MidDot>&middot;</MidDot>{timeToRead} min read</DateReadMinutes>
);
