import React from 'react'
import {Link, graphql} from 'gatsby'
import styled from 'styled-components'

const Hero = styled.div`
  width: 100%;
  background: forestgreen;
  height: 265px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Logo = styled.h1`
  font-size: 55px !important;
  font-weight: bold;
  color: white;
  
  @media(min-width: 375px) { 
    font-size: 32px;
  } 
`

const PostDescription = styled.div`
  margin: 10px 20px;
  
  &:hover {
    opacity: 0.7;
  }
  
  @media(min-width: 690px) {
    margin: 40px 40px;
  }
`
const Title = styled.h3`
  @media(min-width: 690px) {
    font-size: 32px;
  }
`
const Date = styled.div`
  font-size: 14px;
  
  @media(min-width: 690px) {
    font-size: 20px;
  }
`
const Footer = styled.div`
  height: 200px;
  width: 100%;
  margin-top: 40px;
  background: forestgreen;
`
const GatsbyLink = ({className, path, children}) => (
  <Link className={className} to={path}>{children}</Link>
);
const StyledGatsbyLink = styled(GatsbyLink)`{
  width: 100%;
  height: 280px;
  background-image: linear-gradient(
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0.3)
    ), 
    url('${props => props.backgroundImage}');
  margin-top: 20px;
  background-position: 50% 50%;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: white;
  
  &:hover {
    opacity: 1;
  }
  
  @media(min-width: 690px) {
    height: 390px;
  }
}`;

export default ({data}) => {
  const posts = data.allMarkdownRemark.edges;

  return (
    <React.Fragment>
      <Hero>
        <Logo>React Junkie</Logo>
      </Hero>
      {
        posts.map(p => {
          const {frontmatter: {title, date, path, files}} = p.node;
          const postHero = files && files.find(f => f.name === 'hero');

          if (postHero) {
            return (
              <StyledGatsbyLink path={path} backgroundImage={postHero.publicURL}>
                <PostDescription>
                  <Title>
                    {title}
                  </Title>
                  <Date>{date}</Date>
                </PostDescription>
              </StyledGatsbyLink>
            );
          }

          // TODO: use default hero if none is set
          return null;
        })
      }
      <Footer/>
    </React.Fragment>
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
