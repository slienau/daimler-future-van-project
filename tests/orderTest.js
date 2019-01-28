const axios = require('axios')

const address = 'http://localhost:8080'
const passengerLocationClose = { latitude: 52.511632, longitude: 13.322181 }
const passengerLocationFar = { latitude: 52.52802, longitude: 13.420019 }

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

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

  const vans = await axiosInstance.get('vans')
  console.log(vans.data)
  console.log('Vans worked')
  console.log('----------------------')

  const route = await axiosInstance.post('/routes', {
    'start': {
      'latitude': 52.511632,
      'longitude': 13.322181
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
  console.log('active order:')
  console.log(activeOrder.data)
  console.log('----------------')

  const orderStatusFar = await axiosInstance.get('/activeorder/status?passengerLatitude=' + passengerLocationFar.latitude + '&passengerLongitude=' + passengerLocationFar.longitude)
  const orderStatusInfoFar = orderStatusFar.data

  console.log('order status:')
  console.log(orderStatusInfoFar)
  console.log('----------------------')

  const vans2 = await axiosInstance.get('vans')
  console.log('all vans:')
  console.log(vans2.data)
  console.log('Vans worked')
  console.log('----------------------')

  const orderStatus2 = await axiosInstance.get('/activeorder/status?passengerLatitude=' + passengerLocationClose.latitude + '&passengerLongitude=' + passengerLocationClose.longitude)
  const orderStatusInfo2 = orderStatus2.data

  console.log('order status:')
  console.log(orderStatusInfo2)
  console.log('----------------------')

  let vans3

  for (let i = 0; i < 10; i++) {
    await sleep(1000 * 5)
    vans3 = await axiosInstance.get('vans')
    console.log(vans3.data)
    console.log('New Vans update worked')
    console.log('----------------------')

    const orderStatus2 = await axiosInstance.get('/activeorder/status?passengerLatitude=' + passengerLocationClose.latitude + '&passengerLongitude=' + passengerLocationClose.longitude)
    const orderStatusInfo2 = orderStatus2.data

    console.log('order status:')
    console.log(orderStatusInfo2)
    console.log('----------------------')
  }

  const orderPut1 = await axiosInstance.put('/activeorder', { action: 'cancel', userLocation: { latitude: passengerLocationClose.latitude, longitude: passengerLocationClose.longitude } })
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
