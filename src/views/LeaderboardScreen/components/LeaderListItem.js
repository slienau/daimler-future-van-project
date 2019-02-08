import React from 'react'
import PropTypes from 'prop-types'
import {Text, ListItem, Right, Body, Left, Thumbnail} from 'native-base'
import {StyleSheet} from 'react-native'
import goldStatus from '../assets/gold.png'
import silverStatus from '../assets/silver.png'
import bronzeStatus from '../assets/bronze.png'

const LeaderListItem = props => {
  if (
    !(
      props.username &&
      props.loyaltyPoints &&
      props.leaderStatus &&
      props.place
    )
  )
    return null
  let userName = 'Max Mustermann'
  if (props.username) {
    userName = props.username
  }
  let statusIcon = bronzeStatus
  if (props.leaderStatus === 'gold') {
    statusIcon = goldStatus
  } else if (props.leaderStatus === 'silver') {
    statusIcon = silverStatus
  } else {
    statusIcon = bronzeStatus
  }
  const idx = parseInt(props.place) + 1
  const uri =
    'https://www.thehindu.com/sci-tech/technology/internet/article17759222.ece/alternates/FREE_660/02th-egg-person'
  return (
    <ListItem thumbnail>
      <Left>
        <Thumbnail large square source={{uri: uri}} />
      </Left>
      <Body>
        <Text>
          <Text style={styles.time}>
            {userName}
            {'\n'}
          </Text>
          {props.loyaltyPoints} Points{'\n'}
        </Text>
      </Body>
      <Right>
        <Text>
          <Text style={styles.time}>{idx}. Place</Text>
        </Text>
        <Thumbnail source={statusIcon} small />
      </Right>
    </ListItem>
  )
}

LeaderListItem.propTypes = {
  leaderStatus: PropTypes.string,
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
