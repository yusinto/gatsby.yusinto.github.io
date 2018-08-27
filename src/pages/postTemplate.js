import React from 'react'
import {graphql} from 'gatsby'
import styled from 'styled-components'
import Layout from '../components/layout'
import TagList from '../components/tagList';
import {ContentStyles} from '../utils/sc-utils';

const Title = styled.h1`
  margin-top: 20px;
  margin-bottom: 50px;
`
const Content = styled.div`
  ${ContentStyles}
`
const Hero = styled.img`
  width: 100%;
`
export default ({data}) => {
  const {markdownRemark} = data;
  const {frontmatter: {title, date, tags, files}, html, timeToRead} = markdownRemark;
  const hero = files && files.find(f => f.name === 'hero');

  return (
    <Layout datePosted={date} timeToRead={timeToRead}>
      <Content><Title>{title}</Title></Content>
      {hero ? <Hero alt="hero" src={hero.publicURL}/> : null}
      <Content dangerouslySetInnerHTML={{__html: html}}/>
      <Content><TagList tags={tags}/></Content>
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
                    name
                    publicURL
                }
                tags
            }
        }
    }
`;