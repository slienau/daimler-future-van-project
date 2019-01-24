const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({

  accountId: {
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
  vanStartVBS: {
    type: String,
    required: true
  },
  vanEndVBS: {
    type: String,
    required: true
  },
  vanEnterTime: {
    type: Date,
    required: false
  },
  vanExitTime: {
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
  },
  route: {
    type: String,
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  bonusMultiplier: {
    type: Number,
    default: 10,
    required: true
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
    required: true
  },
  co2savings: {
    type: Number,
    default: 0,
    required: true
  }
}
)
module.exports = mongoose.model('orders', OrderSchema)
