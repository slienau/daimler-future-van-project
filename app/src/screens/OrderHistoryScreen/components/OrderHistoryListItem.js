import React from 'react'
import PropTypes from 'prop-types'
import {ListItem, Right, Icon, Body, View} from 'native-base'
import {StyleSheet} from 'react-native'
import DefaultText from '../../../components/UI/DefaultText'

const OrderHistoryListItem = props => {
  let bodyText = <DefaultText>Order has been canceled</DefaultText>
  if (!props.order.canceled) {
    bodyText = (
      <View>
        <View style={styles.row}>
          <DefaultText style={styles.leftColumn}>From:</DefaultText>
          <DefaultText style={styles.rightColumn}>
            {props.order.vanStartVBS.name}
          </DefaultText>
        </View>
        <View style={styles.row}>
          <DefaultText style={styles.leftColumn}>To:</DefaultText>
          <DefaultText style={styles.rightColumn}>
            {props.order.vanEndVBS.name}
          </DefaultText>
        </View>
      </View>
    )
  }
  return (
    <ListItem
      style={styles.listItem}
      button
      onPress={() => {
        if (!props.order.canceled) props.onItemPress()
      }}>
      <Body>
        <View>
          <DefaultText style={styles.time}>
            {props.order.orderTime.format('L, LT')}
          </DefaultText>
          {bodyText}
        </View>
      </Body>
      <Right>{!props.order.canceled && <Icon name="arrow-forward" />}</Right>
    </ListItem>
  )
}

OrderHistoryListItem.propTypes = {
  onItemPress: PropTypes.func,
  order: PropTypes.object,
}

const styles = StyleSheet.create({
  time: {
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 3,
  },
  listItem: {
    paddingTop: 5,
    paddingBottom: 10,
  },
})

export default OrderHistoryListItem
