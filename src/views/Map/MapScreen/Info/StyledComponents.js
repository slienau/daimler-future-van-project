import {View} from 'react-native'
import {Text, Card, Container, CardItem, Icon} from 'native-base'
import styled from 'styled-components/native'

export const StyledRouteInfo = styled(View)`
  height: 15%;
  margin-top: 560;
`
export const StyledOrderInfo = styled(View)`
  position: absolute;
  bottom: 0%;
  left: 1%;
  right: -1%;
`

export const ViewCentered = styled(View)`
  align-items: center;
`

export const StyledContainer = styled(Container)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0);
`

export const IconCenterFlex = styled(Icon)`
  align-items: center;
  flex: 1;
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

export const IconBlack = styled(Icon)`
  color: black;
  font-size: 26;
`

export const StyledCard = styled(Card)`
  border-radius: 10;
  align-items: stretch;
  width: 97%;
`
export const StyledCardFlex = styled(Card)`
  border-radius: 10;
  align-items: stretch;
  flex: 1;
  width: 97%;
`

export const CardItemBorderBottom = styled(CardItem)`
  border-radius: 10;
  border-bottom-width: 1;
  border-bottom-color: rgb(230, 230, 230);
`
export const CardItemNoBorders = styled(CardItem)`
  border-radius: 10;
`
