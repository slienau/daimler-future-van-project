import {View} from 'react-native'
import {Text, Card, CardItem, Icon, Body, Left} from 'native-base'
import styled from 'styled-components/native'

export const StyledRouteInfo = styled(View)`
  align-self: center;
  flex: 2;
  width: 98%;
`
export const StyledOrderInfo = styled(View)`
  align-self: center;
  width: 98%;
`

export const ViewCentered = styled(View)`
  align-items: center;
`

export const IconCenterFlex = styled(Icon)`
  align-items: center;
  flex: 1;
`

export const RightAddress = styled(Text)`
  flex: 2;
`
export const BodyFlex = styled(Body)`
  flex: 2;
`
export const LeftFlex = styled(Left)`
  flex: 2;
`

export const TextFlex = styled(Text)`
  flex: 1;
`
export const TextFlexGray = styled(Text)`
  color: gray;
  flex: 1;
`
export const TextDarkGray = styled(Text)`
  color: rgb(90, 90, 90);
`
export const TextBoldBlue = styled(Text)`
  color: #3f51b5;
  font-weight: bold;
`
export const TextGreen = styled(Text)`
  color: green;
  font-weight: bold;
`
export const TextLarge = styled(Text)`
  font-size: 35;
`

export const TextItalic = styled(Text)`
  font-style: italic;
`

export const IconBlack = styled(Icon)`
  color: black;
  font-size: 26;
`

export const StyledCard = styled(Card)`
  border-radius: 10;
  width: 100%;
`
export const StyledCardFlex = styled(Card)`
  border-radius: 10;
  width: 100%;
  flex: 1;
`

export const CardItemBorderBottom = styled(CardItem)`
  border-radius: 10;
  border-bottom-width: 1;
  border-bottom-color: rgb(230, 230, 230);
`
export const CardItemNoBorders = styled(CardItem)`
  border-radius: 10;
`
