import React from 'react'
import {Icon} from 'native-base'
import {
  CardItemBorderBottom,
  CardItemNoBorders,
  TextFlex,
  TextFlexGray,
  StyledTouchableOpacity,
  IconBlack,
} from './StyledComponents'

const SearchRoutes = props => {
  return (
    <>
      <CardItemBorderBottom button onPress={props.onStartPress}>
        <Icon type="MaterialIcons" name="location-on" />
        {props.startText ? (
          <TextFlex>{props.startText}</TextFlex>
        ) : (
          <TextFlexGray>{'Start...'}</TextFlexGray>
        )}
      </CardItemBorderBottom>
      <CardItemNoBorders button onPress={props.onDestinationPress}>
        <Icon type="MaterialCommunityIcons" name="flag-variant" />
        {props.destinationText ? (
          <TextFlex>{props.destinationText}</TextFlex>
        ) : (
          <TextFlexGray>{'Destination...'}</TextFlexGray>
        )}
        <StyledTouchableOpacity onPress={props.onSwapPress}>
          <IconBlack type="MaterialCommunityIcons" name="swap-vertical" />
        </StyledTouchableOpacity>
      </CardItemNoBorders>
    </>
  )
}

export default SearchRoutes
