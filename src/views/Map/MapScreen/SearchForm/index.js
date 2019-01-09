import React from 'react'
import {Content} from 'native-base'
import PropTypes from 'prop-types'
import moment from 'moment'
import {MapState} from '../../../../ducks/map'
import {StyledSearchForm, StyledCard} from './StyledComponents'
import RouteSearched from './RouteSearched'
import SearchRoutes from './SearchRoutes'
import {connect} from 'react-redux'
import _ from 'lodash'

const SearchForm = props => {
  const parseDeparture = () => {
    if (!props.routes || !props.routes.length) return

    const departure = _.get(props.routes[0], 'vanStartTime')
    const date = moment(departure)
    return date.format('HH:mm')
  }

  const calculateDuration = () => {
    if (!props.routes || !props.routes.length) return

    const departure = _.get(props.routes[0], 'vanStartTime')
    const arrival = _.get(props.routes[0], 'destinationTime')
    const start = moment(departure)
    const end = moment(arrival)
    const diff = end.diff(start)
    return moment.utc(diff).format('HH:mm')
  }

  const calculateWaitingTime = () => {
    if (!props.routes || !props.routes.length) return

    const departure = _.get(props.routes[0], 'vanStartTime')
    const start = moment()
    const end = moment(departure)
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

const mapStateToProps = state => {
  return {
    mapState: state.map.mapState,
    routes: state.map.routes,
  }
}

SearchForm.propTypes = {
  destinationText: PropTypes.string,
  mapState: PropTypes.string,
  onDestinationPress: PropTypes.func,
  onStartPress: PropTypes.func,
  onSwapPress: PropTypes.func,
  routes: PropTypes.array,
  startText: PropTypes.string,
}

export default connect(
  mapStateToProps,
  null
)(SearchForm)
