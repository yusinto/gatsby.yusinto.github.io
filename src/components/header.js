import React from 'react'
import {Link} from 'gatsby'
import styled from 'styled-components'
import {SiteNavHeight, HeaderHeight, SocialList} from '../constants'
import SvgIcon from './svg'
import SiteNav, {ContentGroup} from 'react-site-nav'
import Blog from './siteNav/blog'
import OpenSource from './siteNav/openSource'

const RootDiv = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  background: #f6f9fc;
  z-index: 2;
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  height: ${HeaderHeight}px;
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
export default () => (
  <RootDiv>
    <Header>
      <Logo>
        <Link to="/">ReactJunkie</Link>
      </Logo>
      <SocialLinks>
        {
          SocialList.map(({type, url}) =>
            <SocialLink key={type}>
              {
                type === 'email' ?
                  <a href={url}>
                    <SvgIcon type={type}/>
                  </a>
                  :
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <SvgIcon type={type}/>
                  </a>
              }
            </SocialLink>
          )
        }
      </SocialLinks>
    </Header>
    <SiteNav
      background="#323232"
      fontSize="14"
      rowHeight={SiteNavHeight}
      debug={false}
    >
      <ContentGroup title="Blog" width="350" height="435" background="#eff2f5">
        <Blog/>
      </ContentGroup>
      <ContentGroup title="Open Source" width="320" height="400">
        <OpenSource/>
      </ContentGroup>
      <ContentGroup title="About" rootUrl="/about"/>
    </SiteNav>
  </RootDiv>
)
