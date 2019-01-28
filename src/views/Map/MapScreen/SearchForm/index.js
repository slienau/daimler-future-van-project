import React from 'react'
import {Content} from 'native-base'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  MapState,
  swapJourneyStartAndDestination,
  setPersonCount,
} from '../../../../ducks/map'
import {StyledSearchForm, StyledCard} from './StyledComponents'
import RouteSearched from './RouteSearched'
import SearchRoutes from './SearchRoutes'
import {connect} from 'react-redux'
import _ from 'lodash'

const SearchForm = props => {
  const parseDeparture = () => {
    if (!props.routes || !props.routes.length) return

    const departure = _.get(props.routes[0], 'vanETAatStartVBS')
    const date = moment(departure)
    return date.format('HH:mm')
  }

  const calculateDuration = () => {
    if (!props.routes || !props.routes.length) return

    const departure = _.get(props.routes[0], 'vanETAatStartVBS')
    const arrival = _.get(props.routes[0], 'userETAatUserDestinationLocation')
    const start = moment(departure)
    const end = moment(arrival)
    const diff = end.diff(start)
    return moment.utc(diff).format('HH:mm')
  }

  const calculateWaitingTime = () => {
    if (!props.routes || !props.routes.length) return

    const departure = _.get(props.routes[0], 'vanETAatStartVBS')
    const start = moment()
    const end = moment(departure)
    return start.to(end)
  }

  const destinationText = _.get(props.userDestinationLocation, 'title')
  const startText = _.get(props.userStartLocation, 'title')
  const personCount = props.personCount

  let content = null
  switch (props.mapState) {
    case MapState.SEARCH_ROUTES:
      content = (
        <SearchRoutes
          onStartPress={() => props.toSearchView('START')}
          onDestinationPress={() => props.toSearchView('DESTINATION')}
          startText={startText}
          destinationText={destinationText}
          onSwapPress={() => props.swapJourneyStartAndDestination()}
          setPersonCount={p => props.setPersonCount(p)}
          personCount={personCount}
        />
      )
      break
    case MapState.ROUTE_SEARCHED:
      content = (
        <RouteSearched
          startText={startText}
          destinationText={destinationText}
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
  mapState: PropTypes.string,
  personCount: PropTypes.number,
  routes: PropTypes.array,
  setPersonCount: PropTypes.func,
  swapJourneyStartAndDestination: PropTypes.func,
  toSearchView: PropTypes.func,
  userDestinationLocation: PropTypes.object,
  userStartLocation: PropTypes.object,
}

const mapStateToProps = state => {
  return {
    personCount: state.map.personCount,
    mapState: state.map.mapState,
    routes: state.map.routes,
    userStartLocation: state.map.userStartLocation,
    userDestinationLocation: state.map.userDestinationLocation,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    swapJourneyStartAndDestination: () =>
      dispatch(swapJourneyStartAndDestination()),
    setPersonCount: persons => dispatch(setPersonCount(persons)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchForm)
