import React from 'react'
import {graphql} from 'gatsby'
import Layout from '../components/layout'

export default ({data}) => {
  const {markdownRemark} = data;
  const {frontmatter: {date, title}, html, timeToRead} = markdownRemark;

  return (
    <Layout datePosted={date} timeToRead={timeToRead}>
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
            timeToRead
            frontmatter {
                date
                path
                title
                files {
                    publicURL
                }
            }
        }
    }
`;