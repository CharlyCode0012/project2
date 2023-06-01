const router = require('express').Router();

const sendAnswerRouter = require('./routes/sendAnswer');

router.use('/sendAnswer', sendAnswerRouter);

module.exports = router;


