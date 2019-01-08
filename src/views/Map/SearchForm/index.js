import React from 'react'
import {View, TouchableOpacity} from 'react-native'
import {
  Text,
  Card,
  CardItem,
  Body,
  Content,
  Icon,
  Left,
  Right,
} from 'native-base'
import PropTypes from 'prop-types'
import styled from 'styled-components/native'
import moment from 'moment'
import {MapState} from '../../../ducks/map'

const StyledSearchForm = styled(View)`
  position: absolute;
  right: 0.5%;
  left: 0.5%;
  top: -1%;
`
const StyledTouchableOpacity = styled(TouchableOpacity)`
  align-self: flex-end;
`

const TextFlex = styled(Text)`
  flex: 1;
`
const TextFlexGray = styled(Text)`
  color: gray;
  flex: 1;
`
const TextDarkGray = styled(Text)`
  color: rgb(90, 90, 90);
`
const TextBoldBlue = styled(Text)`
  color: #3f51b5;
  font-weight: bold;
`

const IconBlack = styled(Icon)`
  color: black;
  font-size: 26;
`

const StyledCard = styled(Card)`
  border-radius: 10;
  align-items: stretch;
`
const CardItemBorderBottom = styled(CardItem)`
  border-radius: 10;
  border-bottom-width: 1;
  border-bottom-color: rgb(230, 230, 230);
`
const CardItemNoBorders = styled(CardItem)`
  border-radius: 10;
`

const SearchForm = props => {
  const parseDeparture = () => {
    const date = moment(props.departure)
    return date.format('HH:mm')
  }

  const calculateDuration = () => {
    const start = moment(props.departure)
    const end = moment(props.arrival)
    const diff = end.diff(start)
    return moment.utc(diff).format('HH:mm')
  }

  const calculateWaitingTime = () => {
    const start = moment()
    const end = moment(props.departure)
    return start.to(end)
  }

  if (props.mapState === MapState.SEARCH_ROUTES) {
    return (
      <StyledSearchForm>
        <Content padder>
          <StyledCard>
            <CardItemBorderBottom button onPress={props.onStartPress}>
              <Icon type="MaterialIcons" name="location-on" />
              {props.startText ? (
                <TextFlex>{props.startText}</TextFlex>
              ) : (
                <TextFlexGray>{'Start...'}</TextFlexGray>
              )}
            </CardItemBorderBottom>
            <CardItemNoBorders button onPress={props.onDestinationPress}>
              <Icon type="MaterialCommunityIcons" name="flag-variant" />
              {props.destinationText ? (
                <TextFlex>{props.destinationText}</TextFlex>
              ) : (
                <TextFlexGray>{'Destination...'}</TextFlexGray>
              )}
              <StyledTouchableOpacity onPress={props.onSwapPress}>
                <IconBlack type="MaterialCommunityIcons" name="swap-vertical" />
              </StyledTouchableOpacity>
            </CardItemNoBorders>
          </StyledCard>
        </Content>
      </StyledSearchForm>
    )
  } else if (props.mapState === MapState.ROUTE_SEARCHED) {
    return (
      <StyledSearchForm>
        <Content padder>
          <StyledCard>
            <CardItemBorderBottom>
              <Icon type="MaterialIcons" name="location-on" />
              <TextDarkGray>{props.startText}</TextDarkGray>
              <Right />
            </CardItemBorderBottom>
            <CardItemBorderBottom>
              <Icon type="MaterialCommunityIcons" name="flag-variant" />
              <TextDarkGray>{props.destinationText}</TextDarkGray>
              <Right />
            </CardItemBorderBottom>

            <CardItemNoBorders>
              <Left>
                <Body>
                  <TextBoldBlue>Departure: {parseDeparture()}</TextBoldBlue>
                  <TextBoldBlue note>{calculateWaitingTime()}</TextBoldBlue>
                </Body>
              </Left>
              <Right>
                <TextBoldBlue>Duration: {calculateDuration()}</TextBoldBlue>
              </Right>
            </CardItemNoBorders>
          </StyledCard>
        </Content>
      </StyledSearchForm>
    )
  } else {
    return null
  }
}

SearchForm.propTypes = {
  arrival: PropTypes.string,
  departure: PropTypes.string,
  destinationText: PropTypes.string,
  mapState: PropTypes.string,
  onDestinationPress: PropTypes.func,
  onStartPress: PropTypes.func,
  onSwapPress: PropTypes.func,
  startText: PropTypes.string,
}

export default SearchForm
