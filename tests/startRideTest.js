const axios = require('axios')
var assert = require('assert')
var _ = require('lodash')

const address = 'http://localhost:8080'
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
const start1 = {
  'latitude': 52.524722,
  'longitude': 13.407217
}
// const start2 = {
//   'latitude': 52.52302,
//   'longitude': 13.411019
// }
const destination1 = {
  'latitude': 52.510144,
  'longitude': 13.387231
}

// test if the vans assigned to the routes are locked and not available anymore
async function starttest () {
  const credentials1 = await axios.post(address + '/login', { username: 'admin', password: 'adminiscooler' })
  console.log('admin Login worked')
  console.log('----------------------')

  const axiosInstance1 = axios.create({
    baseURL: address,
    timeout: 5000,
    headers: { 'Authorization': 'Bearer ' + credentials1.data.token }
  })

  const route1 = await axiosInstance1.post('/routes', {
    'start': start1,
    'destination': destination1
  })
  const routeInfo1 = _.first(route1.data)

  console.log('testing first route request')
  assert.strictEqual(true, routeInfo1 != null, 'route null')
  assert.strictEqual(true, routeInfo1.vanId != null, 'vanId null')
  console.log('testing first order')
  const order1 = await axiosInstance1.post('/orders', { routeId: routeInfo1.id })
  const orderInfo1 = order1.data
  assert.strictEqual(true, orderInfo1 != null, 'order is null')

  for (let i = 0; i < 80; i++) {
    console.log('start at:', orderInfo1.route.vanStartTime)
    console.log('current time:', new Date())
    await sleep(1000 * 10)
    const vans = await axiosInstance1.get('vans')
    console.log('----------------------')
    console.log(vans.data[orderInfo1.vanId - 1])
    console.log('----------------------')
  }

//   console.log('cancelling first order')
//   const orderPut1 = await axiosInstance1.put('/activeorder', { action: 'cancel', userLocation: start1 })
//   const orderPutInfo1 = _.get(orderPut1, 'data')
//   assert.strictEqual(true, orderPutInfo1.canceled, 'order null')
}

starttest().catch(e => {
  console.log('FAILED')
  console.log(e)
  process.exit(1)
})
  .then(() => console.log('OK'))
