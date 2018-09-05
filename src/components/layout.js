import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import {StaticQuery, graphql} from 'gatsby'
import styled, {injectGlobal} from 'styled-components'
import Header from './header'
import AuthorBio from './authorBio'
import AuthorBioHomepage from './authorBioHomepage'
import {StickyHeaderHeight} from '../constants'

injectGlobal`
  html {
    font-family: sans-serif;
  }
  
  h1 {
    margin-top: 50px;
  }
  
  h2, h3, h4, h5 {
    margin-top: 50px;
    margin-bottom: 12px;
  }
  
  body {
    margin: 0;
  }
  
  a:hover {
    text-decoration: none;
    opacity: 0.7;
  }
  
  ul, ol {
    margin-left: 1.78rem;
  }
  
  .gatsby-highlight {
    margin-bottom: 30px;
  }
  
  .gatsby-highlight-code-line {
    background-color: #14161a;
    display: block;
    margin-right: -1em;
    margin-left: -1em;
    padding-right: 1em;
    padding-left: 0.75em;
    border-left: 0.2em solid yellowgreen;
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
  padding: ${StickyHeaderHeight}px 0;
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
          {
            pageType === 'home' ?
              <AuthorBioHomepage blurb={blurb}/>
              :
              <AuthorBio blurb={blurb} datePosted={datePosted} timeToRead={timeToRead}/>
          }

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
