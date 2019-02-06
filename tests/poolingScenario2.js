const axios = require('axios')
var assert = require('assert')
var _ = require('lodash')

const address = 'http://localhost:8080'
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const startVB = {
  'latitude': 52.500048,
  'longitude': 13.361408
}
const stopVB1 = {
  'latitude': 52.508969,
  'longitude': 13.332151
}
const stopVB2 = {
  'latitude': 52.511135,
  'longitude': 13.320412
}

// test if the vans assigned to the routes are locked and not available anymore
async function starttest () {
  const credentials1 = await axios.post(address + '/login', { username: 'maexle', password: 'maxiscool' })
  console.log('maexle Login worked')
  const credentials2 = await axios.post(address + '/login', { username: 'philipp', password: 'philippiscooler' })
  console.log('philipp Login worked')
  console.log('----------------------')

  const axiosInstance1 = axios.create({
    baseURL: address,
    timeout: 500000,
    headers: { 'Authorization': 'Bearer ' + credentials1.data.token }
  })
  const axiosInstance2 = axios.create({
    baseURL: address,
    timeout: 500000,
    headers: { 'Authorization': 'Bearer ' + credentials2.data.token }
  })

  const route1 = await axiosInstance1.post('/routes', {
    'start': startVB,
    'destination': stopVB2
  })
  const routeInfo1 = _.first(route1.data)

  console.log(routeInfo1)

  console.log('testing first route request')
  assert.strictEqual(true, routeInfo1 != null, 'route null')
  assert.strictEqual(true, routeInfo1.vanId != null, 'vanId null')
  console.log('testing first order')
  const order1 = await axiosInstance1.post('/orders', { routeId: routeInfo1.id })
  const orderInfo1 = order1.data
  assert.strictEqual(true, orderInfo1 != null, 'order is null')
  console.log(orderInfo1)
  await sleep(1000 * 10)

  console.log('testing second route request with same destination')
  const route2 = await axiosInstance2.post('/routes', {
    'start': startVB,
    'destination': stopVB1
  })
  const routeInfo2 = _.first(route2.data)
  assert.strictEqual(true, routeInfo2 != null, 'route2 null')
  assert.strictEqual(routeInfo1.vanId, routeInfo2.vanId, 'vanId should be equal since the two routes have the same destination')
  console.log('testing second order')
  console.log(routeInfo2)
  const order2 = await axiosInstance2.post('/orders', { routeId: routeInfo2.id })
  const orderInfo2 = order2.data
  assert.strictEqual(true, orderInfo2 != null, 'order2 is null')
  assert.strictEqual(orderInfo2.vanStartVBS, orderInfo1.vanStartVBS, 'order vbs not equal')
  console.log(orderInfo2)

  let started1 = false
  let started2 = false
  let ended1 = false
  let ended2 = false

  while (!started1 && !started2) {
    await sleep(1000 * 10)

    let status1 = await axiosInstance1.get(`/activeorder/status?passengerLatitude=${routeInfo1.vanStartVBS.location.latitude}&passengerLongitude=${routeInfo1.vanStartVBS.location.longitude}`)
    let status2 = await axiosInstance2.get(`/activeorder/status?passengerLatitude=${routeInfo2.vanStartVBS.location.latitude}&passengerLongitude=${routeInfo1.vanStartVBS.location.longitude}`)

    console.log(status1.data)
    console.log(status2.data)
    console.log('----------------------------')
    let res
    if (status1.data.userAllowedToEnter) {
      res = await axiosInstance1.put('/activeorder', {
        action: 'startride',
        userLocation: routeInfo1.vanStartVBS.location
      })
      if (res.data.vanEnterTime) started1 = true
      console.log('start time (1):', res.data.vanEnterTime)
    }
    if (status2.data.userAllowedToEnter) {
      res = await axiosInstance2.put('/activeorder', {
        action: 'startride',
        userLocation: routeInfo2.vanStartVBS.location
      })
      if (res.data.vanEnterTime) started2 = true
      console.log('start time (2):', res.data.vanEnterTime)
    }
  }
  while (!ended1 && !ended2) {
    await sleep(1000 * 10)

    let status1 = await axiosInstance1.get(`/activeorder/status?passengerLatitude=${routeInfo1.vanEndVBS.location.latitude}&passengerLongitude=${routeInfo1.vanEndVBS.location.longitude}`)
    let status2 = await axiosInstance2.get(`/activeorder/status?passengerLatitude=${routeInfo2.vanEndVBS.location.latitude}&passengerLongitude=${routeInfo1.vanEndVBS.location.longitude}`)
    let res

    console.log(status1.data)
    console.log(status2.data)
    console.log('----------------------------')
    if (status1.data.userAllowedToExit) {
      res = await axiosInstance1.put('/activeorder', {
        action: 'endride',
        userLocation: routeInfo1.vanEndVBS.location
      })
      if (res.data.vanExitTime) ended1 = true
      console.log('ride ended (1)')
    }
    if (status2.data.userAllowedToExit) {
      res = await axiosInstance2.put('/activeorder', {
        action: 'endride',
        userLocation: routeInfo2.vanEndVBS.location
      })
      console.log('ride ended (1)')
      if (res.data.vanExitTime) ended2 = true
    }

    console.log('rides ended')
  }
}

starttest().catch(e => {
  console.log('FAILED')
  console.log(e)
  process.exit(1)
})
  .then(() => console.log('OK'))
