const axios = require('axios')
// var assert = require('assert')
// var _ = require('lodash')

const address = 'http://localhost:8080'

// test if the vans assigned to the routes are locked and not available anymore
async function starttest () {
  const credentials1 = await axios.post(address + '/login', { username: 'alex', password: 'alexiscooler' })
  console.log('admin Login worked')
  console.log('----------------------')

  const axiosInstance = axios.create({
    baseURL: address,
    timeout: 5000,
    headers: { 'Authorization': 'Bearer ' + credentials1.data.token }
  })
  // const activeOrder = await axiosInstance.get('/activeorder/status?passengerLongitude=13.322181&passengerLatitude=52.511632')
  const activeOrder = await axiosInstance.get('/vans')
  console.log('active order:')
  console.log(activeOrder.data)
  console.log('----------------')
  // const orderPut1 = await axiosInstance.put('/activeorder', { action: 'cancel', userLocation: start1 })
  // const orderPut1Info = orderPut1.data

  // console.log('order status:')
  // console.log(orderPut1Info)
  // console.log('----------------------')
}

starttest().catch(e => {
  console.log('FAILED')
  console.log(e)
  process.exit(1)
})
  .then(() => console.log('OK'))
