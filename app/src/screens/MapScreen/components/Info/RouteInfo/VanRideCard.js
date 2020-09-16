import {Text, Icon} from 'native-base'
import {
  CardItemNoBorders,
  IconCenterFlex,
  StyledCardFlex,
  RightAddress,
  LeftFlex,
  BodyFlex,
} from '../StyledComponents'
import React from 'react'
import PropTypes from 'prop-types'

const VanRideCard = props => {
  return (
    <StyledCardFlex>
      <CardItemNoBorders>
        <LeftFlex>
          <Icon type="MaterialCommunityIcons" name="van-passenger" />
          <BodyFlex>
            <Text>{props.vanDuration}</Text>
            <Text note>{props.vanDistance}</Text>
          </BodyFlex>
          <IconCenterFlex type="Entypo" name="arrow-long-right" />
        </LeftFlex>
        <RightAddress>
          <Text>{props.busStopEndName}</Text>
        </RightAddress>
      </CardItemNoBorders>
    </StyledCardFlex>
  )
}

VanRideCard.propTypes = {
  busStopEndName: PropTypes.string,
  vanDistance: PropTypes.string,
  vanDuration: PropTypes.string,
}

export default VanRideCard
