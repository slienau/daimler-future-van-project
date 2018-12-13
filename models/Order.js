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
    required: true
  },
  endTime: {
    type: Date,
    required: true
  }
}
)
module.exports = mongoose.model('orders', OrderSchema)
