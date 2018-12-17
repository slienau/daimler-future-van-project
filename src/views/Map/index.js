import React from 'react'
import {Alert} from 'react-native'
import styled from 'styled-components/native'
import MapView from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import PropTypes from 'prop-types'
import Marker from './Marker'
import SearchForm from '../Map/SearchForm'
import BottomButtons from '../Map/BottomButtons'
import {virtualBusStops, vanPositions} from './markerPositions'
import {createStackNavigator} from 'react-navigation'
import SearchView from './SearchField'
import {connect} from 'react-redux'
import * as act from '../../ducks/map'
import {Container, Icon, Fab} from 'native-base'

/* const StyledContainer = styled(Container)`
  flex: 1;
  align-items: center;
  justify-content: center;
` */

const StyledMapView = styled(MapView)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin-bottom: ${props => props.marginBottom};
`

// For bottom button
// const StyledButton = styled(Button)`
//   position: absolute;
//   left: 30%;
//   right: 30%;
//   bottom: 4%;
// `
//
// const StyledCancelOrderButton = styled(Button)`
//   position: absolute;
//   left: 15%;
//   right: 70%;
//   bottom: 3%;
// `

// const StyledTestButton = styled(Button)`
//   position: absolute;
//   left: 30%;
//   right: ${props => props.percent}%;
//   bottom: 4%;
// `

// For bottom button
/* const StyledFab = styled(Fab)`
  margin-bottom: 55px;
` */
// For bottom button
const StyledMenu = styled(Fab)`
  margin-top: 5px;
  background-color: gray;
`

const StyledFab = styled(Fab)`
  margin-bottom: 55;
`
// Some static cords
// const coordinates = [
//   {
//     latitude: 52.509663,
//     longitude: 13.376481,
//   },
//   {
//     latitude: 52.507334,
//     longitude: 13.332367,
//   },
// ]

const GOOGLE_MAPS_APIKEY = 'AIzaSyBf-YuW1Wgm-ZxzKq9tkqlQH7fO39ADutA'

