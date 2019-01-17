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
  startLocation: {
    type: LocationSchema,
    required: true
  },
  destination: {
    type: LocationSchema,
    required: true
  },
  startStation: {
    type: Object,
    required: true
  },
  endStation: {
    type: Object,
    required: true
  },
  journeyStartTime: {
    type: Date,
    required: false
  },
  vanStartTime: {
    type: Date,
    required: false
  },
  vanEndTime: {
    type: Date,
    required: false
  },
  destinationTime: {
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
  }
}
)
module.exports = mongoose.model('routes', RouteSchema)
