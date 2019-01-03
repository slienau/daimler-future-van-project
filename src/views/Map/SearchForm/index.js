import React from 'react'
import {View} from 'react-native'
import {Item, Input, Text} from 'native-base'
import PropTypes from 'prop-types'
import styled from 'styled-components/native'

const StyledSearchForm = styled(View)`
  position: absolute;
  right: 5%;
  left: 20%;
  top: 1%;
  padding: 1%
  background-color: white;
`

const SearchForm = props => {
  if (props.visible) {
    return (
      <StyledSearchForm>
        <Item onPress={props.onStartPress}>
          <Input placeholder="Click to set start" editable={false}>
            <Text>{props.startText}</Text>
          </Input>
        </Item>
        <Item onPress={props.onDestinationPress}>
          <Input placeholder="to" editable={false}>
            <Text>{props.destinationText}</Text>
          </Input>
        </Item>
      </StyledSearchForm>
    )
  } else {
    return null
  }
}

SearchForm.propTypes = {
  destinationText: PropTypes.string,
  onDestinationPress: PropTypes.func,
  onStartPress: PropTypes.func,
  startText: PropTypes.string,
}

export default SearchForm