class Map extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      marginBottom: 1,
      userLocationMarker: null,
      cancelOrderButton: null,
      destinationMarker: null,
      placeOrderButton: null,
      destinationButton: 'destination',
      searchFormVisible: false,
      routing: null,
      error: null,
      marker: {
        region: {
          latitude: 52.509663,
          longitude: 13.376481,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        },
      },
    }

    // called whenever we return to the map view from the SearchField view (from the StackNavigator)
    props.navigation.addListener('didFocus', payload => {
      console.log('FOCUSSED', payload)
      console.log(
        this.props.map.searchResults,
        this.props.map.searchResults.map(item => item.isNew)
      )
      const len = this.props.map.searchResults.length
      console.log('props:', this.props)
      if (len > 0) {
        const lastSearchResult = this.props.map.searchResults[len - 1]
        if (lastSearchResult.isNew) {
          this.destinationMarker = (
            <Marker
              location={{
                latitude: lastSearchResult.geometry.location.lat,
                longitude: lastSearchResult.geometry.location.lng,
              }}
              title={lastSearchResult.name}
              description={lastSearchResult.vicinity}
              image="destination"
            />
          )
          // this.routing = (
          //   <MapViewDirections
          //     origin={{
          //       latitude: this.state.currentLatitude,
          //       longitude: this.state.currentLongitude,
          //     }}
          //     destination={{
          //       latitude: lastSearchResult.geometry.location.lat,
          //       longitude: lastSearchResult.geometry.location.lng,
          //     }}
          //     apikey={GOOGLE_MAPS_APIKEY}
          //     strokeWidth={3}
          //     strokeColor="blue"
          //     mode="driving"
          //   />
          // )
          this.cancelOrderButton = (
            <BottomButtons
              addFunc={() =>
                Alert.alert(
                  'Cancel Order',
                  'Are you sure to cancel your order?',
                  [
                    {
                      text: 'Yes',
                      onPress: () => console.log('Yes Pressed'),
                      style: 'cancel',
                    },
                    {text: 'No', onPress: () => console.log('No Pressed')},
                  ],
                  {cancelable: false}
                )
              }
              iconName="arrow-back"
              left="15%"
              right="70%"
              bottom="3%"
            />
          )
          this.placeOrderButton = (
            <BottomButtons
              iconRight
              addFunc={() => this.searchRoute()}
              text="Search Route"
              iconName="arrow-forward"
              left="40%"
              right="10%"
              bottom="3%"
            />
          )
          this.destinationButton = null
          this.setState({
            placeOrderButton: 'placeOrder',
            destinationButton: null,
            searchFormVisible: true,
            marker: {
              region: {
                latitude: lastSearchResult.geometry.location.lat,
                longitude: lastSearchResult.geometry.location.lng,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              },
              // routing: 'schokokeks',
            },
          })
          this.props.setLastSearchResultToOld()
        }
      }
    })

    // hard coded virtual bus stops and vans
    this.virtualBusStopMarkers = virtualBusStops.map(virtualBusStop => {
      return (
        <Marker
          key={virtualBusStop.id}
          location={virtualBusStop.location}
          image="vbs"
        />
      )
    })

    this.vanMarkers = vanPositions.map(van => {
      return <Marker key={van.id} location={van.location} image="van" />
    })
  }

  showCurrentLocation() {
    this.setState({
      marker: {
        userLocationMarker: 'null',
      },
    })
    this.userLocationMarker = (
      <Marker
        location={{
          latitude: this.state.currentLatitude,
          longitude: this.state.currentLongitude,
        }}
        title={'My Current Location'}
        image="person"
      />
    )
  }

  searchRoute() {
    const n = this.props.map.searchResults.length - 1
    const lastSearchResult = this.props.map.searchResults[n]
    this.routing = (
      <MapViewDirections
        origin={{
          latitude: this.state.currentLatitude,
          longitude: this.state.currentLongitude,
        }}
        destination={{
          latitude: lastSearchResult.geometry.location.lat,
          longitude: lastSearchResult.geometry.location.lng,
        }}
        apikey={GOOGLE_MAPS_APIKEY}
        strokeWidth={3}
        strokeColor="blue"
        mode="driving"
      />
    )
    this.forceUpdate()
  }

  _onMapReady = () => {
    this.setState({marginBottom: 0})
    this.destinationButton = (
      <BottomButtons
        addFunc={() => this.props.navigation.navigate('Search')}
        text="destination"
        iconName="arrow-forward"
        bottom="3%"
      />
    )
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          currentLatitude: position.coords.latitude,
          currentLongitude: position.coords.longitude,
          marker: {
            region: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.001,
            },
            error: null,
          },
        })
      },
      error => this.setState({error: error.message}),
      {enableHighAccuracy: true, timeout: 200000, maximumAge: 1000}
    )
  }

  render() {
    return (
      <Container>
        <StyledMapView
          marginBottom={this.state.marginBottom}
          region={this.state.marker.region}
          showsMyLocationButton={false}
          showsUserLocation
          followsUserLocation
          onMapReady={this._onMapReady}>
          {this.userLocationMarker}
          {this.destinationMarker}
          {this.routing}
          {/* {this.virtualBusStopMarkers}
          {this.vanMarkers} */}
          {this.currentLocationMarker}
        </StyledMapView>
        <SearchForm
          onStartPress={() => {
            this.props.navigation.navigate('Search')
          }}
          onDestinationPress={() => {
            this.props.navigation.navigate('Search')
          }}
          visible={this.state.searchFormVisible}
          text={
            this.destinationMarker ? this.destinationMarker.props.title : null
          }
        />
        <StyledMenu
          active={this.state.active}
          direction="up"
          containerStyle={{}}
          position="topLeft"
          onPress={() => this.props.navigation.openDrawer()}>
          <Icon name="menu" />
        </StyledMenu>

        {/* Floating Button to show current location */}
        <StyledFab
          active={this.state.active}
          direction="up"
          position="bottomRight"
          onPress={() => this.showCurrentLocation()}>
          <Icon name="locate" />
        </StyledFab>

        {/* button for searching route */}
        {/* this.renderBottomButtons() */}
        {this.destinationButton}
        {this.cancelOrderButton}
        {this.placeOrderButton}
      </Container>
    )
  }
}

Map.propTypes = {
  map: PropTypes.object,
  setLastSearchResultToOld: PropTypes.func,
}

const MapScreen = connect(
  state => ({
    map: state.map,
  }),
  dispatch => ({
    setLastSearchResultToOld: () => {
      dispatch({type: act.SET_LAST_SEARCH_RESULT_TO_OLD})
    },
  })
)(Map)

// we create a stack navigator with the map as default and the search view, so that it can be placed on top
// of the map to get the start and destination
export default createStackNavigator(
  {
    Map: {
      screen: MapScreen,
      navigationOptions: () => ({
        header: null,
        drawerIcon: () => <Icon name="map" />,
      }),
    },
    Search: {
      screen: SearchView,
    },
  },
  {
    initialRouteName: 'Map',
  }
)
