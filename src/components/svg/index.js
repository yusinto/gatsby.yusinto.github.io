import React from 'react'
import styled from 'styled-components'

const StyledSvg = styled.span`
  padding-top: ${({paddingTop}) => paddingTop || 0}px;
`
export default ({type, fill, width, paddingTop}) => {
  const Icon = require(`./${type}`).default

  return (
    <StyledSvg paddingTop={paddingTop}>
      <Icon fill={fill} width={width}/>
    </StyledSvg>
  )
}
