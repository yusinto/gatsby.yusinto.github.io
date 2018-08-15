import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import {StaticQuery, graphql} from 'gatsby'
import styled, {injectGlobal} from 'styled-components'
import Header from './stickyHeader'
import AuthorWithBio from './authorWithBio'
import {StickyHeaderHeight} from '../constants'

injectGlobal`
  html {
    font-family: sans-serif;
  }
  
  body {
    margin: 0;
  }
  
  a:hover {
    text-decoration: none;
    opacity: 0.7;
  }
  
  .gatsby-highlight-code-line {
    background-color: #5068ad;
    display: block;
    margin-right: -1em;
    margin-left: -1em;
    padding-right: 1em;
    padding-left: 0.75em;
    border-left: 0.25em solid #f99;
  }
`

const RootDiv = styled.div`
  margin: 0 auto;
  max-width: 740px;
  padding: ${StickyHeaderHeight}px 1.0875rem 1.45rem;
`

const Layout = ({children, data, datePosted}) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
      <Helmet
        title={data.site.siteMetadata.title}
        meta={[
          {name: 'description', content: 'Sample'},
          {name: 'keywords', content: 'sample, something'},
        ]}
      >
        <html lang="en"/>
      </Helmet>
      <Header siteTitle={data.site.siteMetadata.title}/>
      <RootDiv>
        <AuthorWithBio datePosted={datePosted}/>
        {children}
      </RootDiv>
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  datePosted: PropTypes.string,
}

export default Layout
