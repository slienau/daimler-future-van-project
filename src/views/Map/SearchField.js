import React from 'react'
import {Image} from 'react-native'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import * as act from '../../ducks/map'

/* const homePlace = {
  description: 'Home',
  geometry: {location: {lat: 48.8152937, lng: 2.4597668}},
}
const workPlace = {
  description: 'Work',
  geometry: {location: {lat: 48.8496818, lng: 2.2940881}},
} */

const SearchField = props => {
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
        // 'details' is provided when fetchDetails = true
        console.log(data, details)
        // add search to the global list of all search result and go back to the map view
        props.addSearchResult(details)
        props.navigation.goBack()
      }}
      getDefaultValue={() => ''}
      query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        key: 'AIzaSyDVR2sWwYcOY0gmCxXy2EjXOnaMW6VvELM',
        language: 'de', // language of the results
        // types: 'geocode' // default: 'geocode'
      }}
      styles={{
        textInputContainer: {
          backgroundColor: 'rgb(255,255,255)',
          borderBottomWidth: 2,
        },
        description: {
          fontWeight: 'bold',
        },
        predefinedPlacesDescription: {
          color: '#000000',
        },
      }}
      currentLocation // Will add a 'Current location' button at the top of the predefined places list
      currentLocationLabel="Current location"
      nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
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
      predefinedPlaces={props.map.searchResults.map(res => {
        return {description: res.name, geometry: res.geometry}
      })}
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

SearchField.propTypes = {
  addSearchResult: PropTypes.func,
  map: PropTypes.object,
}

const mapStateToProps = state => {
  return {
    map: state.map,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addSearchResult: result => {
      dispatch(act.addSearchResultAction(result))
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchField)
