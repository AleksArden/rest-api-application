const Joi = require('joi')

const dataValidator = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(24),
        email: Joi.string().required().email(),
        phone: Joi.string().required(),
    })
    return schema.validate(data)
}
module.exports = dataValidator
