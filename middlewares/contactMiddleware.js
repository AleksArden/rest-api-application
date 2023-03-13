const fs = require('fs/promises')
const catchAsync = require('../helpers/catchAsync')
const dataValidator = require("../helpers/datavalidator")

/**
 * Check body has data
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {Object} 
 */
const chekHasBodyContact = (req, res, next) => {

    if (!Object.keys(req.body).length) {
        res.status(400).json({ message: 'missing fields' })
        return
    }
    next()
}

/**
 * Validates fields
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {Object}
 */
const chekContactFields = (req, res, next) => {

    const { error, value } = dataValidator(req.body)
    if (error) {
        if (error.details[0].context.limit) {
            res.status(400).json({ message: 'name length must be at least 3 characters long and less than or equal to 24 characters long' })
            return
        }
        if (error.details[0].context.value) {
            res.status(400).json({ message: 'must be a valid email' })
            return
        }
        res.status(400).json({ message: `missing required ${error.details[0].context?.key} field` })
        return
    }
    req.body = value
    next()
}

/**
 * Validates id
 * @param {id<string>}
 * @returns {id<string>}
 */
const checkContactId = catchAsync(async (req, res, next) => {

    const { contactId } = req.params
    const contacts = JSON.parse(await fs.readFile('./models/contacts.json'))

    const contact = contacts.find(({ id }) => id === contactId)

    if (!contact) return res.status(404).json({ message: 'Not found' })

    next()
})


module.exports = {
    chekContactFields,
    chekHasBodyContact,
    checkContactId
}