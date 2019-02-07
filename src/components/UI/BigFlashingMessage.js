import DefaultText from './DefaultText'
import defaultStyles from './defaultStyles'
import React from 'react'
import {Animated} from 'react-native'
import PropTypes from 'prop-types'

class BigFlashingMessage extends React.Component {
  state = {
    animation: new Animated.Value(1),
  }

  componentDidMount() {
    this.cycleAnimation()
  }

  cycleAnimation() {
    Animated.sequence([
      Animated.timing(this.state.animation, {
        toValue: 0.5,
        duration: 500,
        delay: 700,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.animation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      this.cycleAnimation()
    })
  }

  render() {
    return (
      <Animated.View
        style={{
          opacity: this.state.animation,
        }}>
        <DefaultText
          style={[
            defaultStyles.textCenter,
            defaultStyles.textBold,
            defaultStyles.textLarge,
            defaultStyles.textLight,
          ]}>
          {this.props.message}.
        </DefaultText>
      </Animated.View>
    )
  }
}

BigFlashingMessage.propTypes = {
  message: PropTypes.string,
}

export default BigFlashingMessage
