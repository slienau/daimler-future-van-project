import React from 'react'
import PropTypes from 'prop-types'
import {Text, ListItem, Right, Body, Left, Thumbnail} from 'native-base'
import {StyleSheet} from 'react-native'

const LeaderListItem = props => {
  let userName = 'Max Mustermann'
  if (props.username) {
    userName = props.username
  }
  const idx = parseInt(props.place) + 1
  const uri =
    'https://www.thehindu.com/sci-tech/technology/internet/article17759222.ece/alternates/FREE_660/02th-egg-person'
  return (
    <ListItem thumbnail>
      <Left>
        <Thumbnail square source={{uri: uri}} />
      </Left>
      <Body>
        <Text>
          <Text style={styles.time}>
            {userName}
            {'\n'}
          </Text>
          {props.loyaltyPoints} Points
        </Text>
      </Body>
      <Right>
        <Text> {idx}. Place</Text>
      </Right>
    </ListItem>
  )
}

LeaderListItem.propTypes = {
  loyaltyPoints: PropTypes.number,
  place: PropTypes.string,
  username: PropTypes.string,
}

const styles = StyleSheet.create({
  time: {
    fontWeight: 'bold',
  },
})

export default LeaderListItem
