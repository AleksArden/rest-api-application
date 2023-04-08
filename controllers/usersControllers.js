const catchAsync = require('../helpers/catchAsync')
const uuid = require('uuid').v4;
require('dotenv').config()
const path = require('path')

const { createUser,
    refreshToken,
    moveAndEditFile,
} = require('../services/usersServices')
const { signToken } = require('../services/token')
const sendEmail = require('../services/sendEmail')

const avatarDir = path.join(process.cwd(), 'public', 'avatars')
const { BASE_URL } = process.env

/**
 * user registration  
 * @param {user<Object>}
 */
const registration = catchAsync(async (req, res) => {
    req.body.verificationToken = uuid()

    const newUser = await createUser(req.body)

    newUser.password = undefined

    await sendEmail(newUser)

    const { email, subscription, avatarURL } = newUser

    res.status(201).json({
        user: { email, subscription, avatarURL }
    })
})

/**
 * verify email
 * @param {user<Object>}
 */
const verifyEmail = catchAsync(async (req, res) => {
    const user = req.user
    user.verificationToken = null
    user.verify = true

    await user.save()

    res.status(200).json({ message: 'Verification successful' })
})

/**
 * resend verify email
 * @param {user<Object>}
 */
const resendVerifyEmail = catchAsync(async (req, res) => {
    const user = req.user

    await sendEmail(user)

    res.status(200).json({ message: 'Verification email sent' })
})

/**
 * create token and user login
 * @param {Object}
 */

const login = catchAsync(async (req, res) => {
    const user = req.user

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
    const { email, subscription, avatarURL } = req.user

    res.status(200).json({ email, subscription, avatarURL })
}

/**
 * update avatar
 * @param {Object}
 */

const updateUserAvatar = catchAsync(async (req, res) => {
    const user = req.user

    const { path: tmpUpload, filename } = req.file

    const publicUpload = path.join(avatarDir, filename)

    await moveAndEditFile(tmpUpload, publicUpload)

    const avatar = path.join('avatars', filename)
    const avatarURL = `${BASE_URL}/${avatar}`

    user.avatarURL = avatarURL
    await user.save()

    res.status(200).json({ avatarURL })
})

/**
 * Change subscription
 * @param {Object} subscription
 * @param {Object} user
 */

const updateSubscription = catchAsync(async (req, res) => {
    const { subscription } = req.body
    const user = req.user
    user.subscription = subscription

    await user.save()

    res.status(200).json({ subscription: user.subscription })

})

module.exports = {
    registration,
    verifyEmail,
    login,
    logout,
    currentUser,
    updateUserAvatar,
    resendVerifyEmail,
    updateSubscription
}