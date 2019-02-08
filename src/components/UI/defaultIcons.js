import styled from 'styled-components/native/dist/styled-components.native.esm'
import {Icon} from 'native-base'
import React from 'react'
import {DARK_COLOR} from './colors'

const StyledIcon = styled(Icon)`
  color: ${props => (props.color ? props.color : DARK_COLOR)};
`

export const LoyaltyPointsIcon = props => (
  <StyledIcon {...props} color="gold" name="star" active />
)

export const RewardsIcon = props => (
  <StyledIcon {...props} color="palegoldenrod" name="unlock" />
)

export const OrderHistoryIcon = props => (
  <StyledIcon {...props} color="black" name="list" type="Feather" />
)

export const LeaderboardIcon = props => (
  <StyledIcon {...props} color="darkblue" name="people" />
)

export const CO2SavingsIcon = props => (
  <StyledIcon {...props} color="darkgreen" name="trees" type="Foundation" />
)

export const DistanceIcon = props => <StyledIcon {...props} name="bus" />

export const StartVBSIcon = props => <StyledIcon {...props} name="pin" />

export const EndVBSIcon = props => <StyledIcon {...props} name="flag" />

export const NameIcon = props => <StyledIcon {...props} name="person" />

export const MailIcon = props => <StyledIcon {...props} name="mail" />

export const PaymentIcon = props => <StyledIcon {...props} name="card" />
