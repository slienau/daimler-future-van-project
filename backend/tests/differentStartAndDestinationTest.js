const axios = require('axios')
var assert = require('assert')
var _ = require('lodash')
const VBS = require('./allVBS')

const address = 'http://localhost:8080'

// test if the vans assigned to the routes are locked and not available anymore
async function starttest () {
  const credentials = await axios.post(address + '/login', { username: 'admin', password: 'adminiscooler' })
  console.log('Login worked')
  console.log('----------------------')

  const axiosInstance = axios.create({
    baseURL: address,
    timeout: 60000,
    headers: { 'Authorization': 'Bearer ' + credentials.data.token }
  })

  const route1 = await axiosInstance.post('/routes', {
    'start': VBS.kufue,
    'destination': VBS.erp
  })
  const routeInfo1 = _.first(route1.data)

  console.log('testing first route request inclusive placing order')
  assert.strictEqual(true, routeInfo1 != null, 'route null')
  assert.strictEqual(true, routeInfo1.vanId != null, 'vanId null')
  console.log('testing first order')
  const order = await axiosInstance.post('/orders', { routeId: routeInfo1.id })
  const orderInfo = order.data
  assert.strictEqual(true, orderInfo != null, 'order is null')

  console.log('testing second route request with different destination')
  const route2 = await axiosInstance.post('/routes', {
    'start': VBS.potsdamerPl,
    'destination': VBS.fried
  })
  const routeInfo2 = _.first(route2.data)
  assert.strictEqual(true, routeInfo2 != null, 'route null')
  assert.notStrictEqual(routeInfo2.vanId, routeInfo1.vanId, 'vanIds should not be equal since the two routes have a different destination')

  console.log('cancelling order')
  const orderPut = await axiosInstance.put('/activeorder', { action: 'cancel', userLocation: VBS.kufue })
  const orderPutInfo = _.get(orderPut, 'data')
  assert.strictEqual(true, orderPutInfo.canceled, 'order null')
}

starttest().catch(e => {
  console.log('FAILED')
  console.log(e)
  process.exit(1)
})
  .then(() => console.log('OK'))
