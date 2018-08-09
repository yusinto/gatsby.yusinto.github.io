import React from 'react'
import styled from 'styled-components'

const RootDiv = styled.div`
  display: grid;
  grid-template-columns: 70px auto;
  grid-template-rows: 100px;
  grid-column-gap: 5px;
  //border: red solid 1px;
  align-items: center;
`
const Bio = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-size: 13px;
  opacity: 0.8;
`

const ProfilePic = styled.div`
  height: 60px;
  width: 60px;
  border-radius: 50%;
  background-image: url("http://reactjunkie.com/assets/images/yus_profile_pic.jpg");
  background-position: center top;
  background-size: cover;
`
const Name = styled.div`
  font-weight: bold;
  opacity: 1;
`
const DateReadMinutes = styled.div`
  font-size: 11.5px;
`

export default () => (
  <RootDiv>
    <ProfilePic/>
    <Bio>
      <Name>Yusinto Ngadiman</Name>
      <div>
        Addicted to react, graphql & everything
        else javascript.
      </div>
      <DateReadMinutes>8 Aug | 5 min read</DateReadMinutes>
    </Bio>
  </RootDiv>
)