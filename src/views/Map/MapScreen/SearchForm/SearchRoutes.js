import React from 'react'
import {Icon, Right, Left} from 'native-base'
import {StyleSheet} from 'react-native'
import {
  CardItemBorderBottom,
  TextFlex,
  TextFlexGray,
  StyledTouchableOpacity,
  StyledNumericInput,
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
      <CardItemBorderBottom button onPress={props.onDestinationPress}>
        <Icon type="MaterialCommunityIcons" name="flag-variant" />
        {props.destinationText ? (
          <TextFlex>{props.destinationText}</TextFlex>
        ) : (
          <TextFlexGray>{'Destination...'}</TextFlexGray>
        )}
        <StyledTouchableOpacity onPress={props.onSwapPress}>
          <IconBlack type="MaterialCommunityIcons" name="swap-vertical" />
        </StyledTouchableOpacity>
      </CardItemBorderBottom>
      <CardItemBorderBottom>
        <Left>
          <Icon name="man" />
        </Left>
        <Right>
          <StyledNumericInput
            onChange={value => props.onAddPersonPress(value)}
            totalWidth={140}
            totalHeight={30}
            iconSize={25}
            minValue={1}
            maxValue={8}
            initValue={props.personvalue}
            value={props.personvalue}
            rounded
            textColor="#B0228C"
            iconStyle={styles.numericInputIconColor}
            rightButtonBackgroundColor="#32CD32"
            leftButtonBackgroundColor="#FF0000"
          />
        </Right>
      </CardItemBorderBottom>
    </>
  )
}

const $whiteColor = '#FFFFFF'
const styles = StyleSheet.create({
  numericInputIconColor: {
    color: $whiteColor,
  },
})

export default SearchRoutes
