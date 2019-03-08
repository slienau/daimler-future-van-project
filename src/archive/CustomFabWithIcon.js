import {StyleSheet} from 'react-native'
import {Fab, Icon} from 'native-base'
import React from 'react'
import PropTypes from 'prop-types'
import {DARK_COLOR, LIGHT_COLOR} from '../components/UI/colors'

const CustomFabWithIcon = props => {
  return (
    <Fab onPress={props.onPress} position={props.position} style={styles.fab}>
      <Icon name={props.icon} style={styles.icon} />
    </Fab>
  )
}

// Icon style didn't work with styled-components
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    backgroundColor: DARK_COLOR,
  },
  icon: {
    color: LIGHT_COLOR,
    fontSize: 28,
  },
})

CustomFabWithIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  position: PropTypes.string.isRequired,
}

export default CustomFabWithIcon
