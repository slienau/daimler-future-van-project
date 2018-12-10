const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PastRidesSchema = new Schema({
    id:{
        type: String,
        required: true
    },
    from:{
        type: String,
        required: true
    },
    to:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    userID:{
        type: String,
        required: true
    }
    }
);
module.exports = Jacke = mongoose.model('pastrides', PastRidesSchema);