import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import {StaticQuery, graphql} from 'gatsby'
import styled, {createGlobalStyle} from 'styled-components'
import Header from './header'
import {HeaderSiteNavHeightMobile, HeaderSiteNavHeightDesktop} from '../constants'

const GlobalStyle = createGlobalStyle`
  html {
    font-family: sans-serif;
  }
  
  h1 {
    margin-top: 50px;
  }
  
  h2, h3, h4, h5 {
    margin-top: 30px;
    margin-bottom: 12px;
  }
  
  body {
    margin: 0;
  }
  
  a:hover {
    text-decoration: none !important;
    opacity: 0.7;
  }
  
  ul, ol {
    margin-left: 1.78rem;
  }

  .gatsby-highlight-code-line {
    background-color: #14161a;
    display: block;
    margin-left: -0.45em;
    padding-left: 0.2em;
    border-left: 0.2em solid yellowgreen;
  }
  
  .gatsby-highlight pre span.line-numbers-rows {
    width: 5% !important;
  }
    
  .gatsby-highlight pre span.line-numbers-rows span{
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .gatsby-highlight {
    border-radius: 0.3em;
    overflow: auto;
    margin-bottom: 20px;
  }
  
  .gatsby-highlight pre[class*="language-"] {
    margin: 0 !important;
    padding: 0;
    overflow: initial;
    float: left; /* 1 */
    min-width: 100%; /* 2 */
  }
  
  .gatsby-highlight pre[class*="language-"].line-numbers {
    padding-left: 2.8em; /* 3 */
  }
  
  .embedVideoIframe {
    margin-bottom: 0;
  }
  
  #markdownImage {
    border: 1px solid #2d2d2d;
    box-shadow: 6px 7px 5px -1px rgba(0,0,0,0.11);
    border-radius: 7px;
  }
`
const RootDiv = styled.div`
  margin: 0 auto;
  width: 100%;
  padding: ${HeaderSiteNavHeightMobile}px 0;
  
  @media(min-width: 768px) {
    padding: ${HeaderSiteNavHeightDesktop}px 0;
  }
`
const Layout = ({children, pageType, datePosted, timeToRead}) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
            description,
            keywordsCsv,
            blurb
          }
        }
      }
    `}
    render={data => {
      const {title, description, keywordsCsv, blurb} = data.site.siteMetadata;
      return (
        <>
          <GlobalStyle />
          <Helmet
            title={title}
            meta={[
              {name: 'description', content: `${description} ${blurb}`},
              {name: 'keywords', content: keywordsCsv},
            ]}
          >
            <html lang="en"/>
          </Helmet>
          <Header siteTitle={data.site.siteMetadata.title}/>
          <RootDiv>
            {children}
          </RootDiv>
        </>
      )
    }}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  datePosted: PropTypes.string,
}

export default Layout
