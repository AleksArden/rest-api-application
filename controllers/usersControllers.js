const catchAsync = require('../helpers/catchAsync')
const path = require('path')
const { createUser,
    refreshToken,
    moveAndEditFile } = require('../services/usersServices')
const { signToken } = require('../services/token')

const DOMAIN = require('../constans/domain')
const avatarDir = path.join(process.cwd(), 'public', 'avatars')
const PORT = process.env.PORT

/**
 * user registration  
 * @param {user<Object>}
 */

const registration = catchAsync(async (req, res) => {
    const newUser = await createUser(req.body)

    newUser.password = undefined
    console.log(newUser)
    const { email, subscription, avatarURL } = newUser

    res.status(201).json({
        user: { email, subscription, avatarURL }
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
    const { email, subscription, avatarURL } = req.user

    res.status(200).json({ email, subscription, avatarURL })
}

/**
 * update avatar
 * @param {Object}
 */

const updateUserAvatar = catchAsync(async (req, res) => {
    const { user } = req
    const { path: tmpUpload, filename } = req.file

    const publicUpload = path.join(avatarDir, filename)

    await moveAndEditFile(tmpUpload, publicUpload)

    const avatar = path.join('avatars', filename)
    const avatarURL = `http://${DOMAIN}${PORT}/${avatar}`

    user.avatarURL = avatarURL
    await user.save()

    res.status(200).json({ avatarURL })
})

module.exports = {
    registration,
    login,
    logout,
    currentUser,
    updateUserAvatar
}