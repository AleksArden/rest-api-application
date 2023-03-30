const jwt = require('jsonwebtoken')

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

const decodedToken = (token) => jwt.verify(token, process.env.JWT_SECRET)

module.exports = {
    signToken,
    decodedToken
}