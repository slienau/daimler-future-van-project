import {Text, Body, Icon, Left, Right, Button} from 'native-base'
import PropTypes from 'prop-types'
import {
  StyledCard,
  CardItemNoBorders,
  StyledContainer,
  IconCenterFlex,
  TextGreen,
} from '../StyledComponents'
import React from 'react'

class StartWalkCardLarge extends React.Component {
  componentDidMount() {
    this.props.zoomToStartWalk()
  }

  render() {
    return (
      <StyledContainer>
        <StyledCard>
          <CardItemNoBorders button onPress={this.props.zoomToStartWalk}>
            <Left>
              <Icon name="walk" />
              <Body>
                <Text>{this.props.walkingDuration}</Text>
                <Text note>{this.props.walkingDistance}</Text>
              </Body>
            </Left>
            <IconCenterFlex type="Entypo" name="arrow-long-right" />
            <Right>
              <Text>{this.props.busStopStartName}</Text>
            </Right>
          </CardItemNoBorders>
          <CardItemNoBorders>
            <Body>
              <Text>Van departure: {this.props.departure}</Text>
              <TextGreen note>{this.props.waitingTime}</TextGreen>
            </Body>
            <Button rounded disabled>
              <Text>Hop on</Text>
            </Button>
          </CardItemNoBorders>
        </StyledCard>
      </StyledContainer>
    )
  }
}

StartWalkCardLarge.propTypes = {
  busStopStartName: PropTypes.string,
  departure: PropTypes.string,
  waitingTime: PropTypes.string,
  walkingDistance: PropTypes.string,
  walkingDuration: PropTypes.string,
  zoomToStartWalk: PropTypes.func,
}

export default StartWalkCardLarge
