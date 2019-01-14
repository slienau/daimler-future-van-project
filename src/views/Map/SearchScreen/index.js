import React from 'react'
import {Image} from 'react-native'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import config from '../../../lib/config'
import {connect} from 'react-redux'
import {
  addSearchResultAction,
  changeMapState,
  MapState,
  setJourneyDestination,
  setJourneyStart,
} from '../../../ducks/map'
import _ from 'lodash'
import PropTypes from 'prop-types'

const SearchScreen = props => {
  const predefinedPlaces = _.uniqBy(props.searchResults, 'id')
  const animateToRegion = props.navigation.getParam('animateToRegion')
  const fitToCoordinates = props.navigation.getParam('fitToCoordinates')

  const onSearchResult = (data, details) => {
    const type = props.navigation.getParam('type')
    handleSearchResult(data, details, type)
  }

  const handleSearchResult = (data, details, type) => {
    if (!details) return

    // extract needed data from the search result and distinguish between current location or not
    // if current location, we dont want to add it to the list of last searches
    if (details.description === 'Current location') {
      // name field is not set for current location, so set it
      details.name = details.description
    } else {
      details.description = details.name
      props.addSearchResult(details)
    }
    const location = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    }
    if (type === 'DESTINATION') {
      handleDestinationSearchResult(details, location)
    } else if (type === 'START') {
      handleStartSearchResult(details, location)
    }
  }

  const handleDestinationSearchResult = (details, location) => {
    const journeyDestination = {
      location: location,
      title: details.name,
      description: details.vicinity,
    }
    if (props.mapState === MapState.INIT)
      props.changeMapState(MapState.SEARCH_ROUTES)
    props.setJourneyDestination(journeyDestination)
    // check whether start location is already set
    if (props.journeyStart != null) {
      // fit zoom to start and destination if so
      const coords = [location, props.journeyStart.location]
      fitToCoordinates(coords)
    } else {
      // otherwise, only zoom to destination
      animateToRegion(location)
    }
  }

  const handleStartSearchResult = (details, location) => {
    const journeyStart = {
      location: location,
      title: details.name,
      description: details.vicinity,
    }
    props.setJourneyStart(journeyStart)
    props.changeMapState(MapState.SEARCH_ROUTES)
    // check if destination is set
    if (props.journeyDestination != null) {
      // fit zoom to start and destination if so
      const coords = [location, props.journeyDestination.location]
      fitToCoordinates(coords)
    } else {
      // otherwise, only zoom to start
      animateToRegion(location)
    }
  }

  return (
    <GooglePlacesAutocomplete
      placeholder={'Search'}
      minLength={2} // minimum length of text to search
      autoFocus
      returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
      listViewDisplayed="true" // true/false/undefined
      fetchDetails
      renderDescription={row => row.description} // custom description render
      onPress={(data, details = null) => {
        onSearchResult(data, details)
        props.navigation.goBack()
      }}
      getDefaultValue={() => ''}
      query={{
        key: config.googleApiKey,
        language: 'en',
      }}
      styles={{
        textInputContainer: {
          backgroundColor: 'rgb(255,255,255)',
          borderBottomWidth: 2,
        },
        description: {
          // fontWeight: 'bold',
        },
        predefinedPlacesDescription: {
          color: '#000000',
        },
      }}
      currentLocation // Will add a 'Current location' button at the top of the predefined places list
      currentLocationLabel="Current location"
      nearbyPlacesAPI={'None'} // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      GoogleReverseGeocodingQuery={
        {
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        }
      }
      GooglePlacesSearchQuery={
        {
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          // rankby: 'distance'
        }
      }
      // filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
      predefinedPlaces={predefinedPlaces}
      debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
      renderLeftButton={() => (
        <Image
          source={{
            uri:
              'https://cdn1.iconfinder.com/data/icons/hawcons/32/698627-icon-111-search-512.png',
          }}
        />
      )}
      renderRightButton={() => (
        <Image
          source={{
            uri:
              'https://cdn1.iconfinder.com/data/icons/hawcons/32/698627-icon-111-search-512.png',
          }}
        />
      )}
    />
  )
}

SearchScreen.propTypes = {
  addSearchResult: PropTypes.func,
  changeMapState: PropTypes.func,
  journeyDestination: PropTypes.object,
  journeyStart: PropTypes.object,
  mapState: PropTypes.string,
  searchResults: PropTypes.array,
  setJourneyDestination: PropTypes.func,
  setJourneyStart: PropTypes.func,
}

export default connect(
  state => ({
    mapState: state.map.mapState,
    searchResults: state.map.searchResults,
    journeyStart: state.map.journeyStart,
    journeyDestination: state.map.journeyDestination,
  }),
  dispatch => ({
    addSearchResult: result => dispatch(addSearchResultAction(result)),
    changeMapState: payload => dispatch(changeMapState(payload)),
    setJourneyStart: payload => dispatch(setJourneyStart(payload)),
    setJourneyDestination: payload => dispatch(setJourneyDestination(payload)),
  })
)(SearchScreen)
