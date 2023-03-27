const User = require('../models/userModel')
const catchAsync = require('../helpers/catchAsync')
const { userValidator } = require('../helpers/userValidator')
const { getUser, getUserbyId } = require('../models/users')
const { decodedToken } = require('../services/token')

/**
 * check validate user for regisration and login
 * @param {object}
 * @returns {user<object>}
 */

const checkValidateUser = (req, res, next) => {
    const { error, value } = userValidator(req.body)

    if (error) {
        const errorValidation = error.details[0].context?.key
        res.status(400).json({ message: `${errorValidation} is required  or invalid ${errorValidation}` })
        return
    }
    req.body = value
    next()
}

/**
 * Compare user`s email for registration
 * @param {object}
 * @returns {void}
 */

const compareEmailUsers = catchAsync(async (req, res, next) => {
    const { email } = req.body

    const userExists = await User.exists({ email: email })

    if (userExists) return res.status(409).json({ message: 'Email in use' })

    next()
})

/**
 * Check user`s email and password for login
 * @param {Object}
 * @returns {user<Object>} 
 */

const checkValidationLogin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    const user = await getUser(email)
    if (!user) return res.status(401).json({ message: 'Email or password is wrong' })

    const passwordIsValid = await user.checkPassword(password, user.password)
    if (!passwordIsValid) return res.status(401).json({ message: 'Email or password is wrong' })

    req.body = user

    next()
})

/**
 * check validet token and search of user by token  
 * @param {Object}
 * @returns {user<Object>}
 */

const protect = catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.startsWith('Bearer') && req.headers.authorization?.split(' ')[1]

    if (!token) return res.status(401).json({ message: 'Not authorized' })

    let decoded;
    try {
        decoded = decodedToken(token)

    } catch (error) {
        console.log(error.message)
        return res.status(401).json({ message: 'Not authorized' })
    }

    const currentUser = await getUserbyId(decoded.id)

    if (!currentUser || currentUser.token !== token) return res.status(401).json({ message: 'Not authorized' })

    req.user = currentUser
    next()
})

module.exports = {
    checkValidateUser,
    compareEmailUsers,
    checkValidationLogin,
    protect,
}