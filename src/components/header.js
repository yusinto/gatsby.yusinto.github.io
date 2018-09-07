import React from 'react'
import {Link} from 'gatsby'
import styled from 'styled-components'
import {StickyHeaderHeight} from '../constants'
import TwitterSvg from './svg/twitter'
import GithubSvg from './svg/github'
import EmailSvg from './svg/email'
import LinkedinSvg from './svg/linkedin'

const RootDiv = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: ${StickyHeaderHeight}px;
  opacity: 0.96;
  background: white;
  z-index: 2;
  display: flex;
  justify-content: space-between;
`
const Logo = styled.h1`
  margin: 0;
  margin-left: 10px;
  font-size: 25px;
  font-weight: bold;
  
  @media(min-width: 375px) { 
    font-size: 32px;
  } 
`
const SocialLinks = styled.div`
  display: flex;
  padding-top: 5px;
  
  @media(min-width: 480px) {
    margin-right: 10px;
  }
`
const SocialLink = styled.span`
    width: 18px;
    margin: 8px 10px;
    
    @media(min-width: 375px) { 
      width: 20px;
      margin: 10px;
    } 
    
    @media(min-width: 480px) {
      margin: 10px 13px;
    }
`
const Header = () => (
  <RootDiv>
    <Logo>
      <Link to="/">ReactJunkie</Link>
    </Logo>
    <SocialLinks>
      <SocialLink>
        <a href="https://twitter.com/yusinto" target="_blank" rel="noopener noreferrer">
          <TwitterSvg/>
        </a>
      </SocialLink>
      <SocialLink>
        <a href="https://github.com/yusinto" target="_blank" rel="noopener noreferrer">
          <GithubSvg/>
        </a>
      </SocialLink>
      <SocialLink>
        <a href="mailto:yusinto@gmail.com">
          <EmailSvg/>
        </a>
      </SocialLink>
      <SocialLink>
        <a href="https://www.linkedin.com/in/yusinto" target="_blank" rel="noopener noreferrer">
          <LinkedinSvg/>
        </a>
      </SocialLink>
    </SocialLinks>
  </RootDiv>
)

export default Header
