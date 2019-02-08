import {Body, Icon, Left, ListItem, Right} from 'native-base'
import {StyleSheet} from 'react-native'
import DefaultText from './DefaultText'
import {PropTypes} from 'prop-types'
import React from 'react'

const DefaultListItem = props => {
  let leftContent = null
  if (props.iconElement) leftContent = <Left>{props.iconElement}</Left>
  if (props.leftText)
    leftContent = (
      <Left>
        <DefaultText>{props.leftText}</DefaultText>
      </Left>
    )

  let bodyContent = null
  if (props.bodyElement) bodyContent = <Body>{props.bodyElement}</Body>
  if (props.bodyText)
    bodyContent = (
      <Body>
        <DefaultText>{props.bodyText}</DefaultText>
      </Body>
    )

  let rightContent = null
  if (props.rightText)
    rightContent = (
      <Right>
        <DefaultText greyColor>{props.rightText}</DefaultText>
      </Right>
    )
  if (props.onPress)
    rightContent = (
      <Right>
        <Icon name="arrow-forward" />
      </Right>
    )

  return (
    <ListItem
      icon={!!props.iconElement}
      button={!!props.onPress}
      onPress={props.onPress}
      style={!props.iconElement ? styles.listItemWithoutIcon : null}>
      {leftContent}
      {bodyContent}
      {rightContent}
    </ListItem>
  )
}

const styles = StyleSheet.create({
  listItemWithoutIcon: {
    paddingTop: 10,
    paddingBottom: 10,
  },
})

DefaultListItem.propTypes = {
  bodyElement: PropTypes.element,
  bodyText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  iconElement: PropTypes.element,
  leftText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onPress: PropTypes.func,
  rightText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default DefaultListItem
