const axios = require('axios')
var assert = require('assert')
var _ = require('lodash')

const address = 'http://localhost:8080'

// test if the vans assigned to the routes are locked and not available anymore
async function starttest () {
  const credentials = await axios.post(address + '/login', { username: 'admin', password: 'adminiscooler' })
  console.log('Login worked')
  console.log('----------------------')

  const axiosInstance = axios.create({
    baseURL: address,
    timeout: 5000,
    headers: { 'Authorization': 'Bearer ' + credentials.data.token }
  })

  const route1 = await axiosInstance.post('/routes', {
    'start': {
      'latitude': 52.524722,
      'longitude': 13.407217
    },
    'destination': {
      'latitude': 52.510144,
      'longitude': 13.387231
    }
  })
  const routeInfo1 = _.first(route1.data)

  console.log('testing first route request')
  assert.strictEqual(true, routeInfo1 != null, 'route null')
  assert.strictEqual(true, routeInfo1.vanId != null, 'vanId null')

  console.log('testing second route request')
  const route2 = await axiosInstance.post('/routes', {
    'start': {
      'latitude': 52.524722,
      'longitude': 13.407217
    },
    'destination': {
      'latitude': 52.510144,
      'longitude': 13.387231
    }
  })
  const routeInfo2 = _.first(route2.data)
  assert.strictEqual(true, routeInfo2 != null, 'route null')
  assert.strictEqual(true, routeInfo2.vanId !== routeInfo1.vanId, 'vanId of routes are equal but should not, because it should be reserved')

  console.log('testing third route request')
  const route3 = await axiosInstance.post('/routes', {
    'start': {
      'latitude': 52.524722,
      'longitude': 13.407217
    },
    'destination': {
      'latitude': 52.510144,
      'longitude': 13.387231
    }
  })
  const routeInfo3 = _.first(route3.data)
  assert.strictEqual(true, routeInfo3 != null, 'route null')
  assert.strictEqual(true, routeInfo3.vanId !== routeInfo1.vanId && routeInfo3.vanId !== routeInfo2.vanId, 'vanId of routes are equal but should not, because it should be reserved')
}

starttest().catch(e => {
  console.log('FAILED')
  console.log(e)
  process.exit(1)
})
  .then(() => console.log('OK'))
