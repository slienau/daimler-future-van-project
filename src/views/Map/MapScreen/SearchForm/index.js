import React from 'react'
import {Content} from 'native-base'
import PropTypes from 'prop-types'
import moment from 'moment'
import {MapState} from '../../../../ducks/map'
import {StyledSearchForm, StyledCard} from './StyledComponents'
import RouteSearched from './RouteSearched'
import SearchRoutes from './SearchRoutes'

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

  let content = null
  switch (props.mapState) {
    case MapState.SEARCH_ROUTES:
      content = (
        <SearchRoutes
          onStartPress={props.onStartPress}
          onDestinationPress={props.onDestinationPress}
          startText={props.startText}
          destinationText={props.destinationText}
          onSwapPress={props.onSwapPress}
        />
      )
      break
    case MapState.ROUTE_SEARCHED:
      content = (
        <RouteSearched
          startText={props.startText}
          destinationText={props.destinationText}
          departureTime={parseDeparture()}
          waitingTime={calculateWaitingTime()}
          durationTime={calculateDuration()}
        />
      )
      break
    default:
      return null
  }

  return (
    <StyledSearchForm>
      <Content padder>
        <StyledCard>{content}</StyledCard>
      </Content>
    </StyledSearchForm>
  )
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
