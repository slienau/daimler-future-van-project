import DefaultText from '../../../components/UI/DefaultText'
import defaultStyles from '../../../components/UI/defaultStyles'
import React from 'react'
import {Animated} from 'react-native'
import PropTypes from 'prop-types'

class RemainingTimeMessage extends React.Component {
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
      }),
      Animated.timing(this.state.animation, {
        toValue: 1,
        duration: 500,
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
          Van will arrive {this.props.message}.
        </DefaultText>
      </Animated.View>
    )
  }
}

RemainingTimeMessage.propTypes = {
  message: PropTypes.string,
}

export default RemainingTimeMessage
