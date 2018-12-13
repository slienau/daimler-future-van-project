import React from 'react'
import {ActivityIndicator, AsyncStorage} from 'react-native'
import styled from 'styled-components/native'

import {setToken} from '../../lib/api'

const CenterView = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export default class LoadingScreen extends React.Component {
  constructor(props) {
    super(props)
    this.loadToken()
  }

  loadToken = async () => {
    const token = await AsyncStorage.getItem('token')
    setToken(token)
    this.props.navigation.navigate(token ? 'MainView' : 'Login')
  }

  render() {
    return (
      <CenterView>
        <ActivityIndicator />
      </CenterView>
    )
  }
}
