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

  const axiosInstance1 = axios.create({
    baseURL: address,
    timeout: 60000,
    headers: { 'Authorization': 'Bearer ' + credentials1.data.token }
  })

  const route1 = await axiosInstance1.post('/routes', {
    'start': VBS.kufue,
    'destination': VBS.potsdamerPl
  })
  const routeInfo1 = _.first(route1.data)

  console.log('testing first route request')
  assert.strictEqual(true, routeInfo1 != null, 'route null')
  assert.strictEqual(true, routeInfo1.vanId != null, 'vanId null')
  console.log('testing first order')
  const order1 = await axiosInstance1.post('/orders', { routeId: routeInfo1.id })
  const orderInfo1 = order1.data
  assert.strictEqual(true, orderInfo1 != null, 'order is null')

  let started = false
  while (true) {
    await sleep(1000 * 10)
    const vans = await axiosInstance1.get('vans')
    console.log('----------------------')
    console.log(vans.data[orderInfo1.vanId - 1])
    if (!started) {
      try {
        let res = await axiosInstance1.put('/activeorder', {
          action: 'startride',
          userLocation: orderInfo1.route.startStation.location
        })
        started = true
        console.log('start time:', res.data.startTime)
      } catch (e) {
        console.log('not entered')
      }
    } else {
      try {
        await axiosInstance1.put('/activeorder', {
          action: 'endride',
          userLocation: orderInfo1.route.endStation.location
        })
        console.log('ride ended')
        break
      } catch (e) {
        console.log('still riding')
      }
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
