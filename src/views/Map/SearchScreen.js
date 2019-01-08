import React from 'react'
import {Image} from 'react-native'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import config from '../../lib/config'

const SearchScreen = props => {
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
        props.navigation.getParam('onSearchResult', () => {})(data, details)
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
      predefinedPlaces={props.navigation.getParam('predefinedPlaces', [])}
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

export default SearchScreen
