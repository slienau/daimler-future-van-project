const axios = require('axios')
var assert = require('assert')
var _ = require('lodash')
const VBS = require('./allVBS')

const address = 'http://localhost:8080'
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

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
  // console.log(order1)

  // await sleep(10000)

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

  let started1, started2
  let ended = false
  while (!ended) {
    await sleep(1000 * 10)
    const vans = await axiosInstance1.get('vans')
    console.log('----------------------')
    console.log(vans.data[orderInfo1.vanId - 1])
    if (!started1 && vans.data[orderInfo1.vanId - 1].waiting) {
      let res = await axiosInstance1.put('/activeorder', {
        action: 'startride',
        userLocation: orderInfo1.route.vanStartVBS.location
      })
      started1 = true
      console.log('start time (1):', res.data.vanEnterTime)
      continue
    } else if (!started2 && vans.data[orderInfo1.vanId - 1].waiting) {
      let res = await axiosInstance2.put('/activeorder', {
        action: 'startride',
        userLocation: orderInfo2.route.vanStartVBS.location
      })
      started2 = true
      console.log('start time (2):', res.data.vanEnterTime)
      continue
    }

    if (started1 && started2 && vans.data[orderInfo1.vanId - 1].waiting) {
      await axiosInstance1.put('/activeorder', {
        action: 'endride',
        userLocation: orderInfo1.route.vanEndVBS.location
      })
      console.log('ride ended (1)')

      await axiosInstance2.put('/activeorder', {
        action: 'endride',
        userLocation: orderInfo2.route.vanEndVBS.location
      })
      console.log('ride ended (2)')
      ended = true
    }
  }
  console.log('rides ended')
}

starttest().catch(e => {
  console.log('FAILED')
  console.log(e)
  process.exit(1)
})
  .then(() => console.log('OK'))
