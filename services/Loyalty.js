const vanMultiplier = 10
const walkingMultiplier = 20
const waitingMultiplier = 10
let longWaitingMultiplier = 1.0
let longWalkingMultiplier = 1.0
let offPeakTimeMultiplier = 1.0
const co2PerKilometer = 0.13 // EU limit for new cars = 0.13 kg/km

class Loyalty {
  static loyaltyPoints (route) {
    let vanDistance, walkingDistance, waitingTime, co2savings, loyaltyPoints
    if (route.vanRoute.routes[0].legs[0].distance) {
      vanDistance = route.vanRoute.routes[0].legs[0].distance.value / 1000
    }
    if (route.toStartRoute.routes[0].legs[0].distance && route.toDestinationRoute.routes[0].legs[0].distance) {
      walkingDistance = (route.toStartRoute.routes[0].legs[0].distance.value + route.toDestinationRoute.routes[0].legs[0].distance.value) / 1000
    }
    if (route.vanETAatStartVBS && route.toStartRoute.routes[0].legs[0].duration) {
      // Calculate the difference between van ETA at Start VBS and now in minutes
      // Subtract the walking time of the user to the Start VBS because he isn't waiting while walking to Start VBS
      waitingTime = Math.abs(Math.round((((route.vanETAatStartVBS - new Date()) % 86400000) % 3600000) / 60000) - route.toStartRoute.routes[0].legs[0].duration.value)
      if (waitingTime > 20) {
        waitingTime = 20
      }
      if (waitingTime > 10) {
        longWaitingMultiplier = 1.25
      }
      if (walkingDistance > 1) {
        longWalkingMultiplier = 1.25
      }
      let hours = route.vanETAatStartVBS.getHours()
      if (hours <= 7 || (hours >= 11 && hours <= 14) || hours >= 20) {
        offPeakTimeMultiplier = 1.25
      }
    }
    co2savings = vanDistance * co2PerKilometer
    co2savings = Number(co2savings.toFixed(2))
    loyaltyPoints = vanDistance * vanMultiplier * offPeakTimeMultiplier + walkingDistance * walkingMultiplier * longWalkingMultiplier + waitingTime * waitingMultiplier * longWaitingMultiplier
    loyaltyPoints = Number(loyaltyPoints.toFixed(0))
    vanDistance = Number(vanDistance.toFixed(0))
    return { loyaltyPoints: loyaltyPoints, co2savings: co2savings, distance: vanDistance }
  }
}

module.exports = Loyalty
