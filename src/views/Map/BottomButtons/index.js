import React from 'react'
import BottomButton from './BottomButton'
import {MapState} from '../../../ducks/map'
import {Alert} from 'react-native'

const BottomButtons = props => {
  return [
    // destination button
    <BottomButton
      key={0}
      visible={props.mapState === MapState.INIT}
      iconRight
      addFunc={() => props.toSearchView('DESTINATION')}
      text="destination"
      iconName="arrow-forward"
      bottom="3%"
    />,
    // back button
    <BottomButton
      key={1}
      visible={props.mapState === MapState.SEARCH_ROUTES}
      iconLeft
      addFunc={() => {
        props.resetMapState()
      }}
      text=""
      iconName="arrow-back"
      left="10%"
      right="70%"
      bottom="3%"
    />,
    // search routes button
    <BottomButton
      key={2}
      visible={props.mapState === MapState.SEARCH_ROUTES}
      iconRight
      addFunc={() => props.fetchRoutes()}
      text="Search Route"
      iconName="arrow-forward"
      left="45%"
      right="10%"
      bottom="3%"
    />,
    // place order button
    <BottomButton
      visible={props.mapState === MapState.ROUTE_SEARCHED}
      iconRight
      key={3}
      addFunc={() => props.placeOrder()}
      text="Place Order"
      iconName="arrow-forward"
      left="42%"
      right="10%"
      bottom="3%"
    />,
    // cancel order button
    <BottomButton
      visible={props.mapState === MapState.ROUTE_SEARCHED}
      iconLeft
      key={4}
      addFunc={() =>
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
      text="Cancel"
      iconName="close"
      left="10%"
      right="60%"
      bottom="3%"
    />,
  ]
}

export default BottomButtons
