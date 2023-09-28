const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();


//check apiKey
router.use(apiKey)

//check permission
router.use(permission('0000'))


// router.get('', (req, res, next) => {
    //   res.status(200).json('Hello World!!!');
    // });
    
router.use('/v1/api', require('./access'));
module.exports = router;
