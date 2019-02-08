import styled from 'styled-components/native/dist/styled-components.native.esm'
import {Icon} from 'native-base'
import React from 'react'
import {DARK_COLOR} from './colors'

const StyledIcon = styled(Icon)`
  color: ${props => (props.color ? props.color : DARK_COLOR)};
`

export const LoyaltyPointsIcon = props => (
  <StyledIcon {...props} color="gold" name="star" />
)

export const RewardsIcon = props => (
  <StyledIcon {...props} color="palegoldenrod" name="unlock" />
)

export const BusIcon = props => (
  <StyledIcon {...props} color="dodgerblue" name="bus" />
)

export const PlanetIcon = props => (
  <StyledIcon {...props} color="gray" name="planet" />
)

export const LeaderboardIcon = props => (
  <StyledIcon {...props} color="darkblue" name="people" />
)

export const CO2SavingsIcon = props => (
  <StyledIcon {...props} color="darkgreen" name="trees" type="Foundation" />
)

export const NameIcon = props => <StyledIcon {...props} name="person" />

export const MailIcon = props => <StyledIcon {...props} name="mail" />

export const PaymentIcon = props => <StyledIcon {...props} name="card" />
