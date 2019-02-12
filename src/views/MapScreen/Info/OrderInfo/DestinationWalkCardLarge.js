import {Text, Body, Icon, Left, Right} from 'native-base'
import PropTypes from 'prop-types'
import {
  StyledCard,
  CardItemNoBorders,
  IconCenterFlex,
  CardItemBorderBottom,
  LeftFlex,
  BodyFlex,
  RightAddress,
} from '../StyledComponents'
import React from 'react'
import geolib from 'geolib'
import {connect} from 'react-redux'
import {resetMapState} from '../../../../ducks/map'
import CustomButton from '../../../../components/UI/CustomButton'

class DestinationWalkCardLarge extends React.Component {
  componentDidMount() {
    this.props.zoomToDestinationWalk()
    const checkDestination = async () => {
      const distance = geolib.getDistance(
        this.props.currentUserLocation,
        this.props.destinationLocation
      )
<<<<<<< HEAD
      if (distance < 10) return this.props.resetMapState()
      setTimeout(checkDestination, 3000)
=======
      if (distance < 30) return this.props.toMapScreen()
      this.exitTimerId = setTimeout(checkDestination, 3000)
>>>>>>> fix: DestinationWalkCardLarge style
    }
    checkDestination()
  }

  componentWillUnmount() {
    clearTimeout(this.exitTimerId)
  }

  exitTimerId = null

  render() {
    return (
      <StyledCard>
        <CardItemNoBorders button onPress={this.props.zoomToDestinationWalk}>
          <LeftFlex>
            <Icon name="walk" />
            <BodyFlex>
              <Text>{this.props.walkingDuration}</Text>
              <Text note>{this.props.walkingDistance}</Text>
            </BodyFlex>
            <IconCenterFlex type="Entypo" name="arrow-long-right" />
          </LeftFlex>
          <RightAddress>
            <Text>{this.props.endAddress}</Text>
          </RightAddress>
        </CardItemNoBorders>
        <CardItemBorderBottom>
          <Left>
            <Icon name="pin" />
            {/* <Body> */}
            <Text>Destination arrival: {this.props.destArrival}</Text>
            {/* <TextGreen note>{this.props.waitingTime}</TextGreen> */}
            {/* </Body> */}
          </Left>
        </CardItemBorderBottom>
        <CardItemNoBorders>
          <Body />
          <Right>
            <CustomButton
              text="Stop Journey"
              onPress={() => this.props.resetMapState()}
            />
          </Right>
        </CardItemNoBorders>
      </StyledCard>
    )
  }
}

DestinationWalkCardLarge.propTypes = {
  currentUserLocation: PropTypes.object,
  destArrival: PropTypes.string,
  destinationLocation: PropTypes.object,
  endAddress: PropTypes.string,
<<<<<<< HEAD
  resetMapState: PropTypes.func,
  vanArrival: PropTypes.string,
  vanId: PropTypes.number,
=======
  toMapScreen: PropTypes.func,
>>>>>>> fix: DestinationWalkCardLarge style
  walkingDistance: PropTypes.string,
  walkingDuration: PropTypes.string,
  zoomToDestinationWalk: PropTypes.func,
}

export default connect(
  null,
  dispatch => ({
    resetMapState: () => dispatch(resetMapState()),
  })
)(DestinationWalkCardLarge)
