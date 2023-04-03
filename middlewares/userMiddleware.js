const User = require('../models/userModel')
const multer = require('multer')

const catchAsync = require('../helpers/catchAsync')
const { userValidator } = require('../helpers/userValidator')
const { getUser, getUserbyId } = require('../services/usersServices')
const { decodedToken } = require('../services/token')

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

module.exports = {
    checkValidateUser,
    compareEmailUsers,
    checkValidationLogin,
    protect,
    uploadUserAvatar,
}