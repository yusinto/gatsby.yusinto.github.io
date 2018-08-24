import React from 'react'
import {graphql} from 'gatsby'
import Layout from '../components/layout'
import TagList from '../components/tagList';

export default ({data}) => {
  const {markdownRemark} = data;
  const {frontmatter: {date, tags}, html, timeToRead} = markdownRemark;

  return (
    <Layout datePosted={date} timeToRead={timeToRead}>
      <div
        className="blog-post-content"
        dangerouslySetInnerHTML={{__html: html}}
      />
      <TagList tags={tags}/>
    </Layout>
  );
};

export const postTemplateQuery = graphql`
    query postByPath($path: String!) {
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
                tags
            }
        }
    }
`;