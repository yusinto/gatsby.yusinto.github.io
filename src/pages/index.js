import React from 'react'
import {graphql, Link} from 'gatsby'
import styled from 'styled-components'
import {ContentStyles} from '../utils/sc-utils'
import Layout from '../components/layout';
import DateReadTime from '../components/dateReadTime'
import AuthorBioHomepage from '../components/authorBioHomepage'

const Content = styled.div`
  ${ContentStyles}
`
const PostTile = styled.section`
  margin: 20px 0 30px;
  padding: 15px 15px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
`
const GatsbyLink = ({className, to, children}) => (
  <Link className={className} to={to}>{children}</Link>
);
const StyledGatsbyLink = styled(GatsbyLink)`{
  display: flex;
  flex-direction: column;
  
  &:hover {
    opacity: 1;
  }
}`
const PostHero = styled.div`
  width: 100%;
  height: 120px;
  background-image: url('${props => props.src}');
  margin: 10px 0 20px;
  background-position: 50% 50%;
  background-size: cover;
  border-radius: 3px;
  
  @media(min-width: 690px) {
    height: 200px;
  }
`
const PostDescription = styled.div`
  color: black;
`
const Title = styled.h3`
  margin: 0 0 10px;
  
  @media(min-width: 690px) {
    font-size: 28px;
  }
`
const Summary = styled.div`
  margin: 10px 0 20px;
  font-size: 16px;
`
export default ({data}) => {
  const {allMarkdownRemark: {edges: posts}, site: {siteMetadata: {blurb}}} = data;

  return (
    <Layout>
      <AuthorBioHomepage blurb={blurb}/>
      <Content>
        <h4>Latest</h4>
        {
          posts.map(p => {
            const {excerpt, timeToRead, frontmatter: {title, date, path, files}} = p.node;
            const hero = files && files.find(f => f.name === 'hero');

            return (
              <PostTile key={path}>
                <StyledGatsbyLink to={path}>
                  {hero ? <PostHero src={hero.publicURL}/> : null}
                  <PostDescription>
                    <Title>
                      {title}
                    </Title>
                    <Summary>{excerpt}</Summary>
                    <DateReadTime date={date} timeToRead={timeToRead}/>
                  </PostDescription>
                </StyledGatsbyLink>
              </PostTile>
            );
          })
        }
      </Content>
    </Layout>
  );
};

export const indexQuery = graphql`
    query allPosts {
        site {
          siteMetadata {
            blurb
          }
        }
        allMarkdownRemark(
            sort: { order: DESC, fields: [frontmatter___date] }
#            limit: 30
            filter: {frontmatter: {published: {eq: true}}}
        ) {
            edges {
                node {
                    excerpt
                    timeToRead
                    frontmatter {
                        date(formatString: "MMMM DD, YYYY")
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
