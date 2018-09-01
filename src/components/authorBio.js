import React from 'react'
import styled from 'styled-components'
import ellipsize from 'ellipsize'
import memoizeOne from 'memoize-one';
import {ContentStyles} from '../utils/sc-utils'
import profilePic from '../../src/images/icon-512x512.png'

const ellipsizeBlurb = (blurb, length) => ellipsize(blurb, length);
const memoizedEllipsize = memoizeOne(ellipsizeBlurb);

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
  background-image: url('${profilePic}');
  background-position: center top;
  background-size: cover;
`
const Name = styled.div`
  font-weight: bold;
  opacity: 1;
`
const Blurb = styled.div`
  &:after {
    content: '${({short}) => short}';
    
    @media(min-width: 380px) {
      content: '${({medium}) => medium}';
    }
    
    @media(min-width: 503px) {
      content: '${({blurb}) => blurb}';
    }
  }
`
const DateReadMinutes = styled.div`
  font-size: 11.5px;
`
const MidDot = styled.span`
  padding: 0 7px;
  vertical-align: middle;
`

export default ({datePosted, timeToRead, blurb}) => {
  const blurbShort = memoizedEllipsize(blurb, 60);
  const blurbMedium = memoizedEllipsize(blurb, 80);

  return (
    <RootDiv>
      <ProfilePic/>
      <Bio>
        <Name>Yusinto Ngadiman</Name>
        <Blurb blurb={blurb} short={blurbShort} medium={blurbMedium}/>
        <DateReadMinutes>{datePosted}<MidDot>&middot;</MidDot>{timeToRead} min read</DateReadMinutes>
      </Bio>
    </RootDiv>
  )
}
