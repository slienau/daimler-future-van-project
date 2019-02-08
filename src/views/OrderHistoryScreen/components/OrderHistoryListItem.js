import React from 'react'
import PropTypes from 'prop-types'
import {Text, ListItem, Right, Icon, Body, View} from 'native-base'
import {StyleSheet} from 'react-native'
import DefaultText from '../../../components/UI/DefaultText'

const OrderHistoryListItem = props => {
  let bodyText = 'Order has been canceled'
  if (!props.order.canceled) {
    bodyText = (
      <View>
        <View style={styles.row}>
          <Text style={styles.leftColumn}>From:</Text>
          <Text style={styles.rightColumn}>{props.order.vanStartVBS.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.leftColumn}>To:</Text>
          <Text style={styles.rightColumn}>{props.order.vanEndVBS.name}</Text>
        </View>
      </View>
    )
  }
  return (
    <ListItem
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
})

export default OrderHistoryListItem
