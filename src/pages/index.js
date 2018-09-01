import React from 'react'
import {graphql, Link} from 'gatsby'
import styled from 'styled-components'
import Layout from '../components/layout';
import DateReadTime from '../components/dateReadTime'

const PostTile = styled.section`
  margin: 20px 20px 30px;
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
const PostHero = styled.img`
  max-height: 80%;
`
const PostDescription = styled.div`
  color: black;
  
  &:hover {
    opacity: 0.7;
  }
`
const Title = styled.h3`
  margin: 0 0 10px;
  
  @media(min-width: 690px) {
    font-size: 28px;
  }
`
const Summary = styled.div`
  font-size: 16px;
`
export default ({data}) => {
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout authorBioLayout="column">
      {
        posts.map(p => {
          const {timeToRead, frontmatter: {title, date, path, files}} = p.node;
          const postHero = files && files.find(f => f.name === 'hero');

          if (postHero) {
            return (
              <PostTile key={path}>
                <StyledGatsbyLink to={path}>
                  <PostHero src={postHero.publicURL} alt={title}/>
                  <PostDescription>
                    <Title>
                      {title}
                    </Title>
                    <Summary>
                      Some content summary here...
                    </Summary>
                    <DateReadTime date={date} timeToRead={timeToRead}/>
                  </PostDescription>
                </StyledGatsbyLink>
              </PostTile>
            );
          }

          // TODO: use default hero if none is set
          return null;
        })
      }
    </Layout>
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
                    timeToRead
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
