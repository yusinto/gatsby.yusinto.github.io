import React from 'react'
import {graphql} from 'gatsby'
import Layout from '../components/layout'

export default ({data}) => {
  const {markdownRemark} = data;
  const {frontmatter, html} = markdownRemark;
  const {date, title} = frontmatter;
  return (
    <Layout datePosted={date}>
      <h1>{title}</h1>
      <div
        className="blog-post-content"
        dangerouslySetInnerHTML={{__html: html}}
      />
    </Layout>
  );
};

export const markdownTemplateQuery = graphql`
    query BlogPostByPath($path: String!) {
        markdownRemark(frontmatter: { path: { eq: $path } }) {
            html
            frontmatter {
                date
                path
                title
            }
        }
    }
`;