const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LocationSchema = new Schema({
  longitude: {
    type: Number,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  }
})

const RouteSchema = new Schema({

  confirmed: {
    type: Boolean,
    default: false,
    required: true
  },
  userStartLocation: {
    type: LocationSchema,
    required: true
  },
  userDestinationLocation: {
    type: LocationSchema,
    required: true
  },
  vanStartVBS: {
    type: Object,
    required: true
  },
  vanEndVBS: {
    type: Object,
    required: true
  },
  vanDepartureTime: {
    type: Date,
    required: false
  },
  vanArrivalTime: {
    type: Date,
    required: false
  },
  vanId: {
    type: Number,
    required: true
  },
  toStartRoute: {
    type: Object,
    required: true
  },
  vanRoute: {
    type: Object,
    required: true
  },
  toDestinationRoute: {
    type: Object,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  passengerCount: {
    type: Number,
    required: false
  },
  guaranteedVanArrivalTime: {
    type: Date,
    required: false
  },
  toDestinationWalkingTime: {
    type: Number,
    required: false
  }
}
)
module.exports = mongoose.model('routes', RouteSchema)
