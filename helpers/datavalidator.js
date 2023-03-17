const Joi = require('joi')

const dataValidatorCreate = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(24),
        email: Joi.string().required().email(),
        phone: Joi.string().required(),
        favorite: Joi.boolean(),
    })
    return schema.validate(data)
}

const validatorFavoriteField = (data) => {
    const schema = Joi.object({
        favorite: Joi.boolean().required(),
    })
    return schema.validate(data)
}

module.exports = {
    dataValidatorCreate,
    validatorFavoriteField
}
