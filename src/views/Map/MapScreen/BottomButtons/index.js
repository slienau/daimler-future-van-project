import React from 'react'
import {MapState} from '../../../../ducks/map'
import {Alert} from 'react-native'
import DestinationButton from './DestinationButton'
import BackButton from './BackButton'
import SearchRoutesButton from './SearchRoutesButton'
import PlaceOrderButton from './PlaceOrderButton'
import CancelOrderButton from './CancelOrderButton'

const BottomButtons = props => {
  let visibleButtons = null
  switch (props.mapState) {
    case MapState.INIT:
      visibleButtons = (
        <>
          <DestinationButton
            key={0}
            mapState={props.mapState}
            onPress={() => props.toSearchView('DESTINATION')}
          />
        </>
      )
      break
    case MapState.SEARCH_ROUTES:
      visibleButtons = (
        <>
          <BackButton
            key={1}
            mapState={props.mapState}
            onPress={() => {
              props.resetMapState()
            }}
          />
          <SearchRoutesButton
            key={2}
            mapState={props.mapState}
            onPress={() => props.fetchRoutes()}
          />
        </>
      )
      break
    case MapState.ROUTE_SEARCHED:
      visibleButtons = (
        <>
          <PlaceOrderButton
            mapState={props.mapState}
            key={3}
            onPress={() => props.placeOrder()}
          />
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
                      props.onClearRoutes()
                    },
                    style: 'cancel',
                  },
                  {text: 'No', onPress: () => console.log('No Pressed')},
                ],
                {cancelable: false}
              )
            }
          />
        </>
      )
      break
    case MapState.ROUTE_ORDERED:
      visibleButtons = <></>
      break
    case MapState.ORDER_CANCELLED:
      visibleButtons = <></>
      break
  }

  return visibleButtons
}

export default BottomButtons
