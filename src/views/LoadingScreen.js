import React from 'react'
import {ActivityIndicator, AsyncStorage} from 'react-native'
import styled from 'styled-components/native'

const CenterView = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export default class LoadingScreen extends React.Component {
  constructor(props) {
    super(props)
    this._bootstrapAsync()
  }

  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken')
    this.props.navigation.navigate(userToken ? 'MainView' : 'Login')
  }

  render() {
    return (
      <CenterView>
        <ActivityIndicator />
      </CenterView>
    )
  }
}
