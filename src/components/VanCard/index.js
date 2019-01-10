import React from 'react'
import PropTypes from 'prop-types'
import {Image} from 'react-native'

import {Text, Card, CardItem, Body, Icon} from 'native-base'

const images = {
  destination: require('./assets/destination.png'),
  person: require('./assets/person.png'),
  van: require('./assets/van.png'),
  vbs: require('./assets/vbs.png'),
}

const VanCard = props => {
  return (
    <Card>
      <CardItem header>
        <Icon name={props.icon} />
        <Text>{props.header}</Text>
      </CardItem>
      <CardItem>
        <Body>
          <Image source={images[props.image]} />
          <Text>{props.description}</Text>
        </Body>
      </CardItem>
    </Card>
  )
}

VanCard.propTypes = {
  description: PropTypes.string,
  header: PropTypes.string,
  icon: PropTypes.string,
  image: PropTypes.string,
}

export default VanCard
