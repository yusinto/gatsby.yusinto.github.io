import React from 'react'
import styled from 'styled-components'
import Layout from '../components/layout'
import {ContentStyles} from '../utils/sc-utils';
import profilePic from '../../src/images/profile.png'
import loui from '../../src/images/loui.png'
import tea from '../../src/images/tea.png'

const Content = styled.div`
  ${ContentStyles}
  margin-top: 10px;
  max-width: 520px;
  
  & h3 {
    font-size: 16px;
    margin-top: 20px;
  }
  
  & p {
    font-size: 14px;
  }
`
const ProfilePicContainer = styled.div`
  display: flex;
  justify-content: center;
`
const ProfilePic = styled.div`
  border-radius: 50%;
  background-image: url('${profilePic}');
  background-position: center top;
  background-size: cover;
  height: 140px;
  width: 140px;
    
  @media(min-width: 552px) {
    height: 200px;
    width: 200px;
  }  
`
export default () => (
  <Layout>
    <Content>
      <ProfilePicContainer>
        <ProfilePic/>
      </ProfilePicContainer>
      <h3>About</h3>
      <p>
        I'm a dog lover, a tea lover and a coding addict. Check out my Aussie Bulldog Loui balancing a tennis
        ball on his nose.
      </p>
      <img src={loui} alt="Loui"/>
      <p>
        I love green tea. Everything matters when making green tea. You need the right tools, timing, temperature
        and ingredients to make a good cup. A bit like software development! This is my handcrafted shiboridashi set
        I bought from Tokyo to make my gyokuro and sencha.
      </p>
      <img src={tea} alt="Shiboridashi"/>
      <p>
        When I'm not coding you'll find me reading my kindle or meditating. The way our brain works is truly amazing.
      </p>
    </Content>
  </Layout>
)