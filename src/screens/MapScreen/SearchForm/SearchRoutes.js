import React from 'react'
import {Icon, Right, Left} from 'native-base'
import {StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import {
  CardItemBorderBottom,
  TextFlex,
  TextFlexGray,
  StyledTouchableOpacity,
  StyledNumericInput,
  IconBlack,
} from './StyledComponents'
import {DARK_COLOR, LIGHT_COLOR} from '../../../components/UI/colors'

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
            onChange={value => props.setPersonCount(value)}
            totalWidth={140}
            totalHeight={30}
            iconSize={25}
            minValue={1}
            maxValue={8}
            initValue={props.personCount}
            value={props.personCount}
            rounded
            textColor={DARK_COLOR}
            iconStyle={styles.numericInputIconColor}
            rightButtonBackgroundColor={DARK_COLOR}
            leftButtonBackgroundColor={DARK_COLOR}
          />
        </Right>
      </CardItemBorderBottom>
    </>
  )
}

const styles = StyleSheet.create({
  numericInputIconColor: {
    color: LIGHT_COLOR,
  },
})

SearchRoutes.propTypes = {
  destinationText: PropTypes.string,
  onDestinationPress: PropTypes.func,
  onStartPress: PropTypes.func,
  onSwapPress: PropTypes.func,
  personCount: PropTypes.number,
  setPersonCount: PropTypes.func,
  startText: PropTypes.string,
}

export default SearchRoutes
