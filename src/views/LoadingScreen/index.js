import React from 'react'
import {ActivityIndicator} from 'react-native'
import styled from 'styled-components/native'

import {loadToken} from '../../lib/api'

const CenterView = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export default class LoadingScreen extends React.Component {
  async componentDidMount() {
    this.props.navigation.navigate((await loadToken()) ? 'MainView' : 'Login')
  }

  render() {
    return (
      <CenterView>
        <ActivityIndicator />
      </CenterView>
    )
  }
}
