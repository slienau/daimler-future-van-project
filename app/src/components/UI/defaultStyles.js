import {StyleSheet} from 'react-native'
import {DARK_COLOR, LIGHT_COLOR} from './colors'

const defaultStyles = StyleSheet.create({
  textCenter: {
    textAlign: 'center',
  },
  textBold: {
    fontWeight: 'bold',
  },
  textLarge: {
    fontSize: 20,
  },
  textDark: {
    color: DARK_COLOR,
  },
  textLight: {
    color: LIGHT_COLOR,
  },
})

export default defaultStyles
