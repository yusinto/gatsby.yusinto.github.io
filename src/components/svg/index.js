import React from 'react'
import styled from 'styled-components'

const StyledSvg = styled.span`
  width: ${({width}) => width}px;
  padding-top: 5px;
`
export default ({type, fill, width}) => {
  const SocialIcon = require(`./${type}`).default

  return (
    <StyledSvg width={width}>
      <SocialIcon fill={fill}/>
    </StyledSvg>
  )
}
