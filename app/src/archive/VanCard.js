import React from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  Card,
  CardItem,
  Body,
  Icon,
  ListItem,
  Left,
  Button,
  Right,
} from 'native-base'
import {StyleSheet} from 'react-native'

const VanCard = props => {
  let bodyCardItem = null
  if (props.information !== '') {
    bodyCardItem = (
      <CardItem button onPress={props.onPress}>
        <Body style={styles.cardItemHeader}>
          <Icon name={props.icon} style={styles.iconSize} />
          <Text style={styles.cardItemText}>{props.header}</Text>
        </Body>
      </CardItem>
    )
  } else {
    bodyCardItem = (
      <CardItem>
        <Body>
          <Text style={styles.cardItemText}>{props.header}</Text>
          <ListItem icon>
            <Left>
              <Button>
                <Icon active name="globe" />
              </Button>
            </Left>
            <Body>
              <Text>Airplane Mode</Text>
            </Body>
            <Right>
              <Text>15:00 PM</Text>
            </Right>
          </ListItem>
        </Body>
      </CardItem>
    )
  }

  return <Card>{bodyCardItem}</Card>
}

VanCard.propTypes = {
  header: PropTypes.string,
  icon: PropTypes.string,
  information: PropTypes.string,
  onPress: PropTypes.func,
}

const styles = StyleSheet.create({
  cardItemHeader: {
    alignItems: 'center',
  },
  cardItemText: {
    fontSize: 21,
  },
  iconSize: {
    fontSize: 65,
  },
})

export default VanCard
