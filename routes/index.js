let express = require('express');
let router = express.Router();

let inventar;

const PastRide = require('./PastRides.js');
/* GET home page. */
router.get('/accounts/:accountId', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    console.log(req.params);
    var staticUserData = {
        "id": req.params.accountId,
        "firstName": "Max",
        "lastName": "Müller",
        "address":{
            "street": "Salzufer 1",
            "zipcode": "10587",
            "city": "Berlin"
        }
    };
    res.json(staticUserData);
    /*PastRide.find()
        .then(items => res.json(JSON.stringify(items),null,3))
        .catch(err => res.status(404).json({ msg: 'No items found' }));*/
});
router.post("/", async function(req,res){

    console.log(req.body['id'] + req.body['from']);
    const newRide = new PastRide({
        id: req.body.id,
        from: req.body.from,
        to: req.body.to,
        date: req.body.date,
        time: req.body.time,
        userID: req.body.userID
    });
    await newRide.save();

    res.setHeader('Content-Type', 'application/json');
    PastRide.find()
        .then(items => res.json(items))
        .catch(err => res.status(404).json({ msg: 'No items found' }));
});


module.exports = router;
