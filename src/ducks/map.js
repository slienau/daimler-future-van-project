export const SET_START = 'map/SET_START'
export const SET_DESTINATION = 'map/SET_DESTINATION'
export const SET_LOCATION = 'map/SET_LOCATION'
export const SET_ROUTE = 'map/SET_ROUTE'
export const SET_VAN_LOCATION = 'map/SET_VAN_LOCATION'
export const SET_ORDER = 'map/SET_ORDER'
export const ADD_SEARCH_RESULT = 'map/ADD_SEARCH_RESULT'
export const SET_LAST_SEARCH_RESULT_TO_OLD = 'map/SET_LAST_SEARCH_RESULT_TO_OLD'

const initialState = {
  start: null, // {lat, lng, name, description}
  destination: null, // {lat, lng, name, description}
  location: null,
  route: null,
  vanLocation: null,
  order: null,
  searchResults: [],
}

const map = (state = initialState, action) => {
  switch (action.type) {
    case SET_START:
      return {
        ...state,
        start: action.payload.start,
        // or: location: {...action.payload.location} ??
      }
    case SET_DESTINATION:
    case SET_LOCATION:
      return {
        ...state,
        location: action.payload.location,
        // or: location: {...action.payload.location} ??
      }
    case SET_ROUTE:
    case SET_VAN_LOCATION:
      return {
        ...state,
        vanLocation: action.payload.vanLocation,
      }
    case SET_ORDER:
    case ADD_SEARCH_RESULT:
      return {
        ...state,
        searchResults: state.searchResults.concat(action.payload.result),
      }
    case SET_LAST_SEARCH_RESULT_TO_OLD:
      // get last search result
      const len = state.searchResults.length
      if (len === 0) {
        return state
      }
      const lastResult = state.searchResults[len - 1]
      // create new array where attribute isNew of last result is set to false
      const newSearchResults = state.searchResults.slice(0, len - 1)
      newSearchResults.push({...lastResult, isNew: false})
      return {
        ...state,
        searchResults: newSearchResults,
      }
    default:
      return state
  }
}

export const setStartAction = (latitude, longitude, name) => {
  return {
    type: SET_START,
    payload: {start: {latitude: latitude, longitude: longitude, name: name}},
  }
}

export const addSearchResultAction = result => {
  result.isNew = true
  return {
    type: ADD_SEARCH_RESULT,
    payload: {result: result},
  }
}

export default map
