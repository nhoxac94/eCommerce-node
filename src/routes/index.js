const express = require('express');
const router = express.Router();

router.use('/v1/api', require('./access'));

// router.get('', (req, res, next) => {
//   res.status(200).json('Hello World!!!');
// });

module.exports = router;
