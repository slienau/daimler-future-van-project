import {Text, Body, Icon, Left, Right, Button} from 'native-base'
import PropTypes from 'prop-types'
import {
  StyledCard,
  CardItemNoBorders,
  StyledContainer,
  IconCenterFlex,
} from './StyledComponents'
import React from 'react'

class StartWalkCard extends React.Component {
  componentDidMount() {
    this.props.zoomToStartWalk()
    this.interval = setInterval(() => {
      console.log('TIMED')
      this.setState()
    }, 60000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return (
      <StyledContainer>
        <StyledCard>
          <CardItemNoBorders>
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
            {/* <Left> */}
            <Body>
              <Text>Van departure: {this.props.departure}</Text>
              <Text note>{this.props.waitingTime}</Text>
            </Body>
            {/* </Left> */}
          </CardItemNoBorders>
          <CardItemNoBorders>
            <Button rounded>
              <Text>Enter van</Text>
            </Button>
          </CardItemNoBorders>
        </StyledCard>
      </StyledContainer>
    )
  }
}

StartWalkCard.propTypes = {
  busStopStartName: PropTypes.string,
  departure: PropTypes.string,
  waitingTime: PropTypes.string,
  walkingDistance: PropTypes.string,
  walkingDuration: PropTypes.string,
  zoomToStartWalk: PropTypes.func,
}

export default StartWalkCard
