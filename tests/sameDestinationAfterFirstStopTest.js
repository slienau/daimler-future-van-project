const axios = require('axios')
var assert = require('assert')
var _ = require('lodash')
const VBS = require('./allVBS')

const address = 'http://localhost:8080'

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

  const route1 = await axiosInstance1.post('/routes', {
    'start': VBS.kufue,
    'destination': VBS.fried
  })
  const routeInfo1 = _.first(route1.data)

  console.log('testing first route request')
  assert.strictEqual(true, routeInfo1 != null, 'route null')
  assert.strictEqual(true, routeInfo1.vanId != null, 'vanId null')
  console.log('testing first order')
  const order1 = await axiosInstance1.post('/orders', { routeId: routeInfo1.id })
  const orderInfo1 = order1.data
  assert.strictEqual(true, orderInfo1 != null, 'order is null')

  console.log('testing second route request with same destination')
  const route2 = await axiosInstance2.post('/routes', {
    'start': VBS.potsdamerPl,
    'destination': VBS.fried
  })
  const routeInfo2 = _.first(route2.data)
  assert.strictEqual(true, routeInfo2 != null, 'route2 null')
  assert.strictEqual(routeInfo1.vanId, routeInfo2.vanId, 'vanId should be equal since the two routes have the same destination')
  console.log('testing second order')
  const order2 = await axiosInstance2.post('/orders', { routeId: routeInfo2.id })
  const orderInfo2 = order2.data
  assert.strictEqual(true, orderInfo2 != null, 'order2 is null')
  assert.strictEqual(orderInfo2.vanEndVBS.id, orderInfo1.vanEndVBS.id, 'order vbs not equal')

  console.log('cancelling first order')
  const orderPut1 = await axiosInstance1.put('/activeorder', { action: 'cancel', userLocation: VBS.kufue })
  const orderPutInfo1 = _.get(orderPut1, 'data')
  assert.strictEqual(true, orderPutInfo1.canceled, 'order null')

  console.log('cancelling second order')
  const orderPut2 = await axiosInstance2.put('/activeorder', { action: 'cancel', userLocation: VBS.potsdamerPl })
  const orderPutInfo2 = _.get(orderPut2, 'data')
  assert.strictEqual(true, orderPutInfo2.canceled, 'order null')
}

starttest().catch(e => {
  console.log('FAILED')
  console.log(e)
  process.exit(1)
})
  .then(() => console.log('OK'))
