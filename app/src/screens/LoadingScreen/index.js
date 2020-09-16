import React from 'react'
import {ActivityIndicator} from 'react-native'
import styled from 'styled-components/native'

import {isTokenValid} from '../../lib/api'

const CenterView = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export default class LoadingScreen extends React.Component {
  async componentDidMount() {
    if (!(await isTokenValid())) return this.props.navigation.navigate('Login')
    this.props.navigation.navigate('MainAppStack')
  }

  render() {
    return (
      <CenterView>
        <ActivityIndicator />
      </CenterView>
    )
  }
}
