const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({

        username:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true
        },
        address:{
            type: String,
            required: true
        },
        firstName:{
            type: String,
            required: true
        },
        lastName:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true
        }
    }
);
module.exports = Account = mongoose.model('accounts', AccountSchema);