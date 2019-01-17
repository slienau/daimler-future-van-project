const axios = require('axios')

const address = 'http://localhost:8080'
const passengerLocationClose = { latitude: 52.52302, longitude: 13.411019 }
const passengerLocationFar = { latitude: 52.52802, longitude: 13.420019 }

async function starttest () {
  const credentials = await axios.post(address + '/login', { username: 'admin', password: 'adminiscooler' })
  console.log('Login worked')
  console.log('----------------------')

  const axiosInstance = axios.create({
    baseURL: address,
    timeout: 5000,
    headers: { 'Authorization': 'Bearer ' + credentials.data.token }
  })

  const pastOrders = await axiosInstance.get('/orders')
  console.log(pastOrders.data)
  console.log('PastOrders worked')
  console.log('----------------------')

  const route = await axiosInstance.post('/routes', {
    'start': {
      'latitude': 52.524722,
      'longitude': 13.407217
    },
    'destination': {
      'latitude': 52.510144,
      'longitude': 13.387231
    }
  })
  const routeInfo = route.data[0]

  console.log(routeInfo)
  console.log('Route is ok')
  console.log('----------------------')

  const order = await axiosInstance.post('/orders', { routeId: routeInfo.id })
  const orderInfo = order.data

  console.log(orderInfo)
  console.log('Order is ok')
  console.log('----------------------')

  const activeOrder = await axiosInstance.get('/activeorder')
  console.log(activeOrder.data)
  console.log('----------------')

  const orderStatusFar = await axiosInstance.get('/activeorder/status?passengerLatitude=' + passengerLocationFar.latitude + '&passengerLongitude=' + passengerLocationFar.longitude)
  const orderStatusInfoFar = orderStatusFar.data

  console.log('order status:')
  console.log(orderStatusInfoFar)
  console.log('----------------------')

  const orderStatus = await axiosInstance.get('/activeorder/status?passengerLatitude=' + passengerLocationClose.latitude + '&passengerLongitude=' + passengerLocationClose.longitude)
  const orderStatusInfo = orderStatus.data

  console.log('order status:')
  console.log(orderStatusInfo)
  console.log('----------------------')

  const orderPut1 = await axiosInstance.put('/activeorder?passengerLatitude=' + passengerLocationClose.latitude + '&passengerLongitude=' + passengerLocationClose.longitude, { action: 'cancel' })
  const orderPut1Info = orderPut1.data

  console.log('order status:')
  console.log(orderPut1Info)
  console.log('----------------------')
}

starttest().catch(e => {
  console.log('FAILED')
  console.log(e)
  process.exit(1)
})
  .then(() => console.log('OK'))
