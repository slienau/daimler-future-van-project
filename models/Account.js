const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AddressSchema = new Schema({

  street: {
    type: String,
    required: true
  },
  zipcode: {
    type: Number,
    required: true
  },
  city: {
    type: String,
    required: true
  }
}
)

const AccountSchema = new Schema({

  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: AddressSchema
}
)

module.exports = mongoose.model('accounts', AccountSchema)
