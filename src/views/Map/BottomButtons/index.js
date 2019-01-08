import React from 'react'
import {MapState} from '../../../ducks/map'
import {Alert} from 'react-native'
import DestinationButton from './DestinationButton'
import BackButton from './BackButton'
import SearchRoutesButton from './SearchRoutesButton'
import PlaceOrderButton from './PlaceOrderButton'
import CancelOrderButton from './CancelOrderButton'

const BottomButtons = props => {
  return [
    <DestinationButton
      key={0}
      mapState={props.mapState}
      onPress={() => props.toSearchView('DESTINATION')}
    />,
    <BackButton
      key={1}
      mapState={props.mapState}
      onPress={() => {
        props.resetMapState()
      }}
    />,
    <SearchRoutesButton
      key={2}
      mapState={props.mapState}
      onPress={() => props.fetchRoutes()}
    />,
    <PlaceOrderButton
      mapState={props.mapState}
      key={3}
      onPress={() => props.placeOrder()}
    />,
    <CancelOrderButton
      mapState={props.mapState}
      key={4}
      onPress={() =>
        Alert.alert(
          'Cancel Order',
          'Are you sure to cancel your order?',
          [
            {
              text: 'Yes',
              onPress: () => {
                props.onChangeMapState(MapState.SEARCH_ROUTES)
                // TODO: set routes in redux state to null
              },
              style: 'cancel',
            },
            {text: 'No', onPress: () => console.log('No Pressed')},
          ],
          {cancelable: false}
        )
      }
    />,
  ]
}

export default BottomButtons
