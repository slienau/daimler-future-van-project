import React from 'react'
import {StyleSheet} from 'react-native'
import styled from 'styled-components/native/dist/styled-components.native.esm'
import {Text} from 'native-base'
import {DARK_COLOR, GREY_COLOR} from './colors'

const StyledText = styled(Text)`
  color: ${props => (props.greyColor ? GREY_COLOR : DARK_COLOR)};
`

const DefaultText = props => {
  return (
    <StyledText {...props} style={[styles.text, props.style]}>
      {props.children}
    </StyledText>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
})

export default DefaultText
