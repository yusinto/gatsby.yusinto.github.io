import React from 'react'
import styled from 'styled-components'
import {ContentStyles} from '../utils/sc-utils'
import profilePic from '../../src/images/icon-512x512.png'

const blurp = 'Frontend Engineer @ Qantas. Tea lover. Passionate about react graphql and everything else javascript.';

const ProfilePic = styled.div`
  border-radius: 50%;
  background-image: url('${profilePic}');
  background-position: center top;
  background-size: cover;
  height: 80px;
  width: 80px;
    
  @media(min-width: 552px) {
    grid-area: profilePic;
    height: 120px;
    width: 120px;
  }  
`
const Bio = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  opacity: 0.8;
  
  @media(min-width: 552px) {
    grid-area: bio;
  }
`
const Name = styled.div`
  font-size: 24px;
  font-weight: bold;
  opacity: 1;
`
const Blurp = styled.div`
 font-size: 15px;
    
  &:after {
    content: '${blurp}';
  }
`
const RootDiv = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 100px auto;
  grid-column-gap: 5px;
  align-items: center;
  ${ContentStyles}
  margin-top: 20px;
  
  @media(min-width: 552px) {
    grid-template-columns: auto auto;
    grid-template-rows: auto;
    grid-template-areas: "bio profilePic";
  }
`

export default () => (
    <RootDiv>
      <ProfilePic/>
      <Bio>
        <Name>Yusinto Ngadiman</Name>
        <Blurp/>
      </Bio>
    </RootDiv>
)
