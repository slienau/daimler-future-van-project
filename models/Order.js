const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({

  accountID: {
    type: String,
    required: true
  },
  orderTime: {
    type: Date,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  },
  canceled: {
    type: Boolean,
    required: true
  },
  virtualBusStopStart: {
    type: String,
    required: true
  },
  virtualBusStopEnd: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: false
  },
  endTime: {
    type: Date,
    required: false
  },
  vanId: {
    type: Number,
    required: true
  },
  vanArrivalTime: {
    type: Date,
    required: true
  }
}
)
module.exports = mongoose.model('orders', OrderSchema)
