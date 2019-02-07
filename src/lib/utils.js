import _ from 'lodash'

// from: https://github.com/react-native-community/react-native-maps/issues/505#issuecomment-243423775
// expects a list of two coordinate objects and returns a region as specified by the react-native-maps components
export const getRegionForCoordinates = points => {
  const lats = _.map(
    points,
    p => p.latitude || _.get(p, 'geometry.location.lat')
  )
  const lngs = _.map(
    points,
    p => p.longitude || _.get(p, 'geometry.location.lng')
  )

  const minX = _.min(lats)
  const maxX = _.max(lats)
  const minY = _.min(lngs)
  const maxY = _.max(lngs)

  return {
    latitude: (minX + maxX) / 2,
    longitude: (minY + maxY) / 2,
    latitudeDelta: (maxX - minX) * 1.5 || 0.01,
    longitudeDelta: (maxY - minY) * 1.5 || 0.001,
  }
}

export const firstLetterToUppercase = inputString => {
  if (!_.isString(inputString)) return ''
  return inputString.charAt(0).toUpperCase() + inputString.slice(1)
}
