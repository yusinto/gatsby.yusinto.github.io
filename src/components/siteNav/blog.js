import React from 'react'
import styled from 'styled-components'
import {StaticQuery, Link, graphql} from 'gatsby'
import DateReadTime from '../dateReadTime'
import latestIcon from './blog-icon.png'

const RootDiv = styled.div`
  height: 100%;
  width: 100%;
  
  & img {
    margin-bottom: 0;
  }
`
const ListContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const List = styled.ul`
  color: lightslategray;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  list-style-type: none;
  margin: 0;
  padding: 10px 8px 0 15px;
`;
const ListItemContent = styled.div`
  display: flex;
  flex-direction: row;
  &:hover {
    opacity: 0.7;
  }
`;
const LisItemHeadingText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 10px;
  margin-left: 5px;
  color: #6772e5;
`;
const ListItemHeading = styled.div`
  margin: 0;
  font-size: 13px;
  font-weight: 600;
`;
const Latest = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px 20px;
  background: white;
    
  &:hover {
    opacity: 0.7;  
  }
`
const StyledLatestImage = styled.img`
  margin-top: 2px;
  width: 24px;
`
const LatestText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-left: 6px;
`
const LatestHeading = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #6772e5;
`
const BlogTitle = styled.div`
  font-weight: bold;
  opacity: 0.7;
  font-size: 13px;
`
const BlogExcerpt = styled.div`
  font-size: 12px;
  opacity: 0.8;
`
const StyledLink = styled(Link)`
  color: black;
`
export default ({data}) => (
  <StaticQuery
    query={graphql`
      query latestBlogs {
        allMarkdownRemark(
            sort: { order: DESC, fields: [frontmatter___date] }
            limit: 4
            filter: {frontmatter: {published: {eq: true}}}
        ) {
            edges {
                node {
                    excerpt
                    timeToRead
                    frontmatter {
                        date(formatString: "MMMM DD, YYYY")
                        title
                        path
                    }
                }
            }
        }}
    `}
    render={data => {
      let posts = data.allMarkdownRemark.edges;
      const latest = posts[0].node;

      return (
        <RootDiv>
          <StyledLink to={latest.frontmatter.path}>
            <Latest>
              <StyledLatestImage src={latestIcon} alt="latest"/>
              <LatestText>
                <LatestHeading>Latest</LatestHeading>
                <BlogTitle>{latest.frontmatter.title}</BlogTitle>
                <BlogExcerpt>{latest.excerpt}</BlogExcerpt>
                <DateReadTime fontSizeDesktop={11} date={latest.frontmatter.date} timeToRead={latest.timeToRead}/>
              </LatestText>
            </Latest>
          </StyledLink>
          <ListContainer>
            <List>
              {
                posts.map((p, i) => {
                  if (i === 0) {
                    return null;
                  }

                  const {timeToRead, frontmatter: {title, date, path}} = p.node;
                  return (
                    <li key={path}>
                      <Link to={path}>
                        <ListItemContent>
                          <LisItemHeadingText>
                            <ListItemHeading>{title}</ListItemHeading>
                            <DateReadTime fontSizeDesktop={11} date={date} timeToRead={timeToRead}/>
                          </LisItemHeadingText>
                        </ListItemContent>
                      </Link>
                    </li>
                  );
                })
              }
              <li key="all-posts">
                <Link to="/">
                  <ListItemContent>
                    <LisItemHeadingText>
                      <ListItemHeading>All Posts</ListItemHeading>
                    </LisItemHeadingText>
                  </ListItemContent>
                </Link>
              </li>
            </List>
          </ListContainer>
        </RootDiv>
      );
    }}
  />
);