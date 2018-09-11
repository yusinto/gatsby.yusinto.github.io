import React from 'react'
import {graphql} from 'gatsby'
import styled from 'styled-components'
import Layout from '../components/layout'
import TagList from '../components/tagList';
import {ContentStyles} from '../utils/sc-utils';
import AuthorBio from '../components/authorBio'

const Title = styled.h1`
  margin-top: 20px;
  margin-bottom: 30px;
`
const Content = styled.div`
  ${ContentStyles}
`
const Hero = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: cover;
`
export default ({data}) => {
  const {markdownRemark, site: { siteMetadata: { blurb }}} = data;

  if(markdownRemark) {
    const {frontmatter: {title, date, tags, files}, html, timeToRead} = markdownRemark;
    const hero = files && files.find(f => f.name === 'hero');

    return (
      <Layout>
        <AuthorBio blurb={blurb} datePosted={date} timeToRead={timeToRead}/>
        <Content><Title>{title}</Title></Content>
        {hero ? <Hero alt="hero" src={hero.publicURL}/> : null}
        <Content dangerouslySetInnerHTML={{__html: html}}/>
        <Content><TagList tags={tags}/></Content>
      </Layout>
    );
  }

  return 'markdown is null!'
};

export const postTemplateQuery = graphql`
    query postByPath($path: String!) {
        site {
          siteMetadata {
            blurb
          }
        }
        markdownRemark(frontmatter: { path: { eq: $path } }) {
            html
            timeToRead
            frontmatter {
                date(formatString: "MMMM DD, YYYY")
                path
                title
                files {
                    name
                    publicURL
                }
                tags
            }
        }
    }
`;