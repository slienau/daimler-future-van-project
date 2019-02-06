const axios = require('axios')
var assert = require('assert')
var _ = require('lodash')
var VBS = require('./allVBS')

const address = 'http://localhost:8080'
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// test if the vans assigned to the routes are locked and not available anymore
async function starttest () {
  const credentials1 = await axios.post(address + '/login', { username: 'admin', password: 'adminiscooler' })
  console.log('admin Login worked')
  console.log('----------------------')

  const axiosInstance = axios.create({
    baseURL: address,
    timeout: 60000,
    headers: { 'Authorization': 'Bearer ' + credentials1.data.token }
  })

  const route1 = await axiosInstance.post('/routes', {
    'start': VBS.kufue,
    'destination': VBS.fried
  })
  const routeInfo = _.first(route1.data)

  console.log('testing first route request')
  assert.strictEqual(true, routeInfo != null, 'route null')
  assert.strictEqual(true, routeInfo.vanId != null, 'vanId null')
  console.log('testing first order')
  const order = await axiosInstance.post('/orders', { routeId: routeInfo.id })
  const orderInfo = order.data
  assert.strictEqual(true, orderInfo != null, 'order is null')

  let started = false
  let ended = false
  while (!ended) {
    await sleep(1000 * 10)
    let status = await axiosInstance.get(`/activeorder/status?passengerLatitude=${routeInfo.vanStartVBS.location.latitude}&passengerLongitude=${routeInfo.vanStartVBS.location.longitude}`)
    console.log('----------------------')
    console.log(status.data)
    if (status.data.userAllowedToEnter && !started) {
      let res = await axiosInstance.put('/activeorder', {
        action: 'startride',
        userLocation: orderInfo.route.vanStartVBS.location
      })
      started = true
      console.log('start time:', res.data.startTime)
      continue
    } else if (status.data.userAllowedToExit) {
      await axiosInstance.put('/activeorder', {
        action: 'endride',
        userLocation: orderInfo.route.vanEndVBS.location
      })
      ended = true
      console.log('ride ended')
    }
    console.log('----------------------')
  }
}

starttest().catch(e => {
  console.log('FAILED')
  console.log(e)
  process.exit(1)
})
  .then(() => console.log('OK'))
