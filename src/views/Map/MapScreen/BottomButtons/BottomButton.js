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

const BottomButton = props => {
  if (props.visible) {
    return (
      <StyledButton
        left={props.left}
        right={props.right}
        bottom={props.bottom}
        rounded
        light
        onPress={props.onPress}>
        {props.text != null && <Text>{props.text} </Text>}
        <Icon name={props.iconName} />
      </StyledButton>
    )
  } else {
    return null
  }
}

BottomButton.propTypes = {
  bottom: PropTypes.string,
  iconName: PropTypes.string,
  left: PropTypes.string,
  onPress: PropTypes.func,
  right: PropTypes.string,
  text: PropTypes.string,
  visible: PropTypes.bool,
}

export default BottomButton
