let express = require('express');
let router = express.Router();
const Account = require('../models/Account.js');

router.get('/', function(req, res) {

    // Set to admin if "me" --> later connect with session
    res.setHeader('Content-Type', 'application/json');
    console.log(req.user._id);
    Account.findById(req.user._id, function(error, item){
        console.log('sind hier');
        console.log(item);
        delete item.password;
        res.json(item);
    })
        .catch(err => res.status(404).json({err:err, msg: 'No items found' }));

});
router.get('/orders', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.json([{
        "id": "13cf81ee-8898-4b7a-a96e-8b5f675deb3c",
        "accountId": "0e8cedd0-ad98-11e6-bf2e-47644ada7c0f",
        "orderTime": "2018-02-23T18:25:43.511Z",
        "active": false,
        "canceled": false,
        "virtualBusStopStart": {
            "id": "7416550b-d47d-4947-b7ec-423c9fade07f",
            "accessible": true,
            "location": {
                "latitude": 52.515598,
                "longitude": 13.326860
            }
        },
        "virtualBusStopEnd": {
            "id": "76d7fb2f-c264-45a0-ad65-b21c5cf4b532",
            "accessible": true,
            "location": {
                "latitude": 52.512974,
                "longitude": 13.329145
            }
        },
        "startTime": "2018-02-23T18:30:25.000Z",
        "endTime": "2018-02-23T18:45:48.000Z"
    }]);
});

module.exports = router;