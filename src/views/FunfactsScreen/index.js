import React from 'react'
import {
  Container,
  Content,
  ListItem,
  Text,
  Icon,
  Left,
  Body,
  Right,
} from 'native-base'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import _ from 'lodash'
import CustomListItemHeader from '../../components/UI/CustomListItemHeader'

const FunfactsScreen = props => {
  const co2savings = _.get(props.activeOrder, 'co2savings')
  return (
    <Container>
      <Content>
        <CustomListItemHeader title="Fun Facts" />
        <ListItem icon>
          <Left>
            <Icon active name="ios-leaf" />
          </Left>
          <Body>
            <Text>CO2 Savings</Text>
          </Body>
          <Right>
            <Text>{co2savings}</Text>
          </Right>
        </ListItem>
        <ListItem icon>
          <Left>
            <Icon active name="ios-flame" />
          </Left>
          <Body>
            <Text>Burnt calories</Text>
          </Body>
          <Right>
            <Text>54 Kcal</Text>
          </Right>
        </ListItem>
        <CustomListItemHeader title="Van Facts" />
        <ListItem icon>
          <Left>
            <Icon active name="ios-battery-charging" />
          </Left>
          <Body>
            <Text>Battery consumption</Text>
          </Body>
          <Right>
            <Text>58 %</Text>
          </Right>
        </ListItem>
        <ListItem icon>
          <Left>
            <Icon type="FontAwesome" name="rocket" />
          </Left>
          <Body>
            <Text>Highest Speed</Text>
          </Body>
          <Right>
            <Text>90 Km/h</Text>
          </Right>
        </ListItem>
        <ListItem icon>
          <Left>
            <Icon type="MaterialCommunityIcons" name="scale" />
          </Left>
          <Body>
            <Text>Weight</Text>
          </Body>
          <Right>
            <Text>1500 Kg</Text>
          </Right>
        </ListItem>
      </Content>
    </Container>
  )
}

FunfactsScreen.propTypes = {
  activeOrder: PropTypes.object,
}

const mapStateToProps = state => {
  return {
    activeOrder: state.orders.activeOrder,
  }
}

export default connect(mapStateToProps)(FunfactsScreen)
