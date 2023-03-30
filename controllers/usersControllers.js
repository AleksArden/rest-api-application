const catchAsync = require('../helpers/catchAsync')
const { createUser, refreshToken } = require('../models/users')
const { signToken } = require('../services/token')


/**
 * user registration 
 * @param {user<Object>}
 */

const registration = catchAsync(async (req, res) => {
    const newUser = await createUser(req.body)

    newUser.password = undefined
    const { email, subscription } = newUser

    res.status(201).json({
        user: { email, subscription }
    })
})

/**
 * create token and user login
 * @param {Object}
 */

const login = catchAsync(async (req, res) => {
    const user = req.body

    const token = signToken(user.id)

    await refreshToken(user.id, token)

    const { email, subscription } = user

    res.status(200).json({
        token: token, user: { email, subscription }
    })
})

/**
 * delete token and  user logout
 * @param {Object}
 */

const logout = catchAsync(async (req, res) => {

    await refreshToken(req.user.id, null)
    res.sendStatus(204)
})

/**
 * get current User
 * @param {Object}  
 *  
 */

const currentUser = (req, res,) => {
    const { email, subscription } = req.user

    res.status(200).json({ email, subscription })
}

module.exports = {
    registration,
    login,
    logout,
    currentUser
}