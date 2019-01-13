const axios = require('axios')

const address = 'http://localhost:8080'
const passengerLocation = { latitude: 52.52302, longitude: 13.411019 }

async function starttest () {
  const credentials = await axios.post(address + '/login', { username: 'admin', password: 'adminiscooler' })
  console.log('Login worked')
  console.log('----------------------')

  const axiosInstance = axios.create({
    baseURL: address,
    timeout: 30000,
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

  const order = await axiosInstance.post('/orders', { start: routeInfo.startStation._id, destination: routeInfo.endStation._id, vanId: routeInfo.vanId })
  const orderInfo = order.data

  console.log(orderInfo)
  console.log('Order is ok')
  console.log('----------------------')

  const orderStatus = await axiosInstance.get('/orders/' + orderInfo._id + '/status?passengerLatitude=' + passengerLocation.latitude + '&passengerLongitude=' + passengerLocation.longitude)
  const orderStatusInfo = orderStatus.data

  console.log('order status:')
  console.log(orderStatusInfo)
  console.log('----------------------')
}

starttest().catch(e => {
  console.log('FAILED')
  console.log(e)
  process.exit(1)
})
  .then(() => console.log('OK'))
