const router = require('express').Router();

const { sendAnswerF } = require('../../../app');

router.post("/", async (req, res) => {
    const {to, answer, product} = req.body;
    console.log("client: ", to, "answer: ", answer);
    try {
        
        await sendAnswerF(to, answer, product);
        res.status(220).send("Se envio mensaje");
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})


module.exports = router;