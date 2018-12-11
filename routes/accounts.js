const _ = require('lodash')
const express = require('express');
const router = express.Router();
const Account = require('../models/Account.js');

router.get('/:accountId', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    console.log(req.params.accountId);

    // Set to admin if "me" --> later connect with session

    Account.find({'_id':req.params.accountId}, function(error, item){
        res.json(_.omit(item, ['password']));
    })
        .catch(err => res.status(404).json({err:err, msg: 'No items found' }));
});

module.exports = router;