import {Text, Body, Icon, Left, Right} from 'native-base'
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
  TextItalic,
} from '../StyledComponents'
import _ from 'lodash'
import React from 'react'
import CustomButton from '../../../../components/UI/CustomButton'

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
            <Text>
              Van departure: {this.props.departure}
              {'\n'}
              <TextItalic>{this.props.activeOrderStatus.message}</TextItalic>
            </Text>
            {/* <TextGreen note>{this.props.waitingTime}</TextGreen> */}
            {/* </Body> */}
            <Text />
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
            <CustomButton
              text="Hop On"
              onPress={() => this.props.onEnterVanPress()}
              disabled={
                !_.get(this.props.activeOrderStatus, 'userAllowedToEnter')
              }
            />
          </Right>
        </CardItemNoBorders>
      </StyledCard>
    )
  }
}

StartWalkCardLarge.propTypes = {
  activeOrderStatus: PropTypes.object,
  busStopStartName: PropTypes.string,
  departure: PropTypes.string,
  onEnterVanPress: PropTypes.func,
  vanId: PropTypes.number,
  waitingTime: PropTypes.string,
  walkingDistance: PropTypes.string,
  walkingDuration: PropTypes.string,
  zoomToStartWalk: PropTypes.func,
}

export default StartWalkCardLarge
