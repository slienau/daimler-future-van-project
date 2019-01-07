import React from 'react'
import {Button, Text, Icon} from 'native-base'
import PropTypes from 'prop-types'
import styled from 'styled-components/native'

const StyledButton = styled(Button)`
  position: absolute;
  left: ${props => props.left || '30%'};
  right: ${props => props.right || '30%'};
  bottom: ${props => props.bottom || '0%'};
  display: flex;
  justify-content: center;
`

// const StyledPlaceOrderButton = styled(Button)`
//   position: absolute;
//   right: 10%;
//   left: 50%;
//   bottom: 3%;
// `

const BottomButton = props => {
  if (props.visible) {
    return (
      <StyledButton
        left={props.left}
        right={props.right}
        bottom={props.bottom}
        rounded
        light
        onPress={props.addFunc}>
        <Text>{props.text} </Text>
        <Icon name={props.iconName} />
      </StyledButton>
    )
  } else {
    return null
  }
}

BottomButton.propTypes = {
  addFunc: PropTypes.func,
  bottom: PropTypes.string,
  iconName: PropTypes.string,
  left: PropTypes.string,
  right: PropTypes.string,
  text: PropTypes.string,
  visible: PropTypes.bool,
}

export default BottomButton
