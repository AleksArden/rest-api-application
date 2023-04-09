const User = require('../models/userModel')
const multer = require('multer')

const catchAsync = require('../helpers/catchAsync')
const { userValidator, emailValidator, subscriptionValidator } = require('../helpers/userValidator')
const { getUser, getUserbyId } = require('../services/usersServices')
const { decodedToken } = require('../services/token')
const { reset } = require('nodemon')

/**
 * check validate user for regisration and login
 * @param {object}
 * @returns {user<object>}
 */

const checkValidateUser = (req, res, next) => {
    const { error } = userValidator(req.body)

    if (error) {
        const errorValidation = error.details[0].context?.key
        res.status(400).json({ message: `${errorValidation} is required  or invalid ${errorValidation}` })
        return
    }
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
 * check verificationToken for email ferify 
 * @param {string} verificationToken
 * @returns {user<Object>}
 */

const checkVerificationToken = catchAsync(async (req, res, next) => {
    const { verificationToken } = req.params

    const user = await User.findOne({ verificationToken: verificationToken })

    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }
    req.user = user
    next()
})

/**
 * check  email and get User for resend verify
 * @param {string} email
 * @returns {user<Object>}
 */
const checkResendVerifyEmail = catchAsync(async (req, res, next) => {
    const { email } = req.body

    const { error } = emailValidator({ email })
    if (error) {
        return res.status(400).json({ message: 'missing required field email' })
    }

    const user = await getUser(email)

    if (!user) {
        return res.status(401).json({ message: 'Email is wrong' })
    }
    if (user.verify) {
        return res.status(400).json({ message: 'Verification has already been passed' })
    }
    req.user = user
    next()
})

/**
 * Check user`s email and password for login
 * @param {Object}
 * @returns {user<Object>} 
 */
const checkValidationLogin = catchAsync(async (req, res, next) => {
    const { email, password, } = req.body

    const user = await getUser(email)

    if (!user) return res.status(401).json({ message: 'Email or password is wrong' })

    if (!user.verify) return res.status(401).json({ message: 'Email not verify' })

    const passwordIsValid = await user.checkPassword(password, user.password)
    if (!passwordIsValid) return res.status(401).json({ message: 'Email or password is wrong' })

    req.user = user

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


/**
 * Multer middleware, avatar check 
 * @param {file<object>} 
 * @returns {file<object>}
 */

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'tmp')
    },
    filename: (req, file, cb) => {

        cb(null, `${req.user._id}-${file.originalname}`)
    },
    limits: {
        fileSize: 1024 * 1024
    }
})

const multerFilter = (req, file, cb) => {

    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new Error('I don`t know what is it... '), false)
    }
}

const uploadUserAvatar = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
}).single('avatar')

/**
 * Check validate subscription
 * @param {Object} subscription
 * @returns {Subscription<Object>}
 */

const checkSubscriptionEnum = (req, res, next) => {

    const { error } = subscriptionValidator(req.body)

    if (error) {
        return res.status(400).json({ message: 'Subscription is required or value is invalid' })
    }
    next()
}


module.exports = {
    checkValidateUser,
    compareEmailUsers,
    checkValidationLogin,
    protect,
    uploadUserAvatar,
    checkVerificationToken,
    checkResendVerifyEmail,
    checkSubscriptionEnum
}