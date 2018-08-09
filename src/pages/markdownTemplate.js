import React from 'react'
import {Link} from 'gatsby'
import Layout from '../components/layout'

export default ({data}) => {
  const {markdownRemark} = data;
  const {frontmatter, html} = markdownRemark;
  return (
    <Layout>
      <h1>{frontmatter.title}</h1>
      <h2>{frontmatter.date}</h2>
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