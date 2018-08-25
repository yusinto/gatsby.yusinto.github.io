import React from 'react'
import styled from 'styled-components'
import ellipsize from 'ellipsize'
import {ContentStyles} from '../utils/sc-utils'

const blurp = 'Frontend Engineer @ Qantas. Tea lover. Passionate about react graphql and everything else javascript.';
const blurpShort = ellipsize(blurp, 60);
const blurpMedium = ellipsize(blurp, 80);

const RootDiv = styled.div`
  display: grid;
  grid-template-columns: 70px auto;
  grid-template-rows: 100px;
  grid-column-gap: 5px;
  align-items: center;
  ${ContentStyles}
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
const Blurp = styled.div`
  &:after {
    content: '${blurpShort}';
    
    @media(min-width: 380px) {
      content: '${blurpMedium}';
    }
    
    @media(min-width: 455px) {
      content: '${blurp}';
    }
  }
`
const DateReadMinutes = styled.div`
  font-size: 11.5px;
`
const MidDot = styled.span`
  padding: 0px 7px;
  vertical-align: middle;
`

export default ({datePosted, timeToRead}) => {
  return (
    <RootDiv>
      <ProfilePic/>
      <Bio>
        <Name>Yusinto Ngadiman</Name>
        <Blurp/>
        <DateReadMinutes>{datePosted}<MidDot>&middot;</MidDot>{timeToRead} min read</DateReadMinutes>
      </Bio>
    </RootDiv>
  )
}
