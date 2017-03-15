// server side ctrl and call of service below (express!)...3/3 snippet of newsletter api work...

const responses = require('../models/responses')
const newsletterService = require('../services/newsletter.service')()

module.exports = newsletterController

function newsletterController() {
    return {
        insertEmail
    }

    function insertEmail(req, res) {
        newsletterService.insertEmail(req.body)
            .then((member) => {
                const responseModel = new responses.ItemResponse()
                responseModel.item = member
                res.json(responseModel)
            }).catch((err) => {
                res.status(500).send((err))
            })
    }
}
