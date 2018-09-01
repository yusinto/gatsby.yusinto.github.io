import React from 'react'
import styled, {css} from 'styled-components'
import ellipsize from 'ellipsize'
import {ContentStyles} from '../utils/sc-utils'
import profilePic from '../../src/images/icon-512x512.png'

const blurp = 'Frontend Engineer @ Qantas. Tea lover. Passionate about react graphql and everything else javascript.';
const blurpShort = ellipsize(blurp, 60);
const blurpMedium = ellipsize(blurp, 80);

const generateBlurp = css`
  content: '${({layout}) => layout === 'column' ? blurp : blurpShort}';
  ${({layout}) => {
    if (layout !== 'column') {
      return `
        @media(min-width: 380px) {
          content: '${blurpMedium}';
        }
        
        @media(min-width: 455px) {
          content: '${blurp}';
        }`
    }
  }
}`
const ProfilePic = styled.div`
  border-radius: 50%;
  background-image: url('${profilePic}');
  background-position: center top;
  background-size: cover;
`
const Bio = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  opacity: 0.8;
`
const Name = styled.div`
  font-weight: bold;
  opacity: 1;
`
const Blurp = styled.div`

`
const DateReadMinutes = styled.div`
  font-size: 11.5px;
`
const MidDot = styled.span`
  padding: 0 7px;
  vertical-align: middle;
`
const RootDiv = styled.div`
  display: grid;
  grid-template-columns: ${({layout}) => layout === 'column' ? null : '70px ' }auto;
  grid-template-rows: ${({layout}) => layout === 'column' ? '100px ' : null }auto;
  grid-column-gap: 5px;
  align-items: center;
  ${ContentStyles}
  
  ${ProfilePic} {
    height: ${({layout}) => layout === 'column' ? 80 : 60 }px;
    width: ${({layout}) => layout === 'column' ? 80 : 60 }px;
  }
  
  ${Name} {
    font-size: ${({layout}) => layout === 'column' ? 24 : 13 }px;
  }
  
  ${Blurp} {
    font-size: ${({layout}) => layout === 'column' ? 15 : 13 }px;
    
    &:after {
      ${generateBlurp}
    }
  }
  
  ${DateReadMinutes} {
    display: ${({layout}) => layout === 'column' ? 'none' : 'block' };
  }
`

export default ({layout, datePosted, timeToRead}) => {
  return (
    <RootDiv layout={layout}>
      <ProfilePic/>
      <Bio>
        <Name>Yusinto Ngadiman</Name>
        <Blurp/>
        <DateReadMinutes>{datePosted}<MidDot>&middot;</MidDot>{timeToRead} min read</DateReadMinutes>
      </Bio>
    </RootDiv>
  )
}
