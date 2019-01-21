const GoogleMapsHelper = require('../services/GoogleMapsHelper.js')
const Route = require('../models/Route.js')
const VirtualBusStop = require('../models/VirtualBusStop.js')

class ManagementSystem {

  // Returns the van that will execute the ride
  static async requestVan (start, fromVB, toVB, destination, time = new Date(), passengerCount = 1) {

    const potentialVans = []
    for(let counter= 0;counter<3; counter++ ){

      // Test 1 Gibt es potentialRoute --> dann gesperrt, wenn nicht eigene Route

      // Test 2 startVB oder destVB gleich

      // Test 3 noch keine route mit pooling

    }
    const vanId = Math.floor(Math.random() * 3) + 1

    // Route ZUM ersten Virtual BusStop
    const route = await GoogleMapsHelper.simpleGoogleRoute(start, fromVB.location)

    this.vans[vanId-1].potentialRoute = route

    const timeToVB = GoogleMapsHelper.readDurationFromGoogleResponse(route)

    return {vanId: vanId, nextStopTime: new Date(Date.now()+(timeToVB*1000))}
  }

  static async confirmVan(fromVB, toVB, vanId, passengerCount = 1){

    this.vans[vanId-1].route = this.vans[vanId-1].potentialRoute
    this.vans[vanId-1].potentialRoute = null

    const timeToVB = GoogleMapsHelper.readDurationFromGoogleResponse(this.vans[vanId-1].route)

    this.vans[vanId-1].nextStopTime = new Date(Date.now() + (timeToVB * 1000))
    this.vans[vanId-1].nextStops.push(fromVB)
    this.vans[vanId-1].currentStep = 0
    this.vans[vanId-1].lastStepTime = new Date()

    return this.vans[vanId-1]
  }

  static async startRide(order){
    const wholeRoute = Route.findById(order.route)
    const vanRoute = wholeRoute.vanRoute
    const vanId = order.vanId
    const toVB = await VirtualBusStop.findById(order.virtualBusStopEnd)

    this.vans[vanId-1].route = vanRoute

    const timeToVB = GoogleMapsHelper.readDurationFromGoogleResponse(this.vans[vanId-1].route)

    this.vans[vanId-1].nextStopTime = new Date(Date.now() + (timeToVB * 1000))
    this.vans[vanId-1].nextStops.push(toVB)
    this.vans[vanId-1].currentStep = 0
    this.vans[vanId-1].lastStepTime = new Date()
    this.vans[vanId-1].waiting = false

  }

  static async endRide(order){
    const vanId = order.vanId

    this.vans[vanId-1].route= null
    this.vans[vanId-1].lastStepTime= new Date ()
    this.vans[vanId-1].nextStopTime= null
    this.vans[vanId-1].nextStops=[]
    this.vans[vanId-1].potentialRoute= null
    this.vans[vanId-1].currentlyPooling= false
    this.vans[vanId-1].currentStep=0
    this.vans[vanId-1].waiting= false

  }

  static async cancelRide(order){
    const vanId = order.vanId

    this.vans[vanId-1].route= null
    this.vans[vanId-1].lastStepTime= new Date ()
    this.vans[vanId-1].nextStopTime= null
    this.vans[vanId-1].nextStops=[]
    this.vans[vanId-1].potentialRoute= null
    this.vans[vanId-1].currentlyPooling= false
    this.vans[vanId-1].currentStep=0
    this.vans[vanId-1].waiting= false

  }

  static initializeVans() {
    for (let i = 0; i < 3; i++) {
      this.vans[i] = {
        vanId: i+1,
        location: {
          latitude: 52.5150 + Math.random() * 3 / 100,
          longitude: 13.3900 + Math.random() * 3 / 100
          },
        route: null,
        lastStepTime: new Date (),
        nextStopTime: null,
        nextStops:[],
        potentialRoute: null,
        currentlyPooling: false,
        currentStep:0,
        waiting: false
      }
    }
  }

  static updateVanLocations() {


    const currentTime = new Date()
    console.log('Update Van Locations called at ',currentTime)

    ManagementSystem.vans.forEach((van) => {

      // If van does not have a route, stop.
      if(!van.route) return

      if(van.waiting) return

      // This happens if van has not reached the next bus Stop yet
      if(currentTime < van.nextStopTime) {

        const timePassed = ((currentTime - van.lastStepTime) / 1000)
        let timeCounter = 0

        // Iterate through all steps ahead of current step & find the one that matches the time that has passed
        for(let step = van.currentStep; step < van.route.routes[0].legs[0].steps.length; step++){

          timeCounter += van.route.routes[0].legs[0].steps[step].duration.value

          if(timeCounter > timePassed){

            van.location = {
              latitude: van.route.routes[0].legs[0].steps[step].start_location.lat,
              longitude: van.route.routes[0].legs[0].steps[step].start_location.lng
            }
            if(step > van.currentStep) van.lastStepTime = currentTime
            van.currentStep = step

            break
          }
        }
      }
      else {
        van.route = null
        van.currentStep = 0
        van.location = {
          latitude: van.route.routes[0].legs[0].end_location.lat,
          longitude: van.route.routes[0].legs[0].end_location.lng
        }
        van.lastStepTime = currentTime
        van.nextStops.shift()
        van.waiting = true

      }

    })
  }
}

ManagementSystem.vans = []


module.exports = ManagementSystem
