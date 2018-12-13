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

const VirtualBusStopSchema = new Schema({

  location: {
    type: LocationSchema,
    required: true
  },
  assesible: {
    type: Boolean,
    required: true
  }
}
)
module.exports = mongoose.model('virtualBusstop', VirtualBusStopSchema)
