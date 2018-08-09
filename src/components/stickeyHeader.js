import React from 'react'
import {Link} from 'gatsby'
import styled from 'styled-components'
import {StickyHeaderHeight} from '../constants'

const RootDiv = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: ${StickyHeaderHeight}px;
  //border: 1px brown solid;
  opacity: 0.96;
  background: white;
  z-index: 2;
`
const Logo = styled.h1`
  margin: 0;
  margin-left: 20px;
  font-size: 25px;
  font-weight: bold;
  
  @media(min-width: 768px) {
    margin: 0;
    text-align: center;
    font-size: 32px;
  } 
`

const Header = ({siteTitle}) => (
  <RootDiv>
    <Logo>
      <Link to="/">ReactJunkie</Link>
    </Logo>
  </RootDiv>
)

export default Header
