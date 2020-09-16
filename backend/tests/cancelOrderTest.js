const axios = require('axios')
var assert = require('assert')
var _ = require('lodash')
const VBS = require('./allVBS')

const address = 'http://localhost:8080'
// function sleep (ms) {
//   return new Promise(resolve => setTimeout(resolve, ms))
// }

// test if the vans assigned to the routes are locked and not available anymore
async function starttest () {
  const credentials1 = await axios.post(address + '/login', { username: 'admin', password: 'adminiscooler' })
  console.log('admin Login worked')
  const credentials2 = await axios.post(address + '/login', { username: 'alex', password: 'alexiscooler' })
  console.log('alex Login worked')
  console.log('----------------------')

  const axiosInstance1 = axios.create({
    baseURL: address,
    timeout: 60000,
    headers: { 'Authorization': 'Bearer ' + credentials1.data.token }
  })
  const axiosInstance2 = axios.create({
    baseURL: address,
    timeout: 60000,
    headers: { 'Authorization': 'Bearer ' + credentials2.data.token }
  })

  console.log('### Scenario 1: Single user orders and cancels the order afterwards ###')
  console.log('testing first route request')
  let route1 = await axiosInstance1.post('/routes', {
    'start': VBS.kufue,
    'destination': VBS.fried
  })
  let routeInfo1 = _.first(route1.data)
  assert.strictEqual(true, routeInfo1 != null, 'route null')
  assert.strictEqual(true, routeInfo1.vanId != null, 'vanId null')
  console.log('testing first order')
  let order1 = await axiosInstance1.post('/orders', { routeId: routeInfo1.id })
  let orderInfo1 = order1.data
  let vans = await axiosInstance1.get('vans')
  assert.strictEqual(true, orderInfo1 != null, 'order is null')
  assert.strictEqual(vans.data[orderInfo1.vanId - 1].nextStops.length, 2, 'van next stops not two')
  assert.strictEqual(vans.data[orderInfo1.vanId - 1].nextRoutes.length, 2, 'van next routes not two')

  console.log('#stops:', vans.data[orderInfo1.vanId - 1].nextStops.length, '#routes:', vans.data[orderInfo1.vanId - 1].nextRoutes.length)

  console.log('cancelling first order')
  let orderPut1 = await axiosInstance1.put('/activeorder', { action: 'cancel', userLocation: VBS.kufue })
  let orderPutInfo1 = _.get(orderPut1, 'data')
  assert.strictEqual(true, orderPutInfo1.canceled, 'order null or not cancelled')
  vans = await axiosInstance1.get('vans')
  assert.strictEqual(vans.data[orderInfo1.vanId - 1].nextStops.length, 0, 'van next stops not empty')
  assert.strictEqual(vans.data[orderInfo1.vanId - 1].nextRoutes.length, 0, 'van next routes not empty')

  console.log('SUCCESS')
  console.log()

  console.log('### Scenario 2:Two users order at different start VBS but same end VBS and cancel the order afterwards ###')
  console.log('testing first route request')
  route1 = await axiosInstance1.post('/routes', {
    'start': VBS.kufue,
    'destination': VBS.fried
  })
  routeInfo1 = _.first(route1.data)
  assert.strictEqual(true, routeInfo1 != null, 'route null')
  assert.strictEqual(true, routeInfo1.vanId != null, 'vanId null')
  console.log('testing first order')
  order1 = await axiosInstance1.post('/orders', { routeId: routeInfo1.id })
  orderInfo1 = order1.data
  vans = await axiosInstance1.get('vans')
  assert.strictEqual(true, orderInfo1 != null, 'order is null')
  assert.strictEqual(vans.data[orderInfo1.vanId - 1].nextStops.length, 2, 'van next stops not two')
  assert.strictEqual(vans.data[orderInfo1.vanId - 1].nextRoutes.length, 2, 'van next routes not two')

  console.log('#stops:', vans.data[orderInfo1.vanId - 1].nextStops.length, '#routes:', vans.data[orderInfo1.vanId - 1].nextRoutes.length)

  console.log('testing second route request with same destination')
  let route2 = await axiosInstance2.post('/routes', {
    'start': VBS.potsdamerPl,
    'destination': VBS.fried
  })
  let routeInfo2 = _.first(route2.data)
  assert.strictEqual(true, routeInfo2 != null, 'route2 null')
  assert.strictEqual(routeInfo1.vanId, routeInfo2.vanId, 'vanId should be equal since the two routes have the same destination')
  console.log('testing second order')
  let order2 = await axiosInstance2.post('/orders', { routeId: routeInfo2.id })
  let orderInfo2 = order2.data
  vans = await axiosInstance1.get('vans')
  assert.strictEqual(true, orderInfo2 != null, 'order2 is null')
  assert.strictEqual(orderInfo2.vanEndVBS.id, orderInfo1.vanEndVBS.id, 'order vbs not equal')
  assert.strictEqual(vans.data[orderInfo1.vanId - 1].nextStops.length, 3, 'van next stops dont fit')
  assert.strictEqual(vans.data[orderInfo1.vanId - 1].nextRoutes.length, 4, 'van next routes dont fit')

  console.log('#stops:', vans.data[orderInfo1.vanId - 1].nextStops.length, '#routes:', vans.data[orderInfo1.vanId - 1].nextRoutes.length)

  console.log('cancelling first order')
  orderPut1 = await axiosInstance1.put('/activeorder', { action: 'cancel', userLocation: VBS.kufue })
  orderPutInfo1 = _.get(orderPut1, 'data')
  vans = await axiosInstance1.get('vans')
  assert.strictEqual(true, orderPutInfo1.canceled, 'order null or not cancelled')
  assert.strictEqual(vans.data[orderInfo1.vanId - 1].nextStops.length, 2, 'van next stops dont fit')
  assert.strictEqual(vans.data[orderInfo1.vanId - 1].nextRoutes.length, 3, 'van next routes dont fit')

  console.log('#stops:', vans.data[orderInfo1.vanId - 1].nextStops.length, '#routes:', vans.data[orderInfo1.vanId - 1].nextRoutes.length)

  console.log('cancelling second order')
  let orderPut2 = await axiosInstance2.put('/activeorder', { action: 'cancel', userLocation: VBS.kufue })
  let orderPutInfo2 = _.get(orderPut2, 'data')
  vans = await axiosInstance1.get('vans')
  assert.strictEqual(true, orderPutInfo2.canceled, 'order null or not cancelled')
  assert.strictEqual(vans.data[orderInfo2.vanId - 1].nextStops.length, 0, 'van next stops not empty')
  assert.strictEqual(vans.data[orderInfo2.vanId - 1].nextRoutes.length, 0, 'van next routes not empty')

  console.log('SUCCESS')
  console.log()

  console.log('### Scenario 3:Two users order at same start VBS and same end VBS and cancel the order afterwards ###')
  console.log('testing first route request')
  route1 = await axiosInstance1.post('/routes', {
    'start': VBS.kufue,
    'destination': VBS.fried
  })
  routeInfo1 = _.first(route1.data)
  assert.strictEqual(true, routeInfo1 != null, 'route null')
  assert.strictEqual(true, routeInfo1.vanId != null, 'vanId null')
  console.log('testing first order')
  order1 = await axiosInstance1.post('/orders', { routeId: routeInfo1.id })
  orderInfo1 = order1.data
  vans = await axiosInstance1.get('vans')
  assert.strictEqual(true, orderInfo1 != null, 'order is null')
  assert.strictEqual(vans.data[orderInfo1.vanId - 1].nextStops.length, 2, 'van next stops not two')
  assert.strictEqual(vans.data[orderInfo1.vanId - 1].nextRoutes.length, 2, 'van next routes not two')

  console.log('#stops:', vans.data[orderInfo1.vanId - 1].nextStops.length, '#routes:', vans.data[orderInfo1.vanId - 1].nextRoutes.length)

  console.log('testing second route request with same destination')
  route2 = await axiosInstance2.post('/routes', {
    'start': VBS.kufue,
    'destination': VBS.fried
  })
  routeInfo2 = _.first(route2.data)
  assert.strictEqual(true, routeInfo2 != null, 'route2 null')
  assert.strictEqual(routeInfo1.vanId, routeInfo2.vanId, 'vanId should be equal since the two routes have the same destination')
  console.log('testing second order')
  order2 = await axiosInstance2.post('/orders', { routeId: routeInfo2.id })
  orderInfo2 = order2.data
  vans = await axiosInstance1.get('vans')
  assert.strictEqual(true, orderInfo2 != null, 'order2 is null')
  assert.strictEqual(orderInfo2.vanEndVBS.id, orderInfo1.vanEndVBS.id, 'order vbs not equal')
  assert.strictEqual(vans.data[orderInfo1.vanId - 1].nextStops.length, 2, 'van next stops dont fit')
  assert.strictEqual(vans.data[orderInfo1.vanId - 1].nextRoutes.length, 3, 'van next routes dont fit')

  console.log('#stops:', vans.data[orderInfo1.vanId - 1].nextStops.length, '#routes:', vans.data[orderInfo1.vanId - 1].nextRoutes.length)

  console.log('cancelling first order')
  orderPut1 = await axiosInstance1.put('/activeorder', { action: 'cancel', userLocation: VBS.kufue })
  orderPutInfo1 = _.get(orderPut1, 'data')
  vans = await axiosInstance1.get('vans')
  assert.strictEqual(true, orderPutInfo1.canceled, 'order null or not cancelled')
  assert.strictEqual(vans.data[orderInfo1.vanId - 1].nextStops.length, 2, 'van next stops dont fit')
  assert.strictEqual(vans.data[orderInfo1.vanId - 1].nextRoutes.length, 3, 'van next routes dont fit')

  console.log('#stops:', vans.data[orderInfo1.vanId - 1].nextStops.length, '#routes:', vans.data[orderInfo1.vanId - 1].nextRoutes.length)

  console.log('cancelling second order')
  orderPut2 = await axiosInstance2.put('/activeorder', { action: 'cancel', userLocation: VBS.kufue })
  orderPutInfo2 = _.get(orderPut2, 'data')
  vans = await axiosInstance1.get('vans')
  assert.strictEqual(true, orderPutInfo2.canceled, 'order null or not cancelled')
  assert.strictEqual(vans.data[orderInfo2.vanId - 1].nextStops.length, 0, 'van next stops not empty')
  assert.strictEqual(vans.data[orderInfo2.vanId - 1].nextRoutes.length, 0, 'van next routes not empty')

  console.log('SUCCESS')
}

starttest().catch(e => {
  console.log('FAILED')
  console.log(e)
  process.exit(1)
})
  .then(() => console.log('OK'))
