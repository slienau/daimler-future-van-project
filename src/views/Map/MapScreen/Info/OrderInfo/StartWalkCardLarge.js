import {Text, Body, Icon, Left, Right, Button} from 'native-base'
import PropTypes from 'prop-types'
import {
  StyledCard,
  CardItemNoBorders,
  IconCenterFlex,
  TextGreen,
  TextDarkGray,
  ViewCentered,
  TextLarge,
  CardItemBorderBottom,
} from '../StyledComponents'
import React from 'react'

class StartWalkCardLarge extends React.Component {
  componentDidMount() {
    this.props.zoomToStartWalk()
  }

  render() {
    return (
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
        <CardItemBorderBottom>
          <Left>
            <Icon name="bus" />
            {/* <Body> */}
            <Text>Van departure: {this.props.departure}</Text>
            {/* <TextGreen note>{this.props.waitingTime}</TextGreen> */}
            {/* </Body> */}
          </Left>
          <Right>
            <TextGreen note>{this.props.waitingTime}</TextGreen>
          </Right>
        </CardItemBorderBottom>
        <CardItemNoBorders>
          <Body>
            <ViewCentered>
              <TextLarge>{this.props.vanId}</TextLarge>
              <TextDarkGray>Van number</TextDarkGray>
            </ViewCentered>
          </Body>
          <Right>
            <Button rounded disabled>
              <Text>Hop on</Text>
            </Button>
          </Right>
        </CardItemNoBorders>
      </StyledCard>
    )
  }
}

StartWalkCardLarge.propTypes = {
  busStopStartName: PropTypes.string,
  departure: PropTypes.string,
  vanId: PropTypes.number,
  waitingTime: PropTypes.string,
  walkingDistance: PropTypes.string,
  walkingDuration: PropTypes.string,
  zoomToStartWalk: PropTypes.func,
}

export default StartWalkCardLarge
