import React from 'react'
import styled from 'styled-components'

const RootDiv = styled.div`
  display: grid;
  grid-template-columns: 50px auto;
  grid-template-rows: 70px;
  grid-column-gap: 10px;
  border: red solid 1px;
`
const Bio = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

const ProfilePic = styled.div`
  height: 50px;
  border-radius: 50%;
  background-image: url("http://reactjunkie.com/assets/images/yus_profile_pic.jpg");
  background-position: center top;
  background-size: cover;
`

export default () => (
  <RootDiv>
    <ProfilePic />
    <Bio>
      <div>Yusinto Ngadiman</div>
      <div>Frontend Lead at Qantas</div>
      <div>8 Aug 2018</div>
    </Bio>
  </RootDiv>
)