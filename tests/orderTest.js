const axios = require('axios')

const address = 'http://localhost:8080'
const passengerLocationClose = { latitude: 52.511632, longitude: 13.322181 }
const passengerLocationFar = { latitude: 52.52802, longitude: 13.420019 }

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function starttest () {
  const credentials = await axios.post(address + '/login', { username: 'antonio', password: 'antonioiscooler' })
  console.log('Login worked')
  console.log('----------------------')

  const axiosInstance = axios.create({
    baseURL: address,
    timeout: 20000,
    headers: { 'Authorization': 'Bearer ' + credentials.data.token }
  })

  await axiosInstance.get('/orders')
  // console.log(pastOrders.data)
  console.log('PastOrders worked')
  console.log('----------------------')

  await axiosInstance.get('/vans')
  // console.log(vans.data)
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
    },
    'passengers': 2
  })
  const routeInfo = route.data[0]

  console.log(routeInfo)
  console.log('Route is ok')
  console.log('----------------------')
  const orderInfo = await axiosInstance.post('/orders', { routeId: routeInfo.id })
  console.log(orderInfo.data)
  console.log('Order is ok')
  console.log('----------------------')

  await axiosInstance.get('/activeorder')
  console.log('active order:')
  // console.log(activeOrder.data)
  console.log('----------------')

  await axiosInstance.get('/activeorder/status?passengerLatitude=' + passengerLocationFar.latitude + '&passengerLongitude=' + passengerLocationFar.longitude)

  console.log('order status:')
  // console.log(orderStatusInfoFar)
  console.log('----------------------')

  await axiosInstance.get('vans')
  console.log('all vans:')
  // console.log(vans2.data)
  console.log('Vans worked')
  console.log('----------------------')

  await axiosInstance.get('/activeorder/status?passengerLatitude=' + passengerLocationClose.latitude + '&passengerLongitude=' + passengerLocationClose.longitude)

  console.log('order status:')
  // console.log(orderStatusInfo2)
  console.log('----------------------')

  // let vans3

  for (let i = 0; i < 10; i++) {
    await sleep(1000 * 5)
    await axiosInstance.get('vans')
    // console.log(vans3.data)
    console.log('New Vans update worked')
    console.log('----------------------')

    await axiosInstance.get('/activeorder/status?passengerLatitude=' + passengerLocationClose.latitude + '&passengerLongitude=' + passengerLocationClose.longitude)

    console.log('order status:')
    // console.log(orderStatusInfo2)
    console.log('----------------------')
  }

  await axiosInstance.put('/activeorder', { action: 'cancel', userLocation: { latitude: passengerLocationClose.latitude, longitude: passengerLocationClose.longitude } })

  console.log('order status:')
  console.log('----------------------')
}

starttest().catch(e => {
  console.log('FAILED')
  console.log(e)
  process.exit(1)
})
  .then(() => console.log('OK'))
