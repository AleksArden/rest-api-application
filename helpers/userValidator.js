const Joi = require('joi')
const PASSWORD_REGEX = require('../constans/passwordRegex')

const userValidator = (data) => {

    const Schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required().regex(PASSWORD_REGEX),
    })

    return Schema.validate(data)
}

const emailValidator = (data) => {

    const Schema = Joi.object({
        email: Joi.string().required().email(),
    })
    return Schema.validate(data)
}

const subscriptionValidator = (data) => {

    const Schema = Joi.object({
        subscription: Joi.string().required().valid("starter", "pro", "business")
    })
    return Schema.validate(data)
}

module.exports = {
    userValidator,
    emailValidator,
    subscriptionValidator
}
