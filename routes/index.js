let express = require('express');
let router = express.Router();

let inventar;

const PastRide = require('./PastRides.js');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    PastRide.find()
        .then(items => res.json(items))
        .catch(err => res.status(404).json({ msg: 'No items found '+err.message }));
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
