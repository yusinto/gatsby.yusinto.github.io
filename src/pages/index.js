import React from 'react'
import {graphql} from 'gatsby'
// import styled from 'styled-components'
import Layout from '../components/layout';

export default ({data}) => {
  // const posts = data.allMarkdownRemark.edges;

  return (
    <Layout authorBioLayout="column"/>
  );
};

export const indexQuery = graphql`
    query allPosts {
        allMarkdownRemark(
            sort: { order: DESC, fields: [frontmatter___date] }
            limit: 10
        ) {
            edges {
                node {
                    frontmatter {
                        date
                        path
                        title
                        files {
                            name
                            publicURL
                        }
                    }
                }
            }
        }
    }
`
